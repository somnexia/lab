
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ChemStorage extends Model {
    static associate(models) {
      // Связь с лабораторией, если существует
      ChemStorage.belongsTo(models.Laboratory, { foreignKey: 'laboratory_id', as: 'laboratory' });
    }
  }

  ChemStorage.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    storage_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    capacity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    current_utilization: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0.00
    },
    laboratory_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'laboratories', // Должно совпадать с названием таблицы Laboratory
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    storage_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChemStorage',
    tableName: 'chemstorages',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return ChemStorage;
};
