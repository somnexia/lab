'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employees', [
      {
        id: 1,
        name: 'John',
        surname: 'Doe',
        position: 'Research Scientist',
        department: 'Chemistry',
        specialization: 'Organic Chemistry',
        lab_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Alice',
        surname: 'Smith',
        position: 'Lab Technician',
        department: 'Biology',
        specialization: 'Microbiology',
        lab_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'David',
        surname: 'Johnson',
        position: 'Data Analyst',
        department: 'Physics',
        specialization: 'Astrophysics',
        lab_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Emily',
        surname: 'Brown',
        position: 'Lab Assistant',
        department: 'Materials Science',
        specialization: 'Nanotechnology',
        lab_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        name: 'Michael',
        surname: 'Williams',
        position: 'Lab Manager',
        department: 'Chemistry',
        specialization: 'Analytical Chemistry',
        lab_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Sarah',
        surname: 'Davis',
        position: 'Lab Assistant',
        department: 'Biology',
        specialization: 'Genetics',
        lab_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Christopher',
        surname: 'Wilson',
        position: 'Data Scientist',
        department: 'Physics',
        specialization: 'Particle Physics',
        lab_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: 'Jessica',
        surname: 'Miller',
        position: 'Lab Technician',
        department: 'Materials Science',
        specialization: 'Metallurgy',
        lab_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employees', null, {});
  
  }
};
