'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('researchemployees', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      research_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'researches', // Название таблицы Research
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'employees', // Название таблицы Employee
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      role: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('researchemployees');
  }
};
