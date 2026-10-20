const express = require('express');
const router = express.Router();
const chemStorageController = require('../controllers/chemStorageController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_STORAGE,
  CAN_MANAGE_STORAGE,
} = require('../config/roles');

/** Фаза 5b: роль + tenant (laboratory_id на chemstorages) */
router.post('/', authorize(CAN_MANAGE_STORAGE), chemStorageController.createStorage);
router.get('/', authorize(CAN_VIEW_STORAGE), chemStorageController.getAllStorages);
router.get('/:id', authorize(CAN_VIEW_STORAGE), chemStorageController.getStorageById);
router.put('/:id', authorize(CAN_MANAGE_STORAGE), chemStorageController.updateStorage);
router.delete('/:id', authorize(CAN_MANAGE_STORAGE), chemStorageController.deleteStorage);

module.exports = router;
