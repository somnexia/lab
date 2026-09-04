// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_VIEW_LOGS } = require('../config/roles');

/**
 * Фаза 4: журнал только для ролей из CAN_VIEW_LOGS
 * (system_admin, lab_admin). Student/researcher → 403.
 * Глобальный authenticate уже отработал в protectApiRoutes.
 */
router.get('/', authorize(CAN_VIEW_LOGS), logController.getLogs);

module.exports = router;
