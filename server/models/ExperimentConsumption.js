'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExperimentConsumption extends Model {
    static associate(models) {
      ExperimentConsumption.belongsTo(models.Experiment, {
        foreignKey: 'experiment_id',
        as: 'experiment',
      });
      ExperimentConsumption.belongsTo(models.ExperimentInput, {
        foreignKey: 'experiment_input_id',
        as: 'input',
      });
      ExperimentConsumption.belongsTo(models.Inventory, {
        foreignKey: 'inventory_id',
        as: 'inventory',
      });
    }
  }

  ExperimentConsumption.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      experiment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      experiment_input_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      inventory_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      item_type: {
        type: DataTypes.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity_consumed: {
        type: DataTypes.DECIMAL(12, 6),
        allowNull: false,
      },
      unit_measure: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      consumed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      consumption_phase: {
        type: DataTypes.ENUM('run', 'complete'),
        allowNull: false,
        defaultValue: 'run',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ExperimentConsumption',
      tableName: 'experiment_consumptions',
      timestamps: false,
    }
  );

  return ExperimentConsumption;
};
