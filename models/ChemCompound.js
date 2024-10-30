
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemCompound extends Model {
    static associate(models) {
      // Определите здесь ассоциации, если есть
    }
  }

  ChemCompound.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    unique_id: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    formula: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    molecular_weight: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    aggregate_state: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'ChemCompound',
    tableName: 'chemcompounds',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemCompound;
};
