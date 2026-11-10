const express = require('express');
const router = express.Router();
const inventoryStorageUnitController = require('../controllers/inventoryStorageUnitController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_VIEW_INVENTORY } = require('../config/roles');

/**
 * Чтение лотов по storage unit.
 * Роль CAN_VIEW_INVENTORY; tenant — assertUnitLabAccess
 * (storage unit → chemstorage.laboratory_id).
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
