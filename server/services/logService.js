// services/logService.js
const { Log, User } = require('../models');

const createLog = async (action, userId, details = null) => {
  return await Log.create({
    action,
    user_id: userId,
    details
  });
};

const getAllLogs = async () => {
  return await Log.findAll({
    include: [
        {
          model: User,
          as: 'user', // должно соответствовать ассоциации в модели
          attributes: ['id', 'name', 'email'],
        },
      ],
    order: [['timestamp', 'DESC']]
  });
};

module.exports = { createLog, getAllLogs };
