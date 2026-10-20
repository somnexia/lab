const storageService = require('../services/chemStorageService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (isScopeForbidden(error)) {
    return res.status(403).json({ error: error.message, code: error.code });
  }
  if (/не найдено/i.test(error.message || '')) {
    return res.status(404).json({ error: error.message });
  }
  console.error(error);
  return res.status(fallbackStatus).json({ error: error.message });
}

const createStorage = async (req, res) => {
  try {
    const newStorage = await storageService.createStorage(req.body, req.user);
    return res.status(201).json(newStorage);
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllStorages = async (req, res) => {
  try {
    const storages = await storageService.getAllStorages(req.user);
    return res.status(200).json(storages);
  } catch (error) {
    return sendError(res, error);
  }
};

const getStorageById = async (req, res) => {
  try {
    const storage = await storageService.getStorageById(req.params.id, req.user);
    return res.status(200).json(storage);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateStorage = async (req, res) => {
  try {
    const updatedStorage = await storageService.updateStorage(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json(updatedStorage);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteStorage = async (req, res) => {
  try {
    const result = await storageService.deleteStorage(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createStorage,
  getAllStorages,
  getStorageById,
  updateStorage,
  deleteStorage,
};
