'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '1234', // Замените на хэшированный пароль
        employee_id: null,
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: '1234', // Замените на хэшированный пароль
        employee_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
