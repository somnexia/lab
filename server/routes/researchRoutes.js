const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_RESEARCH,
  CAN_MANAGE_RESEARCH,
} = require('../config/roles');

/**
 * authorize на researches (роль).
 * Lab/team scope — researchService / researchScope
 * (research без laboratory_id → через ResearchEmployee → Employee.lab_id).
 * student: чтение в scope; CUD — CAN_MANAGE_RESEARCH.
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
