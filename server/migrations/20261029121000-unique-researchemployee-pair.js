'use strict';

/**
 * Unique-индекс (research_id, employee_id): один сотрудник —
 * не больше одной строки membership в одном исследовании.
 * Перед применением дубликаты должны быть удалены.
 * В MySQL несколько строк с NULL в колонках unique-пары допустимы.
 */

const INDEX_NAME = 'researchemployees_research_id_employee_id_unique';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('researchemployees', ['research_id', 'employee_id'], {
      unique: true,
      name: INDEX_NAME,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('researchemployees', INDEX_NAME);
  },
};
