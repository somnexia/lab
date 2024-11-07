// models/StorageUnit.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StorageUnit extends Model {
    static associate(models) {
      StorageUnit.belongsToMany(models.Inventory, {
        through: 'InventoryStorageUnit',
        foreignKey: 'storageunit_id',
        otherKey: 'inventory_id',
        as: 'inventories'
      });
      // Привязка к основной зоне хранения
      StorageUnit.belongsTo(models.ChemStorage, { foreignKey: 'storage_id' });

      // Рекурсивная связь: один StorageUnit может содержать другие StorageUnits
      StorageUnit.belongsTo(models.StorageUnit, { as: 'parent', foreignKey: 'parent_id' });
      StorageUnit.hasMany(models.StorageUnit, { as: 'children', foreignKey: 'parent_id' });

      // Связь с реагентами, которые хранятся в этом StorageUnit
      StorageUnit.hasMany(models.Inventory, { foreignKey: 'storage_id' });
    }
  }

  StorageUnit.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    storage_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'chemstorages',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'storageunits',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    unit_type: {
      type: DataTypes.ENUM(
        'storage_laboratory', 'storage_room', 'freezer', 'refrigerator', 'cabinet', 'vented_cabinet',
        'safety_cabinet', 'fume_hood', 'desiccator', 'glove_box', 'incubator',
        'shelf', 'drawer', 'rack', 'tray', 'bin',
        'container', 'bottle', 'jar', 'flask', 'tube', 'canister', 'vessel', 'ampoule',
        'tank', 'cylinder', 'carboy', 'dewar_flask'
      ),
      allowNull: false
    },
    unit_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    capacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    current_utilization: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0
    },
    temperature: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    humidity: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    pressure: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true
    },
    material: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    is_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    safety_rating: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    last_maintenance_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    next_maintenance_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    alarm_threshold: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true
    },
    location_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    expiration_date_check: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'StorageUnit',
    tableName: 'storageunits',  // Указываем название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return StorageUnit;
};
