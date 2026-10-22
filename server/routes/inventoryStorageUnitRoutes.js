const express = require('express');
const router = express.Router();
const inventoryStorageUnitController = require('../controllers/inventoryStorageUnitController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_VIEW_INVENTORY } = require('../config/roles');

/**
 * Фаза 6a: чтение лотов по storage unit.
 * Tenant по storage unit уже на /api/storageUnits; здесь — роль.
 */
router.get(
  '/:id/inventories',
  authorize(CAN_VIEW_INVENTORY),
  inventoryStorageUnitController.getInventoriesByStorageUnitId
);
router.get(
  '/:id/inventories-with-location',
  authorize(CAN_VIEW_INVENTORY),
  inventoryStorageUnitController.getInventoriesWithLocation
);

module.exports = router;
