const express = require('express');
const router = express.Router();
const inventoryStorageUnitController = require('../controllers/inventoryStorageUnitController');

// Маршрут для получения инвентаря по блоку хранения
router.get('/:id/inventories', inventoryStorageUnitController.getInventoriesByStorageUnitId);
router.get('/:id/inventories-with-location', inventoryStorageUnitController.getInventoriesWithLocation);

module.exports = router;
