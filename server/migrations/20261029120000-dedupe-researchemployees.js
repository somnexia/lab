'use strict';

/**
 * Удаляет дубликаты в researchemployees: для каждой пары
 * (research_id, employee_id) остаётся строка с минимальным id.
 * Нужно перед unique-индексом на эту пару.
 * Строки с NULL в research_id или employee_id не трогаем.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DELETE re_dup
      FROM researchemployees AS re_dup
      INNER JOIN researchemployees AS re_keep
        ON re_keep.research_id = re_dup.research_id
       AND re_keep.employee_id = re_dup.employee_id
       AND re_keep.id < re_dup.id
      WHERE re_dup.research_id IS NOT NULL
        AND re_dup.employee_id IS NOT NULL
    `);
  },

  async down() {
    // Удалённые дубли восстановить нельзя — down намеренно пустой.
  },
};
