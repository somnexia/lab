'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('inventorystorageunits', [
      {
        inventory_id: 1,
        storageunit_id: 2,
        quantity: 50,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 1,
        storageunit_id: 3,
        quantity: 20,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 2,
        storageunit_id: 1,
        quantity: 30,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 3,
        storageunit_id: 4,
        quantity: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 6,
        storageunit_id: 3,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 19,
        storageunit_id: 3,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 2,
        storageunit_id: 15,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 18,
        storageunit_id: 3,
        quantity: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 21,
        storageunit_id: 14,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 17,
        storageunit_id: 13,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 20,
        storageunit_id: 11,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 25,
        storageunit_id: 13,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 20,
        storageunit_id: 14,
        quantity: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 21,
        storageunit_id: 14,
        quantity: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        inventory_id: 22,
        storageunit_id: 14,
        quantity: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('inventorystorageunits', null, {});
  }
};
