
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResearchEmployee extends Model {
    static associate(models) {
      // Определяем связи с Research и Employee
      ResearchEmployee.belongsTo(models.Research, { foreignKey: 'research_id', as: 'research' });
      ResearchEmployee.belongsTo(models.Employee, { foreignKey: 'employee_id', as: 'employee' });
    }
  }

  ResearchEmployee.init({
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
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'employees', // Название таблицы Employee
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    role: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: null
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
    modelName: 'ResearchEmployee',
    tableName: 'researchemployees',
    timestamps: true,
    // Один employee — не больше одной строки membership на research
    indexes: [
      {
        unique: true,
        fields: ['research_id', 'employee_id'],
        name: 'researchemployees_research_id_employee_id_unique',
      },
    ],
  });

  return ResearchEmployee;
};
