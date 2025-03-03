'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('employees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      surname: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      position: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      department: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      specialization: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      lab_id: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('employees');
  }
};
