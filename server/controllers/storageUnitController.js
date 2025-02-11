// controllers/storageUnitController.js

const storageUnitService = require('../services/storageUnitService');
const { getInventoriesWithLocation } = require('../services/inventoryStorageUnitService');


const createStorageUnit = async (req, res) => {
  try {
    const storageUnit = await storageUnitService.createStorageUnit(req.body);
    res.status(201).json(storageUnit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при создании блока хранения', error: error.message });
  }
};

const getAllStorageUnits = async (req, res) => {
  try {
    const storageUnits = await storageUnitService.getAllStorageUnits();
    res.json(storageUnits);
  } catch (error) {
    console.error('Ошибка при получении списка блоков хранения:', error);
    res.status(500).json({ message: 'Ошибка при получении блоков хранения', error: error.message });
  }
};

const getStorageUnitById = async (req, res) => {
  try {
    const storageUnit = await storageUnitService.getStorageUnitById(req.params.id);
    res.json(storageUnit);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

const updateStorageUnit = async (req, res) => {
  try {
    const storageUnit = await storageUnitService.updateStorageUnit(req.params.id, req.body);
    res.json(storageUnit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при обновлении блока хранения', error: error.message });
  }
};

const deleteStorageUnit = async (req, res) => {
  try {
    const result = await storageUnitService.deleteStorageUnit(req.params.id);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка при удалении блока хранения', error: error.message });
  }
};


const getInventoriesByStorageUnitId = async (req, res) => {
    try {
        const { id: storageunit_id } = req.params;
        if (!storageunit_id) {
            return res.status(400).json({ error: 'storageunit_id is required' });
        }

        const inventories = await getInventoriesWithLocation(storageunit_id);
        res.json(inventories);
    } catch (error) {
        console.error('Ошибка в контроллере:', error);
        res.status(500).json({ error: 'Ошибка при получении данных инвентаря' });
    }
};

const { buildLocationChain } = require('../services/storageUnitService');

const getLocationChain = async (req, res) => {
    try {
        const { id: storageUnitId } = req.params;

        if (!storageUnitId) {
            return res.status(400).json({ error: 'storageUnitId is required' });
        }

        const locationChain = await buildLocationChain(storageUnitId);

        if (locationChain.length === 0) {
            return res.status(404).json({ message: 'No storage units found in the chain' });
        }

        res.json(locationChain);
    } catch (error) {
        console.error('Error in getLocationChain controller:', error);
        res.status(500).json({ error: 'Error while fetching location chain' });
    }
};




module.exports = {
  createStorageUnit,
  getAllStorageUnits,
  getStorageUnitById,
  updateStorageUnit,
  deleteStorageUnit,
  getInventoriesByStorageUnitId,
  getLocationChain
};
