
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemCompound extends Model {
    static associate(models) {
      ChemCompound.hasMany(models.Inventory, {
        foreignKey: 'reference_id',
        constraints: false,
        scope: { item_type: 'compound' },
        as: 'inventories'
      });
      ChemCompound.belongsTo(models.ChemCompound, {
        foreignKey: 'parent_id',
        as: 'parent',
      });
      ChemCompound.hasMany(models.ChemCompound, {
        foreignKey: 'parent_id',
        as: 'children',
      });
      
    }
  }

  ChemCompound.init({
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
        model: 'chemcompounds',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    formula: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    molecular_weight: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      defaultValue: null
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    aggregate_state: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'ChemCompound',
    tableName: 'chemcompounds',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemCompound;
};
