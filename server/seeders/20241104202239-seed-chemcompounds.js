'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('chemcompounds', [
      {
        id: 1,
        cas_id: '7732-18-5',
        name: 'Water',
        formula: 'H2O',
        molecular_weight: 18.0150,
        description: 'Water is a transparent, tasteless, odorless, and nearly colorless chemical substance, which is the main constituent of Earth\'s streams, lakes, and oceans.',
        aggregate_state: 'liquid'
      },
      {
        id: 2,
        cas_id: '124-38-9',
        name: 'Carbon Dioxide',
        formula: 'CO2',
        molecular_weight: 44.0100,
        description: 'Carbon dioxide is a colorless gas with a density about 60% higher than that of dry air.',
        aggregate_state: 'gas'
      },
      {
        id: 3,
        cas_id: '7647-14-5',
        name: 'Sodium Chloride',
        formula: 'NaCl',
        molecular_weight: 58.4400,
        description: 'Sodium chloride, commonly known as salt, is an ionic compound with the chemical formula NaCl, representing a 1:1 ratio of sodium and chloride ions.',
        aggregate_state: 'solid'
      },
      {
        id: 4,
        cas_id: '7664-41-7',
        name: 'Ammonia',
        formula: 'NH3',
        molecular_weight: 17.0310,
        description: 'Ammonia is a compound of nitrogen and hydrogen with the formula NH3.',
        aggregate_state: 'gas'
      },
      {
        id: 5,
        cas_id: '630-08-0',
        name: 'Carbon Monoxide',
        formula: 'CO',
        molecular_weight: 28.0100,
        description: 'Carbon monoxide is a colorless, odorless, and tasteless gas that is slightly less dense than air.',
        aggregate_state: 'gas'
      },
      {
        id: 6,
        cas_id: '67-56-1',
        name: 'Methanol',
        formula: 'CH3OH',
        molecular_weight: 32.0400,
        description: 'Methanol, also known as methyl alcohol amongst other names, is a chemical with the formula CH3OH.',
        aggregate_state: 'liquid'
      },
      {
        id: 7,
        cas_id: '64-19-7',
        name: 'Acetic Acid',
        formula: 'CH3COOH',
        molecular_weight: 60.0520,
        description: 'Acetic acid, systematically named ethanoic acid, is a colorless liquid organic compound with the chemical formula CH3COOH.',
        aggregate_state: 'liquid'
      },
      {
        id: 8,
        cas_id: '50-99-7',
        name: 'Glucose',
        formula: 'C6H12O6',
        molecular_weight: 180.1560,
        description: 'Glucose is a simple sugar with the molecular formula C6H12O6.',
        aggregate_state: 'solid'
      },
      {
        id: 9,
        cas_id: '7647-01-0',
        name: 'Hydrochloric Acid',
        formula: 'HCl',
        molecular_weight: 36.4610,
        description: 'Hydrochloric acid is a colorless inorganic chemical system with the formula HCl',
        aggregate_state: 'liquid'
      },
      {
        id: 10,
        cas_id: '64-17-5',
        name: 'Ethanol',
        formula: 'C2H6O',
        molecular_weight: 46.0700,
        description: 'Ethanol, also called ethyl alcohol, grain alcohol, or alcohol, is a chemical compound',
        aggregate_state: 'liquid'
      },
      {
        id: 11,
        cas_id: '7664-93-9',
        name: 'Sulfuric Acid',
        formula: 'H2SO4',
        molecular_weight: 98.0790,
        description: 'Sulfuric acid is a strong mineral acid with the molecular formula H2SO4',
        aggregate_state: 'liquid'
      },
      {
        id: 12,
        cas_id: '7697-37-2',
        name: 'Nitric Acid',
        formula: 'HNO3',
        molecular_weight: 63.0120,
        description: 'Nitric acid is a mineral acid also known as aqua fortis and spirit of niter.',
        aggregate_state: 'liquid'
      },
      {
        id: 13,
        cas_id: '67-64-1',
        name: 'Acetone',
        formula: 'C3H6O',
        molecular_weight: 58.0800,
        description: 'Acetone is a colorless, volatile, flammable liquid used as a solvent and in nail polish removers.',
        aggregate_state: 'liquid'
      },
      {
        id: 14,
        cas_id: '1336-21-6',
        name: 'Ammonium Hydroxide',
        formula: 'NH4OH',
        molecular_weight: 35.0500,
        description: 'Ammonium hydroxide, also known as ammonia water, ammonia solution, or aqueous ammonia.',
        aggregate_state: 'liquid'
      },
      {
        id: 15,
        cas_id: '7664-38-2',
        name: 'Phosphoric Acid',
        formula: 'H3PO4',
        molecular_weight: 97.9940,
        description: 'Phosphoric acid is a weak acid with the chemical formula H3PO4.',
        aggregate_state: 'liquid'
      },
      {
        id: 16,
        cas_id: '107-21-1',
        name: 'Ethylene Glycol',
        formula: 'C2H6O2',
        molecular_weight: 62.0700,
        description: 'Ethylene glycol is an organic compound with the formula (CH2OH)2.',
        aggregate_state: 'liquid'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('chemcompounds', null, {});
  }
};
