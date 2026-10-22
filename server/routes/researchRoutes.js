const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_RESEARCH,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

/**
 * Фаза 6b: authorize на researches.
 * Tenant / «свои записи» — в сервисах (фаза 5/8); здесь только роль.
 * student: чтение; create/update/delete — CAN_MANAGE_RESEARCH (admin+researcher).
 */
router.post('/', authorize(CAN_MANAGE_RESEARCH), researchController.createResearch);
router.post(
  '/with-participants',
  authorize(CAN_MANAGE_RESEARCH),
  researchController.createResearchWithParticipants
);

router.get('/', authorize(CAN_VIEW_RESEARCH), researchController.getAllResearches);
router.get(
  '/ongoing/count',
  authorize(CAN_VIEW_RESEARCH),
  researchController.getOngoingResearchCount
);
router.get('/:id', authorize(CAN_VIEW_RESEARCH), researchController.getResearchById);

router.put('/:id', authorize(CAN_MANAGE_RESEARCH), researchController.updateResearch);
router.delete('/:id', authorize(CAN_MANAGE_RESEARCH), researchController.deleteResearch);

router.post(
  '/:researchId/participants',
  authorize(CAN_MANAGE_RESEARCH),
  researchController.addParticipantsToResearch
);

module.exports = router;
