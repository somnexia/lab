'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tasks', [
      {
        id: 1,
        research_id: 1,
        title: "Analysis of water samples",
        description: "Perform chemical analysis of water for heavy metals.",
        subtasks: "Sample collection;Analysis in the laboratory;Report preparation",
        user_id: 1,
        reminder: "12:00:00",
        start_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
        status: "Ongoing"
      },
      {
        id: 2,
        research_id: 2,
        title: "Chemical Reagent Testing",
        description: "Test the performance of reagents under different conditions.",
        subtasks: "Preparation of solutions;Conducting tests;Recording results",
        user_id: 2,
        reminder: "15:30:00",
        start_date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 10)),
        status: "Pending"
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tasks', null, {});
  }
};
