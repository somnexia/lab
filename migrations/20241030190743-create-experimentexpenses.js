'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('experimentexpenses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      experiment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'experiments', // Название таблицы Experiment
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      orderdetails_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'orderdetails', // Название таблицы OrderDetails
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      unique_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        unique: true,
        defaultValue: null
      },
      quantity_used: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null
      },
      unit_measure: {
        type: Sequelize.STRING(10),
        allowNull: true,
        defaultValue: null
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('experimentexpenses');
  }
};
