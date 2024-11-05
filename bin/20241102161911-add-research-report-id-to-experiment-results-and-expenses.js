'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('ExperimentResults', 'research_report_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ResearchReports',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('ExperimentExpenses', 'research_report_id', {
      type: Sequelize.INTEGER,
      references: {
        model: 'ResearchReports',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('ExperimentResults', 'research_report_id');
    await queryInterface.removeColumn('ExperimentExpenses', 'research_report_id');
  }
};
