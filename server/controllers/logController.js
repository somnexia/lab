// controllers/logController.js
const logService = require('../services/logService');

const getLogs = async (req, res) => {
  try {
    const { limit = 10, offset = 0, search = '', status = '' } = req.query;

    const logsData = await logService.getAllLogs({
      limit: parseInt(limit),
      offset: parseInt(offset),
      search,
      status,
    });

    res.json(logsData);
  } catch (error) {
    console.error('Ошибка при получении логов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = { getLogs };
