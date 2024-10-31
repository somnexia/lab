'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('experiments', {
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
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      
      laboratory_id:{
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'laboratories', // Название таблицы Laboratory
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM('Completed', 'Ongoing', 'Pending'),
        allowNull: false,
        defaultValue: 'Pending'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('experiments');
  }
};
