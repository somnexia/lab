'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('laboratories', [
      {
        id: 1,
        lab_name: 'Chemistry Lab',
        location: 'Building A, Room 101',
        address: '123 Main Street, Cityville, State, ZIP',
        description: 'A laboratory for conducting experiments in chemistry.',
        specialization: 'Chemistry',
        lab_type: 'Research',

      },
      {
        id: 2,
        lab_name: 'Biology Lab',
        location: 'Building B, Room 202',
        address: '456 Elm Street, Townville, State, ZIP',
        description: 'A laboratory for studying biological organisms and processes.',
        specialization: 'Biology',
        lab_type: 'Research',

      },
      {
        id: 3,
        lab_name: 'Physics Lab',
        location: 'Building C, Room 303',
        address: '789 Oak Street, Villageton, State, ZIP',
        description: 'A laboratory for conducting experiments in physics.',
        specialization: 'Physics',
        lab_type: 'Research',

      },
      {
        id: 4,
        lab_name: 'Clinical Lab',
        location: 'Building L, Room 1212',
        address: '101 Hospital Avenue, Citytown, State, ZIP',
        description: 'A laboratory for conducting medical tests and analyzing patient samples.',
        specialization: 'Medicine',
        lab_type: 'Clinical',

      },
      {
        id: 5,
        lab_name: 'Environmental Lab',
        location: 'Building M, Room 1313',
        address: '202 Environmental Street, Greencity, State, ZIP',
        description: 'A laboratory for studying environmental samples and monitoring environmental factors.',
        specialization: 'Environmental Science',
        lab_type: 'Research',

      },
      {
        id: 6,
        lab_name: 'Materials Science Lab',
        location: 'Building N, Room 1414',
        address: '303 Science Boulevard, Techville, State, ZIP',
        description: 'A laboratory for studying the properties and behavior of materials.',
        specialization: 'Materials Science',
        lab_type: 'Research',

      },
      {
        id: 7,
        lab_name: 'Forensic Lab',
        location: 'Building O, Room 1515',
        address: '404 Justice Lane, Crimetown, State, ZIP',
        description: 'A laboratory for analyzing evidence related to criminal investigations.',
        specialization: 'Forensic Science',
        lab_type: 'Analytical',

      },
      {
        id: 8,
        lab_name: 'Organic Chemistry Lab',
        location: 'Building H, Room 808',
        address: '505 Main Street, Chemicaltown, State, ZIP',
        description: 'A laboratory for conducting experiments in organic chemistry.',
        specialization: 'Chemistry',
        lab_type: 'Research',

      },
      {
        id: 9,
        lab_name: 'Bioinformatics Lab',
        location: 'Building I, Room 909',
        address: '606 Elm Street, Biocity, State, ZIP',
        description: 'A laboratory for analyzing biological data using computational methods.',
        specialization: 'Biology',
        lab_type: 'Computational',

      },
      {
        id: 10,
        lab_name: 'Astrophysics Lab',
        location: 'Building J, Room 1010',
        address: '707 Oak Street, Astrotown, State, ZIP',
        description: 'A laboratory for studying astronomical phenomena and conducting experiments in astrophysics.',
        specialization: 'Physics',
        lab_type: 'Research',

      },
      {
        id: 11,
        lab_name: 'Food Science Lab',
        location: 'Building K, Room 1111',
        address: '808 Pine Street, Foodville, State, ZIP',
        description: 'A laboratory for analyzing food samples and studying food properties.',
        specialization: 'Chemistry',
        lab_type: 'Analytical',

      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('laboratories', null, {});
  }
};
