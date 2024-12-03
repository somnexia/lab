'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('chemelements', [
      { id: 1, cas_id: '1333-74-0', symbol: 'H', name: 'Hydrogen', atomic_number: 1, atomic_weight: 1.008, chemical_group: 'Nonmetal', aggregate_state: 'Gas', description: 'Hydrogen is a chemical element with symbol H and atomic number 1. It is the lightest element in the periodic table.' },
      { id: 2, cas_id: '7440-59-7', symbol: 'He', name: 'Helium', atomic_number: 2, atomic_weight: 4.0026, chemical_group: 'Noble gas', aggregate_state: 'Gas', description: 'Helium is a chemical element with symbol He and atomic number 2. It is a colorless, odorless, tasteless, non-toxic, inert, monatomic gas.' },
      { id: 3, cas_id: '7439-93-2', symbol: 'Li', name: 'Lithium', atomic_number: 3, atomic_weight: 6.94, chemical_group: 'Alkali metal', aggregate_state: 'Solid', description: 'Lithium is a chemical element with symbol Li and atomic number 3. It is a soft, silvery-white alkali metal.' },
      { id: 4, cas_id: '7440-41-7', symbol: 'Be', name: 'Beryllium', atomic_number: 4, atomic_weight: 9.0122, chemical_group: 'Alkaline earth metal', aggregate_state: 'Solid', description: 'Beryllium is a chemical element with symbol Be and atomic number 4. It is a relatively rare element in the universe, usually occurring as a product of the spallation of larger atomic nuclei.' },
      { id: 5, cas_id: '7440-42-8', symbol: 'B', name: 'Boron', atomic_number: 5, atomic_weight: 10.81, chemical_group: 'Metalloid', aggregate_state: 'Solid', description: 'Boron is a chemical element with symbol B and atomic number 5. It is a low-abundance element in the Earth\'s crust and is primarily produced by the mining of borate minerals.' },
      { id: 6, cas_id: '7440-44-0', symbol: 'C', name: 'Carbon', atomic_number: 6, atomic_weight: 12.011, chemical_group: 'Nonmetal', aggregate_state: 'Solid', description: 'Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic and tetravalent—making four electrons available to form covalent chemical bonds.' },
      { id: 7, cas_id: '7727-37-9', symbol: 'N', name: 'Nitrogen', atomic_number: 7, atomic_weight: 14.007, chemical_group: 'Nonmetal', aggregate_state: 'Gas', description: 'Nitrogen is a chemical element with symbol N and atomic number 7. It is a nonmetal with properties that are intermediate between the elements above and below in the periodic table.' },
      { id: 8, cas_id: '7782-44-7', symbol: 'O', name: 'Oxygen', atomic_number: 8, atomic_weight: 15.999, chemical_group: 'Nonmetal', aggregate_state: 'Gas', description: 'Oxygen is a chemical element with symbol O and atomic number 8. It is a member of the chalcogen group in the periodic table, a highly reactive nonmetal, and an oxidizing agent that readily forms oxides with most elements.' },
      { id: 9, cas_id: '7782-41-4', symbol: 'F', name: 'Fluorine', atomic_number: 9, atomic_weight: 18.998, chemical_group: 'Halogen', aggregate_state: 'Gas', description: 'Fluorine is a chemical element with symbol F and atomic number 9. It is the lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard conditions.' },
      { id: 10, cas_id: '7440-01-9', symbol: 'Ne', name: 'Neon', atomic_number: 10, atomic_weight: 20.18, chemical_group: 'Noble gas', aggregate_state: 'Gas', description: 'Neon is a chemical element with symbol Ne and atomic number 10.' },
      { id: 11, cas_id: '7440-23-5', symbol: 'Na', name: 'Sodium', atomic_number: 11, atomic_weight: 22.99, chemical_group: 'Alkali metal', aggregate_state: 'Solid', description: 'Sodium is a chemical element with symbol Na and atomic number 11.' },
      { id: 12, cas_id: '7439-95-4', symbol: 'Mg', name: 'Magnesium', atomic_number: 12, atomic_weight: 24.305, chemical_group: 'Alkaline earth metal', aggregate_state: 'Solid', description: 'Magnesium is a chemical element with symbol Mg and atomic number 12.' },
      { id: 13, cas_id: '7429-90-5', symbol: 'Al', name: 'Aluminum', atomic_number: 13, atomic_weight: 26.982, chemical_group: 'Metal', aggregate_state: 'Solid', description: 'Aluminum is a chemical element with symbol Al and atomic number 13.' },
      { id: 14, cas_id: '7440-21-3', symbol: 'Si', name: 'Silicon', atomic_number: 14, atomic_weight: 28.0855, chemical_group: 'Metalloid', aggregate_state: 'Solid', description: 'Silicon is a chemical element with symbol Si and atomic number 14.' },
      { id: 15, cas_id: '7723-14-0', symbol: 'P', name: 'Phosphorus', atomic_number: 15, atomic_weight: 30.9738, chemical_group: 'Nonmetal', aggregate_state: 'Solid', description: 'Phosphorus is a chemical element with symbol P and atomic number 15.' },
      { id: 16, cas_id: '7704-34-9', symbol: 'S', name: 'Sulfur', atomic_number: 16, atomic_weight: 32.065, chemical_group: 'Nonmetal', aggregate_state: 'Solid', description: 'Sulfur is a chemical element with symbol S and atomic number 16.' },
      { id: 17, cas_id: '7782-50-5', symbol: 'Cl', name: 'Chlorine', atomic_number: 17, atomic_weight: 35.453, chemical_group: 'Halogen', aggregate_state: 'Gas', description: 'Chlorine is a chemical element with symbol Cl and atomic number 17.' },
      { id: 18, cas_id: '7440-37-1', symbol: 'Ar', name: 'Argon', atomic_number: 18, atomic_weight: 39.948, chemical_group: 'Noble gas', aggregate_state: 'Gas', description: 'Argon is a chemical element with symbol Ar and atomic number 18.' },
      { id: 19, cas_id: '7440-09-7', symbol: 'K', name: 'Potassium', atomic_number: 19, atomic_weight: 39.0983, chemical_group: 'Alkali metal', aggregate_state: 'Solid', description: 'Potassium is a chemical element with symbol K and atomic number 19.' },
      { id: 20, cas_id: '7440-70-2', symbol: 'Ca', name: 'Calcium', atomic_number: 20, atomic_weight: 40.078, chemical_group: 'Alkaline earth metal', aggregate_state: 'Solid', description: 'Calcium is a chemical element with symbol Ca and atomic number 20.' },
      { id: 21, cas_id: '7440-20-2', symbol: 'Sc', name: 'Scandium', atomic_number: 21, atomic_weight: 44.9559, chemical_group: 'Transition metal', aggregate_state: 'Solid', description: 'Scandium is a chemical element with symbol Sc and atomic number 21.' },
      { id: 22, cas_id: '7440-32-6', symbol: 'Ti', name: 'Titanium', atomic_number: 22, atomic_weight: 47.867, chemical_group: 'Transition metal', aggregate_state: 'Solid', description: 'Titanium is a chemical element with symbol Ti and atomic number 22.' },
      { id: 23, cas_id: '7440-62-2', symbol: 'V', name: 'Vanadium', atomic_number: 23, atomic_weight: 50.9415, chemical_group: 'Transition metal', aggregate_state: 'Solid', description: 'Vanadium is a chemical element with symbol V and atomic number 23.' },
      { id: 24, cas_id: '7440-47-3', symbol: 'Cr', name: 'Chromium', atomic_number: 24, atomic_weight: 51.9961, chemical_group: 'Transition metal', aggregate_state: 'Solid', description: 'Chromium is a chemical element with symbol Cr and atomic number 24.' },

    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('chemelements', null, {});
  }
};
