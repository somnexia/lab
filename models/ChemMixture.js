
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemMixture extends Model {
    static associate(models) {
      // Определите здесь ассоциации, если они есть
    }
  }

  ChemMixture.init({
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
      type: DataTypes.STRING(255),
      allowNull: false
    },
    composition: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    physical_properties: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    chemical_properties: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    mixture_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null
    },
    aggregate_state: {
      type: DataTypes.STRING(100),
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
    modelName: 'ChemMixture',
    tableName: 'chemmmixtures',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemMixture;
};
