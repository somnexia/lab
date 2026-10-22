const express = require('express');
const router = express.Router();
const chemCompoundController = require('../controllers/chemCompoundController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_CATALOG,
  CAN_MANAGE_CATALOG,
} = require('../config/roles');

/** Фаза 6a: справочник соединений */
router.post('/', authorize(CAN_MANAGE_CATALOG), chemCompoundController.createChemCompound);
router.get('/', authorize(CAN_VIEW_CATALOG), chemCompoundController.getAllChemCompounds);
router.get('/:id', authorize(CAN_VIEW_CATALOG), chemCompoundController.getChemCompoundById);
router.put('/:id', authorize(CAN_MANAGE_CATALOG), chemCompoundController.updateChemCompound);
router.delete('/:id', authorize(CAN_MANAGE_CATALOG), chemCompoundController.deleteChemCompound);

module.exports = router;
