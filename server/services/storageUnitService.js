// services/storageUnitService.js

const { StorageUnit } = require('../models');

// Создание нового блока хранения
const createStorageUnit = async (data) => {
  try {
    const storageUnit = await StorageUnit.create(data);
    return storageUnit;
  } catch (error) {
    console.error('Ошибка при создании блока хранения:', error);
    throw error;
  }
};

// Получение всех блоков хранения
const getAllStorageUnits = async () => {
  try {
    return await StorageUnit.findAll({
      include: ['children', 'inventories']  // Пример использования связей
    });
  } catch (error) {
    console.error('Ошибка при получении списка блоков хранения:', error);
    throw error;
  }
};

// Получение блока хранения по ID
const getStorageUnitById = async (id) => {
  try {
    const storageUnit = await StorageUnit.findByPk(id, {
      include: ['children', 'inventories']
    });
    if (!storageUnit) {
      throw new Error(`Блок хранения с id ${id} не найден`);
    }
    return storageUnit;
  } catch (error) {
    console.error('Ошибка при получении блока хранения по id:', error);
    throw error;
  }
};

// Обновление блока хранения по ID
const updateStorageUnit = async (id, data) => {
  try {
    const storageUnit = await StorageUnit.findByPk(id);
    if (!storageUnit) {
      throw new Error(`Блок хранения с id ${id} не найден`);
    }
    await storageUnit.update(data);
    return storageUnit;
  } catch (error) {
    console.error('Ошибка при обновлении блока хранения:', error);
    throw error;
  }
};

// Удаление блока хранения по ID
const deleteStorageUnit = async (id) => {
  try {
    const storageUnit = await StorageUnit.findByPk(id);
    if (!storageUnit) {
      throw new Error(`Блок хранения с id ${id} не найден`);
    }
    await storageUnit.destroy();
    return { message: `Блок хранения с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении блока хранения:', error);
    throw error;
  }
};
async function buildLocationChain(storageUnitId) {
    console.log('[buildLocationChain] Вызов метода с storageUnitId:', storageUnitId);

    const locationChain = [];
    let currentUnit = await StorageUnit.findByPk(storageUnitId);

    if (!currentUnit) {
        console.error('[buildLocationChain] Единица хранения не найдена для ID:', storageUnitId);
        return locationChain;
    }

    console.log('[buildLocationChain] Начало построения цепочки');
    console.log('[buildLocationChain] Текущая единица хранения:', currentUnit.dataValues);

    // Итеративно поднимаемся по цепочке родительских узлов
    while (currentUnit) {
        console.log('[buildLocationChain] Добавляем в цепочку:', currentUnit.unit_name);
        locationChain.unshift({
            id: currentUnit.id,
            name: currentUnit.unit_name,
            type: currentUnit.unit_type
        });

        if (currentUnit.parent_id) {
            console.log('[buildLocationChain] Переход к родительской единице с ID:', currentUnit.parent_id);
            currentUnit = await StorageUnit.findByPk(currentUnit.parent_id);
            if (!currentUnit) {
                console.error('[buildLocationChain] Родительская единица не найдена для ID:', currentUnit.parent_id);
            } else {
                console.log('[buildLocationChain] Родительская единица найдена:', currentUnit.dataValues);
            }
        } else {
            console.log('[buildLocationChain] Родительская единица отсутствует, цепочка завершена');
            currentUnit = null;
        }
    }

    console.log('[buildLocationChain] Построение завершено, итоговая цепочка:', locationChain);
    return locationChain;
}


module.exports = {
  createStorageUnit,
  getAllStorageUnits,
  getStorageUnitById,
  updateStorageUnit,
  deleteStorageUnit,
  buildLocationChain,
};
