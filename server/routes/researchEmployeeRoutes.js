const express = require('express');
const router = express.Router();
const researchEmployeeController = require('../controllers/researchEmployeeController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_RESEARCH,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

/**
 * Фаза 6b: состав команд исследования.
 * Чтение — все роли; мутации — CAN_MANAGE_RESEARCH.
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
