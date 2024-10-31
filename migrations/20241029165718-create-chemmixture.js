'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('chemmixtures', {
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
        type: Sequelize.STRING(255),
        allowNull: false
      },
      composition: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      physical_properties: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      chemical_properties: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      mixture_type: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null
      },
      aggregate_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('chemmixtures');
  }
};
