'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('experiment_consumptions', {
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
      experiment_input_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'experiment_inputs', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'inventories', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      item_type: {
        type: Sequelize.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity_consumed: {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: false,
      },
      unit_measure: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      consumed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      consumption_phase: {
        type: Sequelize.ENUM('run', 'complete'),
        allowNull: false,
        defaultValue: 'run',
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    });

    await queryInterface.addIndex('experiment_consumptions', ['experiment_id'], {
      name: 'experiment_consumptions_experiment_id_idx',
    });
    await queryInterface.addIndex('experiment_consumptions', ['inventory_id'], {
      name: 'experiment_consumptions_inventory_id_idx',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('experiment_consumptions');
  },
};
