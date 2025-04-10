const { Inventory } = require('../models');
const { ChemElement, ChemEquipment, ChemCompound, ChemMixture, StorageUnit } = require('../models');

// Создание новой записи Inventory
const createInventoryItem = async (data) => {
  try {
    const inventoryItem = await Inventory.create(data);
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при создании записи Inventory:', error);
    throw error;
  }
};

// Получение всех записей Inventory
const getAllInventoryItems = async () => {
  try {
    return await Inventory.findAll();
  } catch (error) {
    console.error('Ошибка при получении записей Inventory:', error);
    throw error;
  }
};

// Получение записи Inventory по ID
const getInventoryItemById = async (id) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при получении записи Inventory по id:', error);
    throw error;
  }
};
// const getInventoriesByStorageUnitId = async (storageunit_id) => {
//   try {
//     console.log(`Получение записей для StorageUnit ID: ${storageunit_id}`);
//     const inventoryItems = await Inventory.findAll({
//       where: { storageunit_id },
//     });
//     console.log('Найденные записи:', inventoryItems);
//     if (!inventoryItems.length) {
//       throw new Error(`Записи Inventory для StorageUnit с id ${storageunit_id} не найдены`);
//     }
//     return inventoryItems;
//   } catch (error) {
//     console.error('Ошибка при получении записей Inventory по StorageUnit ID:', error);
//     throw error;
//   }
// };

// Обновление записи Inventory по ID
const updateInventoryItem = async (id, data) => {
  try {
    const inventoryItem = await Inventory.findByPk(id);
    if (!inventoryItem) {
      throw new Error(`Запись Inventory с id ${id} не найдена`);
    }
    await inventoryItem.update(data);
    return inventoryItem;
  } catch (error) {
    console.error('Ошибка при обновлении записи Inventory:', error);
    throw error;
  }
};

// Удаление записи Inventory по ID
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
    const includeOptions = [];

    // Условно добавляем связанные модели в зависимости от item_type
    if (itemType === 'element') {
      includeOptions.push({
        model: ChemElement,
        as: 'chemElement',
        required: true, // Включать только если есть связанная запись
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
      as: 'storageUnits', // Псевдоним должен совпадать с определением в модели Inventory
    });

    // Запрос с учетом фильтрации по item_type
    const inventoryItems = await Inventory.findAll({
      where: {
        reference_id: referenceId,
        item_type: itemType, // Условие фильтрации
      },
      include: includeOptions, // Включение только нужных моделей

    });

    return inventoryItems;
  } catch (error) {
    console.error(
      'Ошибка при получении инвентаря по reference_id и item_type:',
      error
    );
    throw new Error('Не удалось получить инвентарь');
  }
};


const getLocationsForEntity = async (entityType, entityId) => {
  try {
    // Связь типа сущности с соответствующей моделью
    const entityModels = {
      element: ChemElement,
      compound: ChemCompound,
      mixture: ChemMixture,
      equipment: ChemEquipment,
    };

    const model = entityModels[entityType];

    console.log("entityType:", entityType)
    if (!model) {
      throw new Error(`Тип ${entityType} не поддерживается.`);
    }

    // Получаем сущность с ее связанным инвентарем
    const entity = await model.findByPk(entityId, {
      include: [
        {
          model: Inventory,
          as: 'inventories', // Используем псевдоним связи из модели
          include: [
            {
              model: StorageUnit,
              as: 'storageUnits',
              include: [
                {
                  model: StorageUnit,
                  as: 'parent', // Загружаем родительские единицы
                  hierarchy: true, // Если используется иерархическая структура
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
    console.error('Ошибка при получении данных сущности:', error);
    throw error;
  }
};


const countChemicals = async () => {
  try {
    const count = await Inventory.count({
      where: {
        item_type: ['element', 'compound', 'mixture'], // или Sequelize.Op.in
      },
    });
    return count;
  } catch (error) {
    console.error('Ошибка при подсчете химикатов:', error);
    throw error;
  }
};

const countEquipment = async () => {
  try {
    const count = await Inventory.count({
      where: {
        item_type: 'equipment',
      },
    });
    return count;
  } catch (error) {
    console.error('Ошибка при подсчете оборудования:', error);
    throw error;
  }
};







module.exports = {
  createInventoryItem,
  getAllInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  deleteInventoryItem,
  getInventoriesByReferenceAndType,
  getLocationsForEntity,
  countChemicals,
  countEquipment,
};
