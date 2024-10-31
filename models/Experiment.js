// models/experiment.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Experiment extends Model {
    static associate(models) {
      // Связь с таблицей Research
      Experiment.belongsTo(models.Research, { foreignKey: 'research_id', as: 'research' });
      
      // Связь с таблицей Laboratory
      Experiment.belongsTo(models.Laboratory, { foreignKey: 'laboratory_id', as: 'laboratory' });
    }
  }

  Experiment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    research_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'researches', // Название таблицы Research
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    laboratory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'laboratories', // Название таблицы Laboratory
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null
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
    modelName: 'Experiment',
    tableName: 'experiments',
    timestamps: false
  });

  return Experiment;
};
