'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('experiment_inputs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      experiment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'experiments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      input_role: {
        type: Sequelize.ENUM('reagent', 'equipment'),
        allowNull: false,
        defaultValue: 'reagent',
      },
      item_type: {
        type: Sequelize.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'inventories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      quantity: {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: true,
      },
      unit_measure: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.createTable('experiment_outputs', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      experiment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'experiments', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      item_type: {
        type: Sequelize.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      result_item_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: true,
      },
      unit_measure: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await queryInterface.addIndex('experiment_inputs', ['experiment_id'], {
      name: 'experiment_inputs_experiment_id_idx',
    });
    await queryInterface.addIndex('experiment_outputs', ['experiment_id'], {
      name: 'experiment_outputs_experiment_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('experiment_outputs');
    await queryInterface.dropTable('experiment_inputs');
  },
};
