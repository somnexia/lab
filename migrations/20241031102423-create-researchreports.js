'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('researchreports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      research_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'researches', // Таблица Research
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      total_experiments: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      },
      aggregate_results: {
        type: Sequelize.JSON, // Если JSON поддерживается в вашей БД
        allowNull: true,
        defaultValue: null
      },
      conclusions: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      recommendations: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      publication_ready: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('researchreports');
  }
};
