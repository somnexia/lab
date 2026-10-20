const { ChemStorage } = require('../models');
const {
  scopeByLab,
  assertLabAccess,
  enforceLabOnCreate,
} = require('../utils/labScope');

/** Фаза 5b: chemstorages.laboratory_id */

const createStorage = async (data, user) => {
  try {
    const laboratory_id = enforceLabOnCreate(
      user,
      data.laboratory_id ?? data.laboratoryId
    );
    const storage = await ChemStorage.create({
      ...data,
      laboratory_id,
    });
    return storage;
  } catch (error) {
    console.error('Ошибка при создании хранилища:', error);
    throw error;
  }
};

const getAllStorages = async (user) => {
  try {
    return await ChemStorage.findAll({
      where: scopeByLab(user, {}, { field: 'laboratory_id' }),
    });
  } catch (error) {
    console.error('Ошибка при получении списка хранилищ:', error);
    throw error;
  }
};

const getStorageById = async (id, user) => {
  try {
    const storage = await ChemStorage.findByPk(id);
    if (!storage) {
      throw new Error(`Хранилище с id ${id} не найдено`);
    }
    assertLabAccess(user, storage.laboratory_id, 'просмотра хранилища');
    return storage;
  } catch (error) {
    console.error('Ошибка при получении хранилища по id:', error);
    throw error;
  }
};

const updateStorage = async (id, data, user) => {
  try {
    const storage = await ChemStorage.findByPk(id);
    if (!storage) {
      throw new Error(`Хранилище с id ${id} не найдено`);
    }
    assertLabAccess(user, storage.laboratory_id, 'изменения хранилища');
    if (data.laboratory_id != null || data.laboratoryId != null) {
      enforceLabOnCreate(user, data.laboratory_id ?? data.laboratoryId);
    }
    await storage.update(data);
    return storage;
  } catch (error) {
    console.error('Ошибка при обновлении хранилища:', error);
    throw error;
  }
};

const deleteStorage = async (id, user) => {
  try {
    const storage = await ChemStorage.findByPk(id);
    if (!storage) {
      throw new Error(`Хранилище с id ${id} не найдено`);
    }
    assertLabAccess(user, storage.laboratory_id, 'удаления хранилища');
    await storage.destroy();
    return { message: `Хранилище с id ${id} удалено` };
  } catch (error) {
    console.error('Ошибка при удалении хранилища:', error);
    throw error;
  }
};

module.exports = {
  createStorage,
  getAllStorages,
  getStorageById,
  updateStorage,
  deleteStorage,
};
