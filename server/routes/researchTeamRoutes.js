const express = require('express');
const router = express.Router();
const researchTeamController = require('../controllers/researchTeamController');

/** Graph nodes/edges for /members-teams/research-teams visualization */
router.get('/graph', researchTeamController.getGraph);
/** Researches with nested participants (list view) */
router.get('/summary', researchTeamController.getSummary);
/** Employees not linked to any research */
router.get('/unassigned', researchTeamController.getUnassigned);

module.exports = router;
