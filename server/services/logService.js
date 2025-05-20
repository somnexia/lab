const { Op } = require('sequelize');
const { Log, User } = require('../models');

const createLog = async (action, userId, details = null) => {
  return await Log.create({
    action,
    user_id: userId,
    details,
  });
};

/**
 * Получение логов с пагинацией, поиском и фильтрацией по статусу.
 * 
 * @param {Object} options 
 * @param {number} options.limit
 * @param {number} options.offset
 * @param {string} options.search
 * @param {string} options.status
 * @returns {Object} logs[], totalLogs
 */
const getAllLogs = async ({ limit = 10, offset = 0, search = '', status = '' }) => {
  const whereClause = {};

  // Поиск по action, resource_type и description
  if (search) {
    whereClause[Op.or] = [
      { action: { [Op.like]: `%${search}%` } },
      { resource_id: { [Op.like]: `%${search}%` } },
      { resource_type: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }

  // Фильтрация по статусу
  if (status) {
    whereClause.status = status;
  }

  // Запрос логов
  const { rows: logs, count: totalLogs } = await Log.findAndCountAll({
    where: whereClause,
    limit,
    offset,
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'email'],
      },
    ],
    order: [['timestamp', 'DESC']],
  });

  return { logs, totalLogs };
};

module.exports = { createLog, getAllLogs };
