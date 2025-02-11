'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Carts', {

      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // Имя таблицы пользователей
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Inventories', // Имя таблицы инвентаря
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      item_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      substance_amount: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      unit_measure: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      supplier: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('available', 'in use', 'reserved', 'unavailable'),
        allowNull: false,
        defaultValue: 'available',
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Carts');
  }
};