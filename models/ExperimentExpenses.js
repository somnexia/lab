// models/experimentexpenses.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ExperimentExpenses extends Model {
    static associate(models) {
      // Связи с таблицами Experiment и OrderDetails
      ExperimentExpenses.belongsTo(models.Experiment, { foreignKey: 'experiment_id', as: 'experiment' });
      ExperimentExpenses.belongsTo(models.OrderDetails, { foreignKey: 'orderdetails_id', as: 'orderDetails' });
    }
  }

  ExperimentExpenses.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    experiment_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'experiments',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    orderdetails_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'orderdetails',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    unique_id: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: true,
      defaultValue: null
    },
    quantity_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    unit_measure: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: null
    }
    
  }, {
    sequelize,
    modelName: 'ExperimentExpenses',
    tableName: 'experimentexpenses',
    timestamps: false
  });

  return ExperimentExpenses;
};
