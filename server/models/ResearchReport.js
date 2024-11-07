// models/ResearchReport.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResearchReport extends Model {
    static associate(models) {
      ResearchReport.belongsTo(models.Research, { foreignKey: 'research_id', as: 'research' });
    }
  }

  ResearchReport.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    research_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'researches', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    summary: DataTypes.TEXT,
    total_experiments: { type: DataTypes.INTEGER, defaultValue: 0 },
    aggregate_results: DataTypes.JSON,
    aggregate_expenses: DataTypes.JSON, // Новое поле для хранения расходов
    conclusions: DataTypes.TEXT,
    recommendations: DataTypes.TEXT,
    publication_ready: { type: DataTypes.BOOLEAN, defaultValue: false },
    status: {
      type: DataTypes.ENUM('Draft', 'Under Review', 'Published'), // Новое поле для статуса
      defaultValue: 'Draft'
    }
  }, {
    sequelize,
    modelName: 'ResearchReport',
    tableName: 'researchreports',
    timestamps: true
  });

  return ResearchReport;
};
