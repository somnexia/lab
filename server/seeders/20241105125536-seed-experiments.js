'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('experiments', [
      {
        id: 1,
        research_id: 1,
        name: 'Hypertension Medication Trial',
        laboratory_id: null,
        description: 'Testing the efficacy of a new hypertension medication',
        start_date: '2023-05-10 00:00:00',
        end_date: '2024-05-10 00:00:00',
        status: 'Ongoing'
      },
      {
        id: 2,
        research_id: 2,
        name: 'Urban Bird Migration Observation',
        laboratory_id: null,
        description: 'Observing bird migration patterns in urban areas',
        start_date: '2023-03-15 00:00:00',
        end_date: '2023-08-15 00:00:00',
        status: 'Completed'
      },
      {
        id: 3,
        research_id: 1,
        name: 'Stock Market Prediction Model Development',
        laboratory_id: null,
        description: 'Developing a mathematical model for predicting stock market trends',
        start_date: '2023-07-01 00:00:00',
        end_date: '2024-07-01 00:00:00',
        status: 'Pending'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('experiments', null, {});
  }
};
