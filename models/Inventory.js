'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      // Определите здесь ассоциации, если есть
    }
  }

  Inventory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    unique_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    item_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null
    },
    item_type: {
      type: DataTypes.ENUM('element', 'compound', 'mixture', 'equipment'),
      allowNull: true,
      defaultValue: null
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    substance_quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null
    },
    measurement_unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    storage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    receipt_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    expiration_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    supplier: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.ENUM('available', 'reserved', 'used'),
      allowNull: true,
      defaultValue: 'available'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    safety_info: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Inventory',
    tableName: 'inventories', // Название таблицы в БД
    timestamps: false // Отключаем автоматические поля createdAt и updatedAt
  });

  return Inventory;
};
