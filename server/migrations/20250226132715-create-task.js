'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tasks', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: false,
        allowNull: false
      },
      research_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'researches',  // Убедись, что таблица `researches` существует
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      subtasks: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
        comment: "Список подзадач, разделенных ';'"
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users', // Имя таблицы
            key: 'id'
        },
        comment: "ID пользователя, загрузившего файл"
    },
      reminder: {
        type: Sequelize.TIME,
        allowNull: true,
        defaultValue: null
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM('Completed', 'Ongoing', 'Pending', 'Draft', 'Canceled', 'Critical'),
        allowNull: false,
        defaultValue: 'Pending'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tasks');
  }
};
