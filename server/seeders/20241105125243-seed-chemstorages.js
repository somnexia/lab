'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('chemstorages', [
      {
        id: 1,
        storage_name: 'ChemSafe A',
        description: 'Storage for chemical equipment and reagents.',
        capacity: 1000.00,
        current_utilization: 600.00,
        laboratory_id: 1,
        storage_type: 'Chemical Storage'
      },
      {
        id: 2,
        storage_name: 'LabGuard B',
        description: 'Secure storage for laboratory equipment and chemical substances.',
        capacity: 1500.00,
        current_utilization: 850.00,
        laboratory_id: 1,
        storage_type: 'Biochemical Warehouse'
      },
      {
        id: 3,
        storage_name: 'SecureChem C',
        description: 'Warehouse for storing chemical reagents and test tubes.',
        capacity: 2000.00,
        current_utilization: 1200.00,
        laboratory_id: 1,
        storage_type: 'Chemical Stockroom'
      },
      {
        id: 4,
        storage_name: 'ChemStock D',
        description: 'Storage for laboratory equipment and chemical preparations.',
        capacity: 1800.00,
        current_utilization: 1000.00,
        laboratory_id: 1,
        storage_type: 'Analytical Storage'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('chemstorages', null, {});
  
  }
};
