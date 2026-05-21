'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('mixture_components', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      mixture_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'chemmixtures',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      component_kind: {
        type: Sequelize.ENUM('element', 'compound', 'mixture'),
        allowNull: false,
      },
      component_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
      amount: {
        type: Sequelize.DECIMAL(12, 6),
        allowNull: true,
        defaultValue: null,
      },
      amount_unit: {
        type: Sequelize.STRING(20),
        allowNull: true,
        defaultValue: null,
      },
      mole_fraction: {
        type: Sequelize.DECIMAL(8, 6),
        allowNull: true,
        defaultValue: null,
      },
      sort_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
    });

    await queryInterface.addIndex('mixture_components', ['mixture_id'], {
      name: 'mixture_components_mixture_id_idx',
    });

    await queryInterface.addIndex('mixture_components', ['component_kind', 'component_id'], {
      name: 'mixture_components_component_idx',
    });

    await queryInterface.addConstraint('mixture_components', {
      fields: ['mixture_id', 'component_kind', 'component_id', 'role'],
      type: 'unique',
      name: 'mixture_components_unique_component_role',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('mixture_components');
  },
};
