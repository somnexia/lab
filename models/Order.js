'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // Определите здесь ассоциации, если есть
    }
  }

  Order.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_number: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    research_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    last_updated: {
      type: DataTypes.TIMESTAMP,
      defaultValue: DataTypes.NOW
    },
    status: {
      type: DataTypes.ENUM('active', 'completed', 'canceled'),
      allowNull: false,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return Order;
};
