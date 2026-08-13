'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExperimentOutput extends Model {
    static associate(models) {
      ExperimentOutput.belongsTo(models.Experiment, {
        foreignKey: 'experiment_id',
        as: 'experiment',
      });
    }
  }

  ExperimentOutput.init(
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
      item_type: {
        type: DataTypes.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: false,
      },
      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      result_item_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
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
      modelName: 'ExperimentOutput',
      tableName: 'experiment_outputs',
      timestamps: false,
    }
  );

  return ExperimentOutput;
};
