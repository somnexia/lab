
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    static associate(models) {
      // Связь с таблицей Inventory, если она существует
      OrderDetails.belongsTo(models.Inventory, { foreignKey: 'inventory_id' });
      OrderDetails.belongsTo(models.Order, { foreignKey: 'order_id' });
      
    }
  }

  OrderDetails.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders', // Название таблицы Inventory
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    inventory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'inventories', // Название таблицы Inventory
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    unique_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    reserved_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reservation_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    return_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM('reserved', 'returned', 'in use'),
      allowNull: true,
      defaultValue: 'reserved'
    },
    last_updated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      onUpdate: sequelize.literal('CURRENT_TIMESTAMP')
    },
    
  }, {
    sequelize,
    modelName: 'OrderDetails',
    tableName: 'orderdetails',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return OrderDetails;
};
