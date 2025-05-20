// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Только админ может смотреть логи
router.get('/', logController.getLogs);

module.exports = router;
