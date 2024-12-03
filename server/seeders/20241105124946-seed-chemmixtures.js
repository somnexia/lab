'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('chemmixtures', [
      {
        id: 1,
        cas_id: '7647-14-5',
        name: 'Water - Sodium Chloride Solution',
        composition: 'Water, Sodium Chloride',
        physical_properties: 'Clear liquid',
        chemical_properties: 'Salt dissolved in water',
        mixture_type: 'Homogeneous',
        aggregate_state: 'Liquid',
        description: 'Used for medical and laboratory purposes.'
      },
      {
        id: 2,
        cas_id: '50-99-7',
        name: 'Glucose Solution',
        composition: 'Water, Glucose',
        physical_properties: 'Clear liquid',
        chemical_properties: 'Sugar dissolved in water',
        mixture_type: 'Homogeneous',
        aggregate_state: 'Liquid',
        description: 'Used as a solvent in various applications.'
      },
      {
        id: 3,
        cas_id: '7647-14-5', 
        name: 'Diluted Sodium Chloride Solution',
        composition: 'Water, Sodium Chloride',
        physical_properties: 'Clear liquid',
        chemical_properties: 'Higher concentration of salt in water',
        mixture_type: 'Homogeneous',
        aggregate_state: 'Liquid',
        description: 'Used for medical purposes.'
      },
      {
        id: 4,
        cas_id: '7664-41-7',
        name: 'Ammonia Solution',
        composition: 'Water, Ammonia',
        physical_properties: 'Clear liquid with a pungent smell',
        chemical_properties: 'Ammonia dissolved in water',
        mixture_type: 'Homogeneous',
        aggregate_state: 'Liquid',
        description: 'Used in cleaning agents and as a solvent.'
      },
      {
        id: 5,
        cas_id: '630-08-0',
        name: 'Carbon Monoxide',
        composition: 'Carbon Monoxide',
        physical_properties: 'Gas',
        chemical_properties: 'Toxic gas',
        mixture_type: 'Homogeneous',
        aggregate_state: 'Gas',
        description: 'Used in various industrial processes.'
      },

      {
        id: 20,
        cas_id: '107-21-1',
        name: 'Ethylene Glycol and Nitric Acid Mixture',
        composition: 'Ethylene Glycol, Nitric Acid',
        physical_properties: 'Viscous liquid',
        chemical_properties: 'Corrosive and toxic',
        mixture_type: 'Heterogeneous',
        aggregate_state: 'Liquid',
        description: 'CAS-2: 7697-37-2. Used as antifreeze and in industrial applications.'
      },
    ]);
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('chemmixtures', null, {});
  }
};
