'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('inventorystorageunits', [
      {
        inventory_id: 1,
        storage_unit_id: 2,
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 1,
        storage_unit_id: 3,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 2,
        storage_unit_id: 1,
        quantity: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 3,
        storage_unit_id: 4,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 2,
        storage_unit_id: 3,
        quantity: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventorystorageunits', null, {});
  }
};
