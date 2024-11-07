const { ChemStorage } = require('../models');

// Создание новой записи в хранилище
const createStorage = async (data) => {
  try {
    const storage = await ChemStorage.create(data);
    return storage;
  } catch (error) {
    console.error('Ошибка при создании хранилища:', error);
    throw error;
  }
};

// Получение всех хранилищ
const getAllStorages = async () => {
  try {
    return await ChemStorage.findAll();
  } catch (error) {
    console.error('Ошибка при получении списка хранилищ:', error);
    throw error;
  }
};

// Получение хранилища по ID
const getStorageById = async (id) => {
  try {
    const storage = await ChemStorage.findByPk(id);
    if (!storage) {
      throw new Error(`Хранилище с id ${id} не найдено`);
    }
    return storage;
  } catch (error) {
    console.error('Ошибка при получении хранилища по id:', error);
    throw error;
  }
};

// Обновление данных хранилища по ID
const updateStorage = async (id, data) => {
  try {
    const storage = await ChemStorage.findByPk(id);
    if (!storage) {
      throw new Error(`Хранилище с id ${id} не найдено`);
    }
    await storage.update(data);
    return storage;
  } catch (error) {
    console.error('Ошибка при обновлении хранилища:', error);
    throw error;
  }
};

// Удаление хранилища по ID
const deleteStorage = async (id) => {
  try {
    const storage = await ChemStorage.findByPk(id);
    if (!storage) {
      throw new Error(`Хранилище с id ${id} не найдено`);
    }
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
  deleteStorage
};
