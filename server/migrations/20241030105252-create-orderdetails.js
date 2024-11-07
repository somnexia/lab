'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orderdetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'orders', 
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      inventory_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'inventories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      
      unique_id: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null
      },
      reserved_quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reservation_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      return_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.ENUM('reserved', 'returned', 'in use'),
        allowNull: true,
        defaultValue: 'reserved'
      },
      last_updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orderdetails');
  }
};
