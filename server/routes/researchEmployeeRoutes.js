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
 * Scope (по частям):
 *   1) GET / — только memberships видимых research (lab/команда) ✓
 *   2) GET /:id — одна запись в scope
 *   3) POST — research + employee своей lab
 *   4) PUT/DELETE /:id — нельзя править чужую команду
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
