'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('experimentexpenses', [
      {
        id: 1,
        experiment_id: 1,
        orderdetails_id: 10,
        unique_id: null,
        quantity_used: 60,
        unit_measure: 'ml'
      },
      {
        id: 2,
        experiment_id: 1,
        orderdetails_id: 10,
        unique_id: null,
        quantity_used: 60,
        unit_measure: 'ml'
      },
      {
        id: 3,
        experiment_id: 1,
        orderdetails_id: 10,
        unique_id: null,
        quantity_used: 80,
        unit_measure: 'ml'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('experimentexpenses', null, {});
  }
};
