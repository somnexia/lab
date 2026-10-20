const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_INVENTORY,
  CAN_MANAGE_INVENTORY,
} = require('../config/roles');

/** Фаза 5b: роль + tenant через storage_id → chemstorage */
router.post('/', authorize(CAN_MANAGE_INVENTORY), inventoryController.createInventoryItem);

router.get(
  '/locations/:entityType/:entityId',
  authorize(CAN_VIEW_INVENTORY),
  inventoryController.getLocationsForEntity
);
router.get(
  '/filter',
  authorize(CAN_VIEW_INVENTORY),
  inventoryController.getInventoriesByReferenceAndType
);
router.get(
  '/validate-catalog',
  authorize(CAN_VIEW_INVENTORY),
  inventoryController.validateCatalogReference
);
router.get(
  '/integrity/orphans',
  authorize(CAN_MANAGE_INVENTORY),
  inventoryController.getOrphanInventoryLots
);
router.get(
  '/chemicals/count',
  authorize(CAN_VIEW_INVENTORY),
  inventoryController.getChemicalCount
);
router.get(
  '/equipment/count',
  authorize(CAN_VIEW_INVENTORY),
  inventoryController.getEquipmentCount
);

router.get('/', authorize(CAN_VIEW_INVENTORY), inventoryController.getAllInventoryItems);

router.get('/:id', authorize(CAN_VIEW_INVENTORY), inventoryController.getInventoryItemById);
router.put('/:id', authorize(CAN_MANAGE_INVENTORY), inventoryController.updateInventoryItem);
router.delete('/:id', authorize(CAN_MANAGE_INVENTORY), inventoryController.deleteInventoryItem);

module.exports = router;
