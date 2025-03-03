'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('researchemployees', [
      {
        id: 1, research_id: 1, employee_id: 1, role: 'Principal Investigator', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2, research_id: 1, employee_id: 2, role: 'Research Assistant', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3, research_id: 1, employee_id: 3, role: 'Research Assistant', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4, research_id: 1, employee_id: 4, role: 'Technical Staff', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5, research_id: 1, employee_id: 5, role: 'Intern', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6, research_id: 2, employee_id: 6, role: 'Collaborator', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7, research_id: 2, employee_id: 7, role: 'Co-Investigator', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8, research_id: 2, employee_id: 8, role: 'Principal Investigator', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9, research_id: 2, employee_id: 1, role: 'Research Assistant', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10, research_id: 2, employee_id: 2, role: 'Co-Investigator', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11, research_id: 2, employee_id: 5, role: 'Research Assistant', createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12, research_id: 2, employee_id: 1, role: 'Research Assistant', createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('researchemployees', null, {});
  }
};
