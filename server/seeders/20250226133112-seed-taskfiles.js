'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('task_files', [
      {
        id: 1,
        task_id: 1,
        file_path: "uploads/reports/water_analysis.pdf",
        file_type: "pdf",
        updatedAt: new Date(),
        user_id: 1,
        file_size: 3000


      },
      {
        id: 2,
        task_id: 1,
        file_path: "uploads/images/sample1.jpg",
        file_type: "image",
        updatedAt: new Date(),
        user_id: 1,
        file_size: 1000
      },
      {
        id: 3,
        task_id: 2,
        file_path: "uploads/docs/reagent_test_results.zip",
        file_type: "zip",
        updatedAt: new Date(),
        user_id: 2,
        file_size: 2000
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('task_files', null, {});
  }
};
