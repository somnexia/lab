// models/StorageUnit.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Task extends Model {
        static associate(models) {
            // Привязка задачи к исследованию
            Task.belongsTo(models.Research, {
                foreignKey: 'research_id',
                as: 'research'
            });

            // Связь с таблицей файлов
            Task.hasMany(models.TaskFile, {
                foreignKey: 'task_id',
                as: 'files'
            });

        }
    }

    Task.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        research_id:{
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        subtasks: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            comment: "Список подзадач, разделенных ';'"
        },

        reminder: {
            type: DataTypes.TIME,
            allowNull: true,
            defaultValue: null
        },


        start_date: {
            type: DataTypes.DATE,
            allowNull: false
        },


        due_date: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null
        },
        
        status: {
            type: DataTypes.ENUM('Completed', 'Ongoing', 'Pending', "Draft", "Canceled", "Critical"),
            allowNull: false,
            defaultValue: 'Pending'
        }
    }, {
        sequelize,
        modelName: 'Task',
        tableName: 'tasks',  // Указываем название таблицы в БД
        timestamps: false  // Отключаем автоматические поля createdAt и updatedAt
    });

    return Task;
};
