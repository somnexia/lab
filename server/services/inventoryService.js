const { Op } = require('sequelize');
const { Inventory, sequelize } = require('../models');
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

const createInventoryItem = async (data) => {
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

    return getInventoryItemById(inventoryItem.id, { includeRelations: true });
  } catch (error) {
    await transaction.rollback();
    if (error instanceof CatalogReferenceError) {
      throw error;
    }
    console.error('Ошибка при создании записи Inventory:', error);
    throw error;
  }
};

const getAllInventoryItems = async () => {
  return getInventoryLots();
};

const getInventoryLots = async (options = {}) => {
  try {
    const { itemType, itemTypes, includeCatalog = true } = options;
    const where = {};

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
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при получении записи Inventory по id:', error);
    throw error;
  }
};

const updateInventoryItem = async (id, data) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
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

const deleteInventoryItem = async (id) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    await inventoryItem.destroy();
    return { message: `Запись Inventory с id ${id} удалена` };
  } catch (error) {
    console.error('Ошибка при удалении записи Inventory:', error);
    throw error;
  }
};

const getInventoriesByReferenceAndType = async (referenceId, itemType) => {
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

    return await Inventory.findAll({
      where: {
        reference_id: Number(referenceId),
        item_type: itemType,
      },
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

const countChemicals = async () => {
  try {
    return await Inventory.count({
      where: {
        item_type: { [Op.in]: ['element', 'compound', 'mixture'] },
      },
    });
  } catch (error) {
    console.error('Ошибка при подсчете химикатов:', error);
    throw error;
  }
};

const countEquipment = async () => {
  try {
    return await Inventory.count({
      where: {
        item_type: 'equipment',
      },
    });
  } catch (error) {
    console.error('Ошибка при подсчете оборудования:', error);
    throw error;
  }
};

/**
 * Reports inventory rows whose (item_type, reference_id) do not resolve in catalog.
 */
const findOrphanInventoryLots = async () => {
  const lots = await Inventory.findAll({
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
