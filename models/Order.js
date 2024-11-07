'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.hasMany(models.OrderDetails, { // Уникальное название промежуточной таблицы
        foreignKey: 'order_id',
        as: 'orderDetails'  // Псевдоним для связи
      });
      // Связь с Item через OrderDetail (many-to-many)
      Order.belongsToMany(models.Inventory, {
        through: 'orderdetails', // промежуточная таблица
        foreignKey: 'order_id', // внешний ключ на Order в OrderDetail
        otherKey: 'inventory_id', // внешний ключ на Item в OrderDetail
        as: 'inventories'
    });
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
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
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
