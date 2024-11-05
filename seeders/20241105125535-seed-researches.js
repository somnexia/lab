'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('researches', [
      {
        id: 1,
        title: 'Effects of New Drug on Hypertension Patients',
        type: 'Experimental',
        goal: 'To investigate the effects of a new drug on hypertension patients.',
        scope: 'Clinical trial',
        research_object: 'Hypertension patients',
        funding_source: 'National Institute of Health',
        start_date: '2023-05-10 00:00:00',
        end_date: '2024-05-10 00:00:00',
        status: 'Ongoing'
      },
      {
        id: 2,
        title: 'Bird Migration Patterns in Urban Environments',
        type: 'Observational',
        goal: 'To analyze the migration patterns of birds in urban environments.',
        scope: 'Ecological study',
        research_object: 'Urban bird populations',
        funding_source: 'National Audubon Society',
        start_date: '2023-03-15 00:00:00',
        end_date: '2023-08-15 00:00:00',
        status: 'Completed'
      },
      {
        id: 3,
        title: 'Mathematical Model for Stock Market Trends',
        type: 'Theoretical',
        goal: 'To develop a mathematical model for predicting stock market trends.',
        scope: 'Mathematical modeling',
        research_object: 'Stock market data',
        funding_source: 'University Grant',
        start_date: '2023-07-01 00:00:00',
        end_date: '2024-07-01 00:00:00',
        status: 'Pending'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('researches', null, {});
  }
};
