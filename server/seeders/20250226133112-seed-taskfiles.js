'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('task_files', [
      {
        id: 1,
        task_id: 1,
        file_path: "uploads/reports/water_analysis.pdf",
        file_type: "pdf"
      },
      {
        id: 2,
        task_id: 1,
        file_path: "uploads/images/sample1.jpg",
        file_type: "image"
      },
      {
        id: 3,
        task_id: 2,
        file_path: "uploads/docs/reagent_test_results.zip",
        file_type: "zip"
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('task_files', null, {});
  }
};
