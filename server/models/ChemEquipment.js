'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemEquipment extends Model {
    static associate(models) {
      ChemEquipment.hasMany(models.Inventory, {
        foreignKey: 'reference_id',
        constraints: false,
        scope: { item_type: 'equipment' },
        as: 'inventories',
      });
      ChemEquipment.belongsTo(models.ChemEquipment, {
        foreignKey: 'parent_id',
        as: 'parent',
      });
      ChemEquipment.hasMany(models.ChemEquipment, {
        foreignKey: 'parent_id',
        as: 'children',
      });
    }
  }

  ChemEquipment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    unique_id: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chemequipments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    manufacturer: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    model: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    material: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    category: {
      type: DataTypes.ENUM(
        'general',
        'specialized',
        'measuring',
        'analytical',
        'testing'
      ),
      allowNull: false,
    },
    group: {
      type: DataTypes.STRING(50), // Для подгрупп внутри категории
      allowNull: true,
    },

  }, {
    sequelize,
    modelName: 'ChemEquipment',
    tableName: 'chemequipments', // Название таблицы в БД
    timestamps: false, // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemEquipment;
};
