'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class MixtureComponent extends Model {
    static associate(models) {
      MixtureComponent.belongsTo(models.ChemMixture, {
        foreignKey: 'mixture_id',
        as: 'mixture',
      });
    }
  }

  MixtureComponent.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      mixture_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      component_kind: {
        type: DataTypes.ENUM('element', 'compound', 'mixture'),
        allowNull: false,
      },
      component_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      amount: {
        type: DataTypes.DECIMAL(12, 6),
        allowNull: true,
      },
      amount_unit: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      mole_fraction: {
        type: DataTypes.DECIMAL(8, 6),
        allowNull: true,
      },
      sort_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'MixtureComponent',
      tableName: 'mixture_components',
      timestamps: false,
    }
  );

  return MixtureComponent;
};
