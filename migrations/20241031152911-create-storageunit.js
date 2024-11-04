'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('storage_units', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      storage_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'chemstorages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      parent_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'storage_units',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      unit_type: {
        type: Sequelize.ENUM(
          'storage_laboratory', 'storage_room', 'freezer', 'refrigerator', 'cabinet', 'vented_cabinet',
          'safety_cabinet', 'fume_hood', 'desiccator', 'glove_box', 'incubator',
          'shelf', 'drawer', 'rack', 'tray', 'bin',
          'container', 'bottle', 'jar', 'flask', 'tube', 'canister', 'vessel', 'ampoule',
          'tank', 'cylinder', 'carboy', 'dewar_flask'
        ),
        allowNull: false
      },
      unit_name: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      capacity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      current_utilization: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: 0
      },
      temperature: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      humidity: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      pressure: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      material: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      is_locked: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      safety_rating: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      last_maintenance_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      next_maintenance_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      alarm_threshold: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      location_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      expiration_date_check: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('storage_units');
  }
};
