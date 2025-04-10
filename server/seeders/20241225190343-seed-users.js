'use strict';

const { ids } = require('webpack');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '1234', // Замените на хэшированный пароль
        employee_id: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: '1234', // Замените на хэшированный пароль
        employee_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
