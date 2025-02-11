
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Cart.belongsTo(models.Inventory, { foreignKey: 'item_id', as: 'inventory' });

    }
  }

  Cart.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    substance_amount: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    unit_measure: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    supplier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('available', 'in use', 'reserved', 'unavailable'),
      allowNull: false,
      defaultValue: 'available',
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return Cart;
};
