// models/research.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Research extends Model {
    static associate(models) {
      Research.belongsTo(models.Laboratory, {
        foreignKey: 'laboratory_id',
        as: 'laboratory',
      });

      Research.hasMany(models.ResearchEmployee, {
        foreignKey: 'research_id',
        as: 'participants',
      });

      Research.belongsToMany(models.Employee, {
        through: models.ResearchEmployee,
        foreignKey: 'research_id',
        otherKey: 'employee_id',
        as: 'employees',
      });

      Research.hasMany(models.Experiment, {
        foreignKey: 'research_id',
        as: 'experiments',
      });
    }
  }

  Research.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    scope: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    research_object: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    funding_source: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM('Completed', 'Ongoing', 'Pending'),
      allowNull: false,
      defaultValue: 'Pending',
    },
    /**
     * Владеющая лаборатория (tenant).
     * Команда участников — отдельно в researchemployees.
     * Scope по lab: часть 3 researchScope; запись при create — часть 2.
     */
    laboratory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'laboratories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  }, {
    sequelize,
    modelName: 'Research',
    tableName: 'researches',
    timestamps: false,
  });

  return Research;
};
