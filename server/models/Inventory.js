'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Inventory extends Model {
    static associate(models) {
      Inventory.belongsToMany(models.StorageUnit, {
        through: models.InventoryStorageUnit,  // Название промежуточной таблицы
        foreignKey: 'inventory_id',
        otherKey: 'storageunit_id',
        as: 'storageUnits'
      });
      Inventory.hasMany(models.OrderDetails, {
        foreignKey: 'inventory_id', // внешний ключ в OrderDetail
        as: 'orderDetails'
      });

      // Связь с Order через OrderDetail (many-to-many)
      Inventory.belongsToMany(models.Order, {
        through: 'orderdetails', // промежуточная таблица
        foreignKey: 'inventory_Id', // внешний ключ на Item в OrderDetail
        otherKey: 'order_id', // внешний ключ на Order в OrderDetail
        as: 'orders'
      });
      Inventory.belongsTo(models.ChemElement, {
        foreignKey: 'reference_id',
        constraints: false,
        as: 'chemElement'
      });
      Inventory.belongsTo(models.ChemEquipment, {
        foreignKey: 'reference_id',
        constraints: false,
        as: 'chemEquipment'
      });
      Inventory.belongsTo(models.ChemCompound, {
        foreignKey: 'reference_id',
        constraints: false,
        as: 'chemCompound'
      });
      Inventory.belongsTo(models.ChemMixture, {
        foreignKey: 'reference_id',
        constraints: false,
        as: 'chemMixture'
      });
    }
  }

  Inventory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    reference_id: {
      type: DataTypes.INTEGER,
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
    total_quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    },
    substance_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: null
    },
    unit_measure: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    },
    // storageunit_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'storageunits', // Должно совпадать с названием таблицы Laboratory
    //     key: 'id'
    //   },
    //   onUpdate: 'CASCADE',
    //   onDelete: 'CASCADE'
    // },
    storage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'chemstorages', // Должно совпадать с названием таблицы Laboratory
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
