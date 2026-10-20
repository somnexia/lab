const express = require('express');
const router = express.Router();
const researchTeamController = require('../controllers/researchTeamController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_VIEW_RESEARCH } = require('../config/roles');

/** Фаза 5b: tenant через employee.lab_id (см. resolveQueryLabId) */
router.get('/graph', authorize(CAN_VIEW_RESEARCH), researchTeamController.getGraph);
router.get('/summary', authorize(CAN_VIEW_RESEARCH), researchTeamController.getSummary);
router.get('/unassigned', authorize(CAN_VIEW_RESEARCH), researchTeamController.getUnassigned);

module.exports = router;
