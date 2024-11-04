
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemEquipment extends Model {
    static associate(models) {
      // Определите здесь ассоциации, если есть
    }
  }

  ChemEquipment.init({
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    manufacturer: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    material: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'ChemEquipment',
    tableName: 'chemequipments',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemEquipment;
};
