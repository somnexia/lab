// controllers/logController.js
const logService = require('../services/logService');

const getAllLogs = async (req, res) => {
  try {
    const logs = await logService.getAllLogs();
    res.json(logs);
  } catch (error) {
    console.error('Ошибка при получении логов:', error);
    res.status(500).json({ error: 'Ошибка при получении логов' });
  }
};

module.exports = { getAllLogs };
