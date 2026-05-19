const express = require('express');
const reagentController = require('../controllers/reagentController');

const router = express.Router();

router.get('/summary', reagentController.getReagentSummary);
router.get('/:kind/:id', reagentController.getReagent);
router.get('/', reagentController.listReagents);

module.exports = router;
