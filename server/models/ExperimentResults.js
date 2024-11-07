// models/experimentresults.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExperimentResults extends Model {
    static associate(models) {
      // Связь с таблицей Experiment
      ExperimentResults.belongsTo(models.Experiment, { foreignKey: 'experiment_id', as: 'experiment' });
      
      // Связь с таблицей Laboratory
    //   ExperimentResults.belongsTo(models.Laboratory, { foreignKey: 'laboratory_id', as: 'laboratory' });
    }
  }

  ExperimentResults.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    experiment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'experiments', // Название таблицы Experiment
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    result_item_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    result_item_type: {
      type: DataTypes.ENUM('element', 'compound', 'mixture', 'equipment'),
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    unit_measure: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    // laboratory_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   references: {
    //     model: 'laboratories', // Название таблицы Laboratory
    //     key: 'id'
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'SET NULL'
    // },
    receipt_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'ExperimentResults',
    tableName: 'experimentresults',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ExperimentResults;
};
