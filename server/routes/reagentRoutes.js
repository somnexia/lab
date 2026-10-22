const express = require('express');
const reagentController = require('../controllers/reagentController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_VIEW_CATALOG } = require('../config/roles');

const router = express.Router();

/** Фаза 6a: read-only агрегатор каталога (element/compound/mixture) */
router.get('/summary', authorize(CAN_VIEW_CATALOG), reagentController.getReagentSummary);
router.get('/:kind/:id', authorize(CAN_VIEW_CATALOG), reagentController.getReagent);
router.get('/', authorize(CAN_VIEW_CATALOG), reagentController.listReagents);

module.exports = router;
