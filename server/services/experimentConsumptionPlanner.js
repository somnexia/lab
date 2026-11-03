'use strict';

const { Op } = require('sequelize');
const { Inventory } = require('../models');
const { UnitConversionError, convertQuantity, formatQuantity } = require('./unitNormalizationService');

const getLotOnHand = (lot) => {
  if (!lot) return 0;
  const raw = lot.total_quantity ?? lot.substance_amount;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatLotLabel = (lot) => {
  const onHand = getLotOnHand(lot);
  const unit = lot.unit_measure ? ` ${lot.unit_measure}` : '';
  const status = lot.status ? ` · ${lot.status}` : '';
  return `Lot #${lot.id} · ${onHand}${unit}${status}`;
};

const resolveCatalogLabel = (input) =>
  input.catalogName
  || input.catalog_name
  || `${input.itemType || input.item_type} #${input.referenceId ?? input.reference_id}`;

/**
 * Разрешён ли лот для списания: storage_id входит в склады lab эксперимента.
 * storageIds === null — без фильтра (только явный обход, обычно не используется).
 */
function isLotInAllowedStorages(lot, storageIds) {
  if (!lot) return false;
  if (storageIds === null) return true;
  if (!Array.isArray(storageIds) || !storageIds.length) return false;
  if (lot.storage_id == null) return false;
  return storageIds.map(Number).includes(Number(lot.storage_id));
}

/**
 * Лоты каталога (item_type + reference_id), ограниченные складами lab.
 * @param {string} itemType
 * @param {number} referenceId
 * @param {{ storageIds?: number[]|null, transaction?: object }} [options]
 *   storageIds — id chemstorages lab эксперимента;
 *   null = все склады (не для обычного run);
 *   [] = ни одного лота.
 */
const loadCatalogLots = async (itemType, referenceId, options = {}) => {
  const { storageIds = null, transaction = null } = options;
  const where = {
    item_type: itemType,
    reference_id: Number(referenceId),
  };

  if (storageIds !== null) {
    where.storage_id = {
      [Op.in]: storageIds.length ? storageIds.map(Number) : [-1],
    };
  }

  return Inventory.findAll({
    where,
    order: [
      ['expiration_date', 'ASC'],
      ['id', 'ASC'],
    ],
    transaction,
  });
};

/**
 * Симуляция расхода реагентов.
 * options.storageIds — склады владеющей lab эксперимента (обязательно
 * для tenant-safe run): без них брались бы лоты всех лабораторий.
 */
const planReagentConsumption = async (inputs, options = {}) => {
  const { transaction = null, storageIds = null } = options;
  const lotRemaining = new Map();
  const lotCache = new Map();
  const catalogLotsCache = new Map();
  const checks = [];
  const allocations = [];

  const getLot = async (lotId) => {
    if (!lotCache.has(lotId)) {
      lotCache.set(lotId, await Inventory.findByPk(lotId, { transaction }));
    }
    return lotCache.get(lotId);
  };

  const readLotBalance = (lot) => {
    if (!lotRemaining.has(lot.id)) {
      lotRemaining.set(lot.id, getLotOnHand(lot));
    }
    return lotRemaining.get(lot.id);
  };

  const reserveFromLot = (lot, amount) => {
    const current = readLotBalance(lot);
    lotRemaining.set(lot.id, current - amount);
  };

  for (const input of inputs) {
    const inputRole = input.inputRole || input.input_role;
    const catalogName = resolveCatalogLabel(input);

    if (inputRole !== 'reagent') {
      checks.push({
        inputId: input.id,
        catalogName,
        status: 'skipped',
        reason: 'Equipment inputs are not stock-checked',
      });
      continue;
    }

    const quantity = input.quantity != null ? Number(input.quantity) : null;
    const unitMeasure = input.unitMeasure || input.unit_measure || null;

    if (quantity == null || quantity <= 0) {
      checks.push({
        inputId: input.id,
        catalogName,
        status: 'warning',
        reason: 'No amount specified — stock check skipped',
      });
      continue;
    }

    const inventoryId = input.inventoryId ?? input.inventory_id ?? null;
    let remainingInInputUnit = quantity;
    let blockReason = null;

    let lotsToUse = [];
    if (inventoryId) {
      const lot = await getLot(Number(inventoryId));
      if (lot && isLotInAllowedStorages(lot, storageIds)) {
        lotsToUse = [lot];
      } else if (lot && !isLotInAllowedStorages(lot, storageIds)) {
        checks.push({
          inputId: input.id,
          catalogName,
          requested: quantity,
          unitMeasure,
          status: 'insufficient',
          reason: `Lot #${inventoryId} is outside this experiment's laboratory storages`,
        });
        continue;
      }
    } else {
      const key = `${input.itemType || input.item_type}:${input.referenceId ?? input.reference_id}`;
      if (!catalogLotsCache.has(key)) {
        catalogLotsCache.set(
          key,
          await loadCatalogLots(
            input.itemType || input.item_type,
            input.referenceId ?? input.reference_id,
            { storageIds, transaction }
          )
        );
      }
      lotsToUse = catalogLotsCache.get(key);
    }

    if (inventoryId && !lotsToUse.length) {
      checks.push({
        inputId: input.id,
        catalogName,
        requested: quantity,
        unitMeasure,
        status: 'insufficient',
        reason: `Lot #${inventoryId} not found`,
      });
      continue;
    }

    for (const lot of lotsToUse) {
      if (remainingInInputUnit <= 1e-9) break;

      const lotUnit = lot.unit_measure || unitMeasure || 'g';

      let needInLotUnit;
      try {
        needInLotUnit = convertQuantity(remainingInInputUnit, unitMeasure, lotUnit);
      } catch (error) {
        blockReason = error instanceof UnitConversionError
          ? `Unit mismatch for ${catalogName}: input uses ${unitMeasure || '—'}, lot uses ${lotUnit}`
          : error.message;
        break;
      }

      const available = readLotBalance(lot);
      const take = Math.min(needInLotUnit, available);

      if (take > 1e-9) {
        reserveFromLot(lot, take);
        const consumedInInputUnit = convertQuantity(take, lotUnit, unitMeasure);
        remainingInInputUnit -= consumedInInputUnit;

        allocations.push({
          input,
          lot,
          quantityConsumed: take,
          unitMeasure: lotUnit,
        });
      }
    }

    const source = inventoryId
      ? (lotsToUse[0] ? formatLotLabel(lotsToUse[0]) : `Lot #${inventoryId}`)
      : 'Lab storages (aggregate)';

    if (blockReason) {
      checks.push({
        inputId: input.id,
        catalogName,
        requested: quantity,
        unitMeasure,
        source,
        status: 'insufficient',
        reason: blockReason,
      });
      continue;
    }

    if (remainingInInputUnit > 1e-9) {
      const fulfilled = quantity - remainingInInputUnit;
      checks.push({
        inputId: input.id,
        catalogName,
        requested: quantity,
        unitMeasure,
        available: fulfilled,
        availableUnit: unitMeasure,
        source,
        status: 'insufficient',
        reason: `Need ${formatQuantity(quantity, unitMeasure)} of ${catalogName}, only ${formatQuantity(fulfilled, unitMeasure)} available (${source})`,
      });
      continue;
    }

    checks.push({
      inputId: input.id,
      catalogName,
      requested: quantity,
      unitMeasure,
      source,
      status: 'ok',
      reason: 'Sufficient stock',
    });
  }

  const blocking = checks.filter((check) => check.status === 'insufficient');
  const warnings = checks.filter((check) => check.status === 'warning');

  return {
    checks,
    allocations,
    ready: blocking.length === 0,
    blocking,
    warnings,
  };
};

module.exports = {
  planReagentConsumption,
  loadCatalogLots,
  isLotInAllowedStorages,
  getLotOnHand,
  formatLotLabel,
};
