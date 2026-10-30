const express = require('express');
const router = express.Router();
const researchEmployeeController = require('../controllers/researchEmployeeController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_RESEARCH,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

/**
 * Состав команд (ResearchEmployee = кто в каком research).
 * Роль: чтение CAN_VIEW_RESEARCH; мутации CAN_MANAGE_RESEARCH.
 * Tenant: список, GET/POST/PUT/DELETE — research своей lab/команды;
 * POST/PUT при смене employee — только из lab актора.
 */
router.get('/', authorize(CAN_VIEW_RESEARCH), researchEmployeeController.getAllResearchEmployees);
router.get(
  '/:id',
  authorize(CAN_VIEW_RESEARCH),
  researchEmployeeController.getResearchEmployeeById
);
router.post('/', authorize(CAN_MANAGE_RESEARCH), researchEmployeeController.createResearchEmployee);
router.put('/:id', authorize(CAN_MANAGE_RESEARCH), researchEmployeeController.updateResearchEmployee);
router.delete(
  '/:id',
  authorize(CAN_MANAGE_RESEARCH),
  researchEmployeeController.deleteResearchEmployee
);

module.exports = router;
