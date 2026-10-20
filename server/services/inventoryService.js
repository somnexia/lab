const { Op } = require('sequelize');
const { Inventory, sequelize, ChemStorage } = require('../models');
const {
  ChemElement,
  ChemEquipment,
  ChemCompound,
  ChemMixture,
  StorageUnit,
  InventoryStorageUnit,
} = require('../models');
const CatalogReferenceError = require('../errors/CatalogReferenceError');
const {
  isInventoryItemType,
  assertCatalogReference,
  validateInventoryCatalogPair,
  validateInventoryCatalogPatch,
} = require('./catalogReferenceService');
const {
  skipLabScope,
  assertLabAccess,
  scopeByStorageIds,
} = require('../utils/labScope');

/** Фаза 5b: inventory.storage_id → chemstorages.laboratory_id */
async function assertInventoryLabAccess(user, lot, action = 'доступа к инвентарю') {
  if (skipLabScope(user)) return;
  if (!lot?.storage_id) {
    const err = new Error(`Недостаточно прав для ${action}: партия без склада`);
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }
  const storage = await ChemStorage.findByPk(lot.storage_id);
  assertLabAccess(user, storage?.laboratory_id, action);
}

async function assertStorageIdForInventory(user, storageId) {
  const storage = await ChemStorage.findByPk(Number(storageId));
  if (!storage) {
    throw new CatalogReferenceError(`ChemStorage ${storageId} not found`, {
      field: 'storage_id',
    });
  }
  assertLabAccess(user, storage.laboratory_id, 'привязки инвентаря к хранилищу');
  return storage;
}

const createInventoryItem = async (data, user) => {
  const transaction = await sequelize.transaction();

  try {
    const { item_type, reference_id, storageunit_id } = data;

    if (!item_type || reference_id == null) {
      throw new CatalogReferenceError(
        'item_type and reference_id are required when creating an inventory lot',
        { fields: ['item_type', 'reference_id'] }
      );
    }

    if (!data.storage_id) {
      throw new CatalogReferenceError('storage_id is required when creating an inventory lot', {
        field: 'storage_id',
      });
    }

    await assertStorageIdForInventory(user, data.storage_id);

    const validated = await validateInventoryCatalogPair({
      item_type,
      reference_id,
      item_name: data.item_name,
    });

    const inventoryPayload = {
      ...data,
      item_type: validated.item_type,
      reference_id: validated.reference_id,
      item_name: validated.item_name,
    };
    delete inventoryPayload.storageunit_id;

    const inventoryItem = await Inventory.create(inventoryPayload, { transaction });

    if (storageunit_id) {
      const lotQuantity = Number(
        inventoryPayload.total_quantity ?? inventoryPayload.substance_amount ?? 0
      );
      await InventoryStorageUnit.create(
        {
          inventory_id: inventoryItem.id,
          storageunit_id: Number(storageunit_id),
          quantity: Number.isFinite(lotQuantity) ? lotQuantity : 0,
        },
        { transaction }
      );
    }

    await transaction.commit();

    return getInventoryItemById(inventoryItem.id, { includeRelations: true, user });
  } catch (error) {
    await transaction.rollback();
    if (error instanceof CatalogReferenceError) {
      throw error;
    }
    console.error('Ошибка при создании записи Inventory:', error);
    throw error;
  }
};

const getAllInventoryItems = async (user) => {
  return getInventoryLots({ user });
};

const getInventoryLots = async (options = {}) => {
  try {
    const { itemType, itemTypes, includeCatalog = true, user } = options;
    let where = {};

    if (itemType) {
      if (!isInventoryItemType(itemType)) {
        throw new CatalogReferenceError(`Unsupported item_type filter: ${itemType}`);
      }
      where.item_type = itemType;
    } else if (itemTypes?.length) {
      const invalid = itemTypes.filter((type) => !isInventoryItemType(type));
      if (invalid.length) {
        throw new CatalogReferenceError('Invalid item_types filter', { invalid });
      }
      where.item_type = { [Op.in]: itemTypes };
    }

    where = await scopeByStorageIds(user, where, 'storage_id');

    const include = [
      {
        model: StorageUnit,
        as: 'storageUnits',
        required: false,
      },
    ];

    if (includeCatalog) {
      include.push(
        { model: ChemElement, as: 'chemElement', required: false },
        { model: ChemCompound, as: 'chemCompound', required: false },
        { model: ChemMixture, as: 'chemMixture', required: false },
        { model: ChemEquipment, as: 'chemEquipment', required: false }
      );
    }

    return await Inventory.findAll({
      where,
      include,
      order: [['last_updated', 'DESC'], ['id', 'DESC']],
    });
  } catch (error) {
    if (error instanceof CatalogReferenceError) {
      throw error;
    }
    console.error('Ошибка при получении партий Inventory:', error);
    throw error;
  }
};

const getInventoryItemById = async (id, options = {}) => {
  try {
    const include = [];

    if (options.includeRelations !== false) {
      include.push(
        { model: StorageUnit, as: 'storageUnits', required: false },
        { model: ChemElement, as: 'chemElement', required: false },
        { model: ChemCompound, as: 'chemCompound', required: false },
        { model: ChemMixture, as: 'chemMixture', required: false },
        { model: ChemEquipment, as: 'chemEquipment', required: false }
      );
    }

    const inventoryItem = await Inventory.findByPk(id, { include });
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    if (options.user !== undefined) {
      await assertInventoryLabAccess(options.user, inventoryItem, 'просмотра инвентаря');
    }
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при получении записи Inventory по id:', error);
    throw error;
  }
};

const updateInventoryItem = async (id, data, user) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    await assertInventoryLabAccess(user, inventoryItem, 'изменения инвентаря');

    if (data.storage_id != null) {
      await assertStorageIdForInventory(user, data.storage_id);
    }

    const touchesCatalogLink = Object.prototype.hasOwnProperty.call(data, 'item_type')
      || Object.prototype.hasOwnProperty.call(data, 'reference_id')
      || Object.prototype.hasOwnProperty.call(data, 'item_name');

    const payload = touchesCatalogLink
      ? await validateInventoryCatalogPatch(inventoryItem, data)
      : data;

    await inventoryItem.update(payload);
    return inventoryItem;
  } catch (error) {
    if (error instanceof CatalogReferenceError) {
      throw error;
    }
    console.error('Ошибка при обновлении записи Inventory:', error);
    throw error;
  }
};

const deleteInventoryItem = async (id, user) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    await assertInventoryLabAccess(user, inventoryItem, 'удаления инвентаря');
    await inventoryItem.destroy();
    return { message: `Запись Inventory с id ${id} удалена` };
  } catch (error) {
    console.error('Ошибка при удалении записи Inventory:', error);
    throw error;
  }
};

const getInventoriesByReferenceAndType = async (referenceId, itemType, user) => {
  try {
    await assertCatalogReference(itemType, referenceId);

    const includeOptions = [];

    if (itemType === 'element') {
      includeOptions.push({
        model: ChemElement,
        as: 'chemElement',
        required: true,
      });
    } else if (itemType === 'equipment') {
      includeOptions.push({
        model: ChemEquipment,
        as: 'chemEquipment',
        required: true,
      });
    } else if (itemType === 'compound') {
      includeOptions.push({
        model: ChemCompound,
        as: 'chemCompound',
        required: true,
      });
    } else if (itemType === 'mixture') {
      includeOptions.push({
        model: ChemMixture,
        as: 'chemMixture',
        required: true,
      });
    }

    includeOptions.push({
      model: StorageUnit,
      as: 'storageUnits',
    });

    const where = await scopeByStorageIds(
      user,
      {
        reference_id: Number(referenceId),
        item_type: itemType,
      },
      'storage_id'
    );

    return await Inventory.findAll({
      where,
      include: includeOptions,
    });
  } catch (error) {
    if (error instanceof CatalogReferenceError) {
      throw error;
    }
    console.error(
      'Ошибка при получении инвентаря по reference_id и item_type:',
      error
    );
    throw new Error('Не удалось получить инвентарь');
  }
};

const checkCatalogReference = async (itemType, referenceId) => {
  const catalog = await assertCatalogReference(itemType, referenceId);
  return {
    valid: true,
    item_type: itemType,
    reference_id: Number(referenceId),
    catalog_id: catalog.id,
    catalog_name: catalog.name || catalog.symbol,
  };
};

const getLocationsForEntity = async (entityType, entityId) => {
  try {
    await assertCatalogReference(entityType, entityId);

    const entityModels = {
      element: ChemElement,
      compound: ChemCompound,
      mixture: ChemMixture,
      equipment: ChemEquipment,
    };

    const model = entityModels[entityType];
    const entity = await model.findByPk(entityId, {
      include: [
        {
          model: Inventory,
          as: 'inventories',
          include: [
            {
              model: StorageUnit,
              as: 'storageUnits',
              include: [
                {
                  model: StorageUnit,
                  as: 'parent',
                  hierarchy: true,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!entity) {
      throw new Error(`${entityType} с ID ${entityId} не найден.`);
    }

    return entity;
  } catch (error) {
    if (error instanceof CatalogReferenceError) {
      throw error;
    }
    console.error('Ошибка при получении данных сущности:', error);
    throw error;
  }
};

const countChemicals = async (user) => {
  try {
    const where = await scopeByStorageIds(
      user,
      { item_type: { [Op.in]: ['element', 'compound', 'mixture'] } },
      'storage_id'
    );
    return await Inventory.count({ where });
  } catch (error) {
    console.error('Ошибка при подсчете химикатов:', error);
    throw error;
  }
};

const countEquipment = async (user) => {
  try {
    const where = await scopeByStorageIds(
      user,
      { item_type: 'equipment' },
      'storage_id'
    );
    return await Inventory.count({ where });
  } catch (error) {
    console.error('Ошибка при подсчете оборудования:', error);
    throw error;
  }
};

/**
 * Reports inventory rows whose (item_type, reference_id) do not resolve in catalog.
 */
const findOrphanInventoryLots = async (user) => {
  const where = await scopeByStorageIds(user, {}, 'storage_id');
  const lots = await Inventory.findAll({
    where,
    attributes: ['id', 'item_type', 'reference_id', 'item_name'],
  });

  const orphans = [];

  for (const lot of lots) {
    try {
      await assertCatalogReference(lot.item_type, lot.reference_id);
    } catch (error) {
      orphans.push({
        id: lot.id,
        item_type: lot.item_type,
        reference_id: lot.reference_id,
        item_name: lot.item_name,
        reason: error.message,
      });
    }
  }

  return orphans;
};

module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryLots,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoriesByReferenceAndType,
  checkCatalogReference,
  getLocationsForEntity,
  countChemicals,
  countEquipment,
  findOrphanInventoryLots,
};
