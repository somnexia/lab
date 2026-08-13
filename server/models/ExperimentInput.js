'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExperimentInput extends Model {
    static associate(models) {
      ExperimentInput.belongsTo(models.Experiment, {
        foreignKey: 'experiment_id',
        as: 'experiment',
      });
      ExperimentInput.belongsTo(models.Inventory, {
        foreignKey: 'inventory_id',
        as: 'inventory',
      });
    }
  }

  ExperimentInput.init(
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
      input_role: {
        type: DataTypes.ENUM('reagent', 'equipment'),
        allowNull: false,
        defaultValue: 'reagent',
      },
      item_type: {
        type: DataTypes.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      inventory_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.DECIMAL(12, 6),
        allowNull: true,
      },
      unit_measure: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'ExperimentInput',
      tableName: 'experiment_inputs',
      timestamps: false,
    }
  );

  return ExperimentInput;
};
