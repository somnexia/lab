const express = require('express');
const router = express.Router();
const chemMixtureController = require('../controllers/chemMixtureController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_CATALOG,
  CAN_MANAGE_CATALOG,
} = require('../config/roles');

/** Фаза 6a: справочник смесей (+ состав) */
router.post('/', authorize(CAN_MANAGE_CATALOG), chemMixtureController.createChemMixture);
router.get('/', authorize(CAN_VIEW_CATALOG), chemMixtureController.getAllChemMixtures);

router.get(
  '/:id/components',
  authorize(CAN_VIEW_CATALOG),
  chemMixtureController.getMixtureComponents
);
router.put(
  '/:id/components',
  authorize(CAN_MANAGE_CATALOG),
  chemMixtureController.replaceMixtureComponents
);

router.get('/:id', authorize(CAN_VIEW_CATALOG), chemMixtureController.getChemMixtureById);
router.put('/:id', authorize(CAN_MANAGE_CATALOG), chemMixtureController.updateChemMixture);
router.delete('/:id', authorize(CAN_MANAGE_CATALOG), chemMixtureController.deleteChemMixture);

module.exports = router;
