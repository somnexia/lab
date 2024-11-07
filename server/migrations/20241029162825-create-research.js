'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('researches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      goal: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      scope: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      research_object: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      funding_source: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM('Completed', 'Ongoing', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('researches');
  }
};
