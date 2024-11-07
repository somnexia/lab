'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('researchreports', 'status', {
      type: Sequelize.ENUM('Draft', 'Under Review', 'Published'),
      allowNull: false,
      defaultValue: 'Draft',
    });

    await queryInterface.addColumn('researchreports', 'aggregate_expenses', {
      type: Sequelize.JSON, // или Sequelize.TEXT('long') для хранения в виде текста
      allowNull: true,
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('researchreports', 'status');
    await queryInterface.removeColumn('researchreports', 'aggregate_expenses');
  }
};
