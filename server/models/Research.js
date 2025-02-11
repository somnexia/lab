// models/research.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Research extends Model {
    static associate(models) {
      // Определите здесь ассоциации, если они есть
    }
  }


  Research.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    scope: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    research_object: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    funding_source: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
    },
    status: {
      type: DataTypes.ENUM('Completed', 'Ongoing', 'Pending'),
      allowNull: false,
      defaultValue: 'Pending'
    }
  }, {
    sequelize,
    modelName: 'Research',
    tableName: 'researches',  // Название таблицы в БД
    timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
  });

  return Research;
};
