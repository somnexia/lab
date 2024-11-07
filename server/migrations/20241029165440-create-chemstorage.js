'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('chemstorages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storage_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      },
      capacity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      current_utilization: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0.00
      },
      laboratory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'laboratories', // Должно совпадать с названием таблицы Laboratory
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      storage_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('chemstorages');
  }
};
