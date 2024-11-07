'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemElement extends Model {
    static associate(models) {
      ChemElement.hasMany(models.Inventory, {
        foreignKey: 'reference_id',
        constraints: false,
        scope: { item_type: 'element' }, // Ограничение на тип
        as: 'inventories'

      });
      ChemElement.belongsTo(models.ChemElement, {
        foreignKey: 'parent_id',
        as: 'parent',
      });
      ChemElement.hasMany(models.ChemElement, {
        foreignKey: 'parent_id',
        as: 'children',
      });
    }
  }

  ChemElement.init({
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
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chemelements',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    symbol: {
      type: DataTypes.STRING(2),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    atomic_number: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    atomic_weight: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: null
    },
    chemical_group: {
      type: DataTypes.STRING(50),
      allowNull: false
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
    modelName: 'ChemElement',
    tableName: 'chemelements',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemElement;
};
