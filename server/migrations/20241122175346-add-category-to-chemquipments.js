'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('chemequipments', 'category', {
      type: Sequelize.ENUM(
        'general',
        'specialized',
        'measuring',
        'analytical',
        'testing'
      ),
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('chemequipments', 'category');
  }
};
