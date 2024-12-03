'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chemelements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cas_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'chemelements',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      symbol: {
        type: Sequelize.STRING(2),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      atomic_number: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      atomic_weight: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        defaultValue: null
      },
      chemical_group: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      aggregate_state: {
        type: Sequelize.STRING(100),
        allowNull: true,
        defaultValue: null
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chemelements');
  }
};
