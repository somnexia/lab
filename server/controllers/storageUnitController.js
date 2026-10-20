// controllers/storageUnitController.js

const storageUnitService = require('../services/storageUnitService');
const { getInventoriesWithLocation } = require('../services/inventoryStorageUnitService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (isScopeForbidden(error)) {
    return res.status(403).json({ error: error.message, code: error.code });
  }
  if (/не найден/i.test(error.message || '') || error.status === 404) {
    return res.status(404).json({ message: error.message });
  }
  console.error(error);
  return res.status(fallbackStatus).json({
    message: 'Ошибка при работе с блоком хранения',
    error: error.message,
  });
}

const createStorageUnit = async (req, res) => {
  try {
    const storageUnit = await storageUnitService.createStorageUnit(req.body, req.user);
    res.status(201).json(storageUnit);
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllStorageUnits = async (req, res) => {
  try {
    const storageUnits = await storageUnitService.getAllStorageUnits(req.user);
    res.json(storageUnits);
  } catch (error) {
    return sendError(res, error);
  }
};

const getStorageUnitById = async (req, res) => {
  try {
    const storageUnit = await storageUnitService.getStorageUnitById(
      req.params.id,
      req.user
    );
    res.json(storageUnit);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateStorageUnit = async (req, res) => {
  try {
    const storageUnit = await storageUnitService.updateStorageUnit(
      req.params.id,
      req.body,
      req.user
    );
    res.json(storageUnit);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteStorageUnit = async (req, res) => {
  try {
    const result = await storageUnitService.deleteStorageUnit(req.params.id, req.user);
    res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

const getInventoriesByStorageUnitId = async (req, res) => {
  try {
    const { id: storageunit_id } = req.params;
    if (!storageunit_id) {
      return res.status(400).json({ error: 'storageunit_id is required' });
    }
    await storageUnitService.getStorageUnitById(storageunit_id, req.user);
    const inventories = await getInventoriesWithLocation(storageunit_id);
    res.json(inventories);
  } catch (error) {
    return sendError(res, error);
  }
};

const getLocationChain = async (req, res) => {
  try {
    const { id: storageUnitId } = req.params;

    if (!storageUnitId) {
      return res.status(400).json({ error: 'storageUnitId is required' });
    }

    const locationChain = await storageUnitService.buildLocationChain(
      storageUnitId,
      req.user
    );

    if (locationChain.length === 0) {
      return res.status(404).json({ message: 'No storage units found in the chain' });
    }

    res.json(locationChain);
  } catch (error) {
    return sendError(res, error);
  }
};

module.exports = {
  createStorageUnit,
  getAllStorageUnits,
  getStorageUnitById,
  updateStorageUnit,
  deleteStorageUnit,
  getInventoriesByStorageUnitId,
  getLocationChain,
};
