const express = require('express');
const router = express.Router();
const chemElementController = require('../controllers/chemElementController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_CATALOG,
  CAN_MANAGE_CATALOG,
} = require('../config/roles');

/** Фаза 6a: справочник элементов — роль, без tenant (глобальный каталог) */
router.post('/', authorize(CAN_MANAGE_CATALOG), chemElementController.createChemElement);
router.get('/', authorize(CAN_VIEW_CATALOG), chemElementController.getAllChemElements);
router.get('/:id', authorize(CAN_VIEW_CATALOG), chemElementController.getChemElementById);
router.put('/:id', authorize(CAN_MANAGE_CATALOG), chemElementController.updateChemElement);
router.delete('/:id', authorize(CAN_MANAGE_CATALOG), chemElementController.deleteChemElement);

module.exports = router;
