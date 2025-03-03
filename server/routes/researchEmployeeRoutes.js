const express = require('express');
const router = express.Router();
const researchEmployeeController = require('../controllers/researchEmployeeController');

router.get('/', researchEmployeeController.getAllResearchEmployees);
router.get('/:id', researchEmployeeController.getResearchEmployeeById);
router.post('/', researchEmployeeController.createResearchEmployee);
router.put('/:id', researchEmployeeController.updateResearchEmployee);
router.delete('/:id', researchEmployeeController.deleteResearchEmployee);

module.exports = router;
