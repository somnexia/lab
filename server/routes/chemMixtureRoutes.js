const express = require('express');
const router = express.Router();
const chemMixtureController = require('../controllers/chemMixtureController');

router.post('/', chemMixtureController.createChemMixture);
router.get('/', chemMixtureController.getAllChemMixtures);

router.get('/:id/components', chemMixtureController.getMixtureComponents);
router.put('/:id/components', chemMixtureController.replaceMixtureComponents);

router.get('/:id', chemMixtureController.getChemMixtureById);
router.put('/:id', chemMixtureController.updateChemMixture);
router.delete('/:id', chemMixtureController.deleteChemMixture);

module.exports = router;
