'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('inventories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'ID ссылки на запись в одной из связанных таблиц'
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
        comment: 'Тип связанной записи("element","equipment","compound","mixture")'
      },
      total_quantity: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      substance_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
      },
      unit_measure: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      // storageunit_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: true,
      //   defaultValue: null,
      //   references: {
      //     model: 'storageunits', // Должно совпадать с названием таблицы Laboratory
      //     key: 'id'
      //   },
      //   onUpdate: 'CASCADE',
      //   onDelete: 'CASCADE'
      // },
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
        type: Sequelize.ENUM('available', 'reserved', 'in use', 'out of stock'),
        allowNull: true,
        defaultValue: 'out of stock',
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


    });
    await queryInterface.addIndex('Inventories', ['reference_id', 'item_type']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('inventories');
  }
};
