const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_RESEARCH,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

/** Фаза 5b: роль + tenant по laboratory_id */
router.post('/', authorize(CAN_MANAGE_RESEARCH), experimentController.createExperiment);
router.get('/', authorize(CAN_VIEW_RESEARCH), experimentController.getAllExperiments);

router.put(
  '/:id/inputs',
  authorize(CAN_MANAGE_RESEARCH),
  experimentController.replaceExperimentInputs
);
router.put(
  '/:id/outputs',
  authorize(CAN_MANAGE_RESEARCH),
  experimentController.replaceExperimentOutputs
);

router.get(
  '/:id/stock-check',
  authorize(CAN_VIEW_RESEARCH),
  experimentController.checkExperimentStock
);
router.post('/:id/run', authorize(CAN_MANAGE_RESEARCH), experimentController.runExperiment);
router.post(
  '/:id/complete',
  authorize(CAN_MANAGE_RESEARCH),
  experimentController.completeExperiment
);

router.get('/:id', authorize(CAN_VIEW_RESEARCH), experimentController.getExperimentById);
router.put('/:id', authorize(CAN_MANAGE_RESEARCH), experimentController.updateExperiment);
router.delete('/:id', authorize(CAN_MANAGE_RESEARCH), experimentController.deleteExperiment);

module.exports = router;
