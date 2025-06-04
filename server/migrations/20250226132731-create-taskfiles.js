'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_files', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      task_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      file_path: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: "Путь к файлу"
      },
      file_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "Тип файла (image, zip, text, etc.)"
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "Дата загрузки файла"
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Название таблицы в БД
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
        file_size: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: "Размер файла в MB"
      }

    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_files');
  }
};
