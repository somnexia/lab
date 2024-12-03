// controllers/storageUnitController.js

const storageUnitService = require('../services/storageUnitService');

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
const { getInventoriesWithLocation } = require('../services/inventoryStorageUnitService');

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


module.exports = {
  createStorageUnit,
  getAllStorageUnits,
  getStorageUnitById,
  updateStorageUnit,
  deleteStorageUnit,
  getInventoriesByStorageUnitId
};
