'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      unique_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      item_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null,
      },
      item_type: {
        type: Sequelize.ENUM('element', 'compound', 'mixture', 'equipment'),
        allowNull: true,
        defaultValue: null,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      substance_quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      unit_measure: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      storage_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      receipt_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      expiration_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      supplier: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
      },
      last_updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.ENUM('available', 'reserved', 'used'),
        allowNull: true,
        defaultValue: 'available',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      safety_info: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      // createdAt: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      // },
      // updatedAt: {
      //   type: Sequelize.DATE,
      //   allowNull: false,
      //   defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      // },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  }
};
