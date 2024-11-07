'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('chemcompounds', [
      {
        id: 1,
        unique_id: 'C0001',
        name: 'Water',
        formula: 'H2O',
        molecular_weight: 18.0150,
        description: 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.',
        aggregate_state: 'liquid'
      },
      {
        id: 2,
        unique_id: 'C0002',
        name: 'Carbon Dioxide',
        formula: 'CO2',
        molecular_weight: 44.0100,
        description: 'Carbon dioxide is a colorless gas with a density about 60% higher than that of dry air.',
        aggregate_state: 'gas'
      },
      {
        id: 3,
        unique_id: 'C0003',
        name: 'Sodium Chloride',
        formula: 'NaCl',
        molecular_weight: 58.4400,
        description: 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.',
        aggregate_state: 'solid'
      },
      {
        id: 4,
        unique_id: 'C0004',
        name: 'Ammonia',
        formula: 'NH3',
        molecular_weight: 17.0310,
        description: 'Ammonia is a compound of nitrogen and hydrogen with the formula NH3.',
        aggregate_state: 'gas'
      },
      {
        id: 5,
        unique_id: 'C0005',
        name: 'Carbon Monoxide',
        formula: 'CO',
        molecular_weight: 28.0100,
        description: 'Carbon monoxide is a colorless, odorless, and tasteless gas that is slightly less dense than air.',
        aggregate_state: 'gas'
      },
      {
        id: 6,
        unique_id: 'C0006',
        name: 'Methanol',
        formula: 'CH3OH',
        molecular_weight: 32.0400,
        description: 'Methanol, also known as methyl alcohol amongst other names, is a chemical with the formula CH3OH.',
        aggregate_state: 'liquid'
      },
      {
        id: 7,
        unique_id: 'C0007',
        name: 'Acetic Acid',
        formula: 'CH3COOH',
        molecular_weight: 60.0520,
        description: 'Acetic acid, systematically named ethanoic acid, is a colorless liquid organic compound with the chemical formula CH3COOH.',
        aggregate_state: 'liquid'
      },
      {
        id: 8,
        unique_id: 'C0008',
        name: 'Glucose',
        formula: 'C6H12O6',
        molecular_weight: 180.1560,
        description: 'Glucose is a simple sugar with the molecular formula C6H12O6.',
        aggregate_state: 'solid'
      },
      {
        id: 9,
        unique_id: 'C0009',
        name: 'Hydrochloric Acid',
        formula: 'HCl',
        molecular_weight: 36.4610,
        description: 'Hydrochloric acid is a colorless inorganic chemical system with the formula HCl',
        aggregate_state: 'liquid'
      },
      {
        id: 10,
        unique_id: 'C0010',
        name: 'Ethanol',
        formula: 'C2H6O',
        molecular_weight: 46.0700,
        description: 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound',
        aggregate_state: 'liquid'
      },
      {
        id: 11,
        unique_id: 'C0011',
        name: 'Sulfuric Acid',
        formula: 'H2SO4',
        molecular_weight: 98.0790,
        description: 'Sulfuric acid is a strong mineral acid with the molecular formula H2SO4',
        aggregate_state: 'liquid'
      },
      {
        id: 12,
        unique_id: 'C0012',
        name: 'Nitric Acid',
        formula: 'HNO3',
        molecular_weight: 63.0120,
        description: 'Nitric acid is a mineral acid also known as aqua fortis and spirit of niter.',
        aggregate_state: 'liquid'
      },
      {
        id: 13,
        unique_id: 'C0013',
        name: 'Acetone',
        formula: 'C3H6O',
        molecular_weight: 58.0800,
        description: 'Acetone is a colorless, volatile, flammable liquid used as a solvent and in nail polish removers.',
        aggregate_state: 'liquid'
      },
      {
        id: 14,
        unique_id: 'C0014',
        name: 'Ammonium Hydroxide',
        formula: 'NH4OH',
        molecular_weight: 35.0500,
        description: 'Ammonium hydroxide, also known as ammonia water, ammonia solution, or aqueous ammonia.',
        aggregate_state: 'liquid'
      },
      {
        id: 15,
        unique_id: 'C0015',
        name: 'Phosphoric Acid',
        formula: 'H3PO4',
        molecular_weight: 97.9940,
        description: 'Phosphoric acid is a weak acid with the chemical formula H3PO4.',
        aggregate_state: 'liquid'
      },
      {
        id: 16,
        unique_id: 'C0016',
        name: 'Ethylene Glycol',
        formula: 'C2H6O2',
        molecular_weight: 62.0700,
        description: 'Ethylene glycol is an organic compound with the formula (CH2OH)2.',
        aggregate_state: 'liquid'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('chemcompounds', null, {});
  }
};
