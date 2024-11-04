const storageService = require('../services/chemStorageService'); // Путь к вашему сервису

// Создание новой записи в хранилище
const createStorage = async (req, res) => {
  try {
    const newStorage = await storageService.createStorage(req.body);
    return res.status(201).json(newStorage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение всех хранилищ
const getAllStorages = async (req, res) => {
  try {
    const storages = await storageService.getAllStorages();
    return res.status(200).json(storages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Получение хранилища по ID
const getStorageById = async (req, res) => {
  const { id } = req.params;
  try {
    const storage = await storageService.getStorageById(id);
    return res.status(200).json(storage);
  } catch (error) {
    console.error(error);
    return res.status(404).json({ error: error.message });
  }
};

// Обновление данных хранилища по ID
const updateStorage = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedStorage = await storageService.updateStorage(id, req.body);
    return res.status(200).json(updatedStorage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

// Удаление хранилища по ID
const deleteStorage = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await storageService.deleteStorage(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createStorage,
  getAllStorages,
  getStorageById,
  updateStorage,
  deleteStorage
};
