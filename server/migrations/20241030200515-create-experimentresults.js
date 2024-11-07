'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('experimentresults', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      experiment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'experiments', // Название таблицы Experiment
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      result_item_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      result_item_type: {
        type: Sequelize.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      unit_measure: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      // laboratory_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      //   references: {
      //     model: 'laboratories', // Название таблицы Laboratory
      //     key: 'id'
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'SET NULL'
      // },
      receipt_date: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('experimentresults');
  }
};
