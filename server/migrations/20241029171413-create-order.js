'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_number: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      research_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      last_updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      status: {
        type: Sequelize.ENUM('active', 'completed', 'canceled'),
        allowNull: false,
        defaultValue: 'active',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};
