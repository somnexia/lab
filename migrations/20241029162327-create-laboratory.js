'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('laboratories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lab_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      specialization: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null
      },
      lab_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('laboratories');
  }
};
