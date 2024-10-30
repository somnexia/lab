'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chemcompounds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      unique_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      formula: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      molecular_weight: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: null
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      aggregate_state: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chemcompounds');
  }
};
