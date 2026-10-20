// routes/storageUnitRoutes.js
const express = require('express');
const router = express.Router();
const StorageUnitController = require('../controllers/storageUnitController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_STORAGE,
  CAN_MANAGE_STORAGE,
} = require('../config/roles');

/** Фаза 5b: роль + tenant через chemstorage */
router.post('/', authorize(CAN_MANAGE_STORAGE), StorageUnitController.createStorageUnit);
router.get('/', authorize(CAN_VIEW_STORAGE), StorageUnitController.getAllStorageUnits);
router.get('/:id', authorize(CAN_VIEW_STORAGE), StorageUnitController.getStorageUnitById);
router.put('/:id', authorize(CAN_MANAGE_STORAGE), StorageUnitController.updateStorageUnit);
router.delete('/:id', authorize(CAN_MANAGE_STORAGE), StorageUnitController.deleteStorageUnit);
router.get(
  '/:id/location-chain',
  authorize(CAN_VIEW_STORAGE),
  StorageUnitController.getLocationChain
);

module.exports = router;
