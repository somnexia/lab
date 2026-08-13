const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController');

router.post('/', experimentController.createExperiment);
router.get('/', experimentController.getAllExperiments);

router.put('/:id/inputs', experimentController.replaceExperimentInputs);
router.put('/:id/outputs', experimentController.replaceExperimentOutputs);

router.get('/:id', experimentController.getExperimentById);
router.put('/:id', experimentController.updateExperiment);
router.delete('/:id', experimentController.deleteExperiment);

module.exports = router;
