// services/storageUnitService.js
/** Фаза 5b: tenant через storage_id → chemstorages.laboratory_id */

const { StorageUnit, ChemStorage } = require('../models');
const {
  skipLabScope,
  assertLabAccess,
  scopeByStorageIds,
  listChemStorageIdsForUser,
} = require('../utils/labScope');

async function assertUnitLabAccess(user, storageUnit, action = 'доступа к блоку хранения') {
  if (skipLabScope(user)) return;

  if (!storageUnit.storage_id) {
    const err = new Error(`Недостаточно прав для ${action}: блок без склада`);
    err.code = 'FORBIDDEN';
    err.status = 403;
    throw err;
  }

  const storage = await ChemStorage.findByPk(storageUnit.storage_id);
  assertLabAccess(user, storage?.laboratory_id, action);
}

async function assertStorageIdForUser(user, storageId) {
  if (storageId == null || storageId === '') {
    if (skipLabScope(user)) return null;
    const err = new Error('storage_id обязателен для привязки к лаборатории');
    err.code = 'LAB_REQUIRED';
    err.status = 403;
    throw err;
  }

  const storage = await ChemStorage.findByPk(Number(storageId));
  if (!storage) {
    const err = new Error(`Хранилище с id ${storageId} не найдено`);
    err.status = 404;
    throw err;
  }
  assertLabAccess(user, storage.laboratory_id, 'привязки к хранилищу');
  return storage;
}

const createStorageUnit = async (data, user) => {
  try {
    await assertStorageIdForUser(user, data.storage_id);
    return await StorageUnit.create(data);
  } catch (error) {
    console.error('Ошибка при создании блока хранения:', error);
    throw error;
  }
};

const getAllStorageUnits = async (user) => {
  try {
    const where = await scopeByStorageIds(user, {}, 'storage_id');
    return await StorageUnit.findAll({
      where,
      include: ['children', 'inventories'],
    });
  } catch (error) {
    console.error('Ошибка при получении списка блоков хранения:', error);
    throw error;
  }
};

const getStorageUnitById = async (id, user) => {
  try {
    const storageUnit = await StorageUnit.findByPk(id, {
      include: ['children', 'inventories'],
    });
    if (!storageUnit) {
      throw new Error(`Блок хранения с id ${id} не найден`);
    }
    await assertUnitLabAccess(user, storageUnit, 'просмотра блока хранения');
    return storageUnit;
  } catch (error) {
    console.error('Ошибка при получении блока хранения по id:', error);
    throw error;
  }
};

const updateStorageUnit = async (id, data, user) => {
  try {
    const storageUnit = await StorageUnit.findByPk(id);
    if (!storageUnit) {
      throw new Error(`Блок хранения с id ${id} не найден`);
    }
    await assertUnitLabAccess(user, storageUnit, 'изменения блока хранения');
    if (data.storage_id !== undefined) {
      await assertStorageIdForUser(user, data.storage_id);
    }
    await storageUnit.update(data);
    return storageUnit;
  } catch (error) {
    console.error('Ошибка при обновлении блока хранения:', error);
    throw error;
  }
};

const deleteStorageUnit = async (id, user) => {
  try {
    const storageUnit = await StorageUnit.findByPk(id);
    if (!storageUnit) {
      throw new Error(`Блок хранения с id ${id} не найден`);
    }
    await assertUnitLabAccess(user, storageUnit, 'удаления блока хранения');
    await storageUnit.destroy();
    return { message: `Блок хранения с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении блока хранения:', error);
    throw error;
  }
};

async function buildLocationChain(storageUnitId, user) {
  const locationChain = [];
  let currentUnit = await StorageUnit.findByPk(storageUnitId);

  if (!currentUnit) {
    return locationChain;
  }

  await assertUnitLabAccess(user, currentUnit, 'просмотра цепочки хранения');

  while (currentUnit) {
    locationChain.unshift({
      id: currentUnit.id,
      name: currentUnit.unit_name,
    });

    if (currentUnit.parent_id) {
      currentUnit = await StorageUnit.findByPk(currentUnit.parent_id);
    } else {
      currentUnit = null;
    }
  }

  return locationChain;
}

module.exports = {
  createStorageUnit,
  getAllStorageUnits,
  getStorageUnitById,
  updateStorageUnit,
  deleteStorageUnit,
  buildLocationChain,
  listChemStorageIdsForUser,
};
