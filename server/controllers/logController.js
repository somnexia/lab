const logService = require('../services/logService');

const getLogs = async (req, res) => {
  try {
    const {
      limit = 10,
      offset = 0,
      search = '',
      status = '',
      action = '',
      resourceType = '',
      userId = '',
      dateFrom = '',
      dateTo = '',
    } = req.query;

    const logsData = await logService.getAllLogs({
      limit: parseInt(limit, 10) || 10,
      offset: parseInt(offset, 10) || 0,
      search: String(search),
      status: String(status),
      action: String(action),
      resourceType: String(resourceType),
      userId: userId === '' ? '' : userId,
      dateFrom: String(dateFrom),
      dateTo: String(dateTo),
    });

    res.json(logsData);
  } catch (error) {
    console.error('Ошибка при получении логов:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

module.exports = { getLogs };
