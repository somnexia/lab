
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    static associate(models) {
      // Определяем связь с лабораторией, если она существует
      Employee.belongsTo(models.Laboratory, { foreignKey: 'lab_id', as: 'laboratory' });
      Employee.hasOne(models.User, { foreignKey: 'employee_id', as: 'user' });
    }
  }

  Employee.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    surname: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    specialization: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: null
    },
    lab_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'laboratories', // Должно совпадать с названием таблицы Laboratory
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Employee',
    tableName: 'employees',  // Название таблицы в БД
    timestamps: true  // Отключаем автоматические поля createdAt и updatedAt
  });

  return Employee;
};
