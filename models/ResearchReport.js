
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResearchReport extends Model {
    static associate(models) {
      // Связь с таблицей Research
      ResearchReport.belongsTo(models.Research, { foreignKey: 'research_id', as: 'research' });
      
      // Опционально: ассоциация с опубликованными статьями
      ResearchReport.hasMany(models.Publication, { foreignKey: 'researchreport_id', as: 'publications' });
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
      references: {
        model: 'researches',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    total_experiments: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    aggregate_results: {
      type: DataTypes.JSON, // Или TEXT, если JSON недоступен
      allowNull: true,
      defaultValue: null
    },
    total_cost: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      defaultValue: null
    },
    conclusions: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    recommendations: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null
    },
    publication_ready: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'ResearchReport',
    tableName: 'researchreports',
    timestamps: true // для автоматического добавления полей createdAt и updatedAt
  });

  return ResearchReport;
};
