
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemMixture extends Model {
    static associate(models) {
      ChemMixture.hasMany(models.Inventory, {
        foreignKey: 'reference_id',
        constraints: false,
        scope: { item_type: 'mixture' },
        as: 'inventories'
    });
      ChemMixture.belongsTo(models.ChemMixture, {
        foreignKey: 'parent_id',
        as: 'parent',
      });
      ChemMixture.hasMany(models.ChemMixture, {
        foreignKey: 'parent_id',
        as: 'children',
      });
    }
  }

  ChemMixture.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    cas_id: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'chemmixtures',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    composition: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    physical_properties: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    chemical_properties: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    mixture_type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null
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
    modelName: 'ChemMixture',
    tableName: 'chemmixtures',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemMixture;
};
