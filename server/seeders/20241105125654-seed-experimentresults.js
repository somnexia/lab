'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('experimentresults', [
      {
        id: 1,
        experiment_id: 1,
        result_item_name: 'Water',
        result_item_type: 'compound',
        quantity: 100.00,
        unit_measure: 'ml',
        receipt_date: '2024-06-03 00:00:00',
        description: 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.'
      },
      {
        id: 2,
        experiment_id: 1,
        result_item_name: 'Salt',
        result_item_type: 'element',
        quantity: 20.00,
        unit_measure: 'g',
        receipt_date: '2024-06-03 00:00:00',
        description: 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.'
      },
      {
        id: 3,
        experiment_id: 2,
        result_item_name: 'Ethanol',
        result_item_type: 'compound',
        quantity: 60.00,
        unit_measure: 'ml',
        receipt_date: '2024-06-04 00:00:00',
        description: 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound.'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('experimentresults', null, {});
  }
};
