'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('logs', [
      {
        action: 'login',
        user_id: 1,  // Здесь можно указать существующий user_id
        timestamp: new Date(),
        resource_type: 'user',
        resource_id: 1,
        description: 'User logged in',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        session_id: 'abc123',
        status: 'success'
      },
      {
        action: 'update',
        user_id: 2,
        timestamp: new Date(),
        resource_type: 'order',
        resource_id: 101,
        description: 'Order details updated',
        ip_address: '192.168.1.2',
        user_agent: 'Mozilla/5.0',
        session_id: 'xyz456',
        status: 'success'
      },
      // Добавьте еще записи по аналогии
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('logs', null, {});
  }
};
