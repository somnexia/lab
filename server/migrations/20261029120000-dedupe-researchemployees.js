'use strict';

/**
 * Задача C, часть 1 — очистка дублей в researchemployees.
 *
 * Без UNIQUE один и тот же employee мог попасть в один research несколько раз
 * (повторный POST /researchEmployees или addParticipants).
 * Часть 2 добавит UNIQUE (research_id, employee_id) — индекс не встанет,
 * пока дубли живы. Здесь оставляем одну строку на пару (минимальный id).
 *
 * Пары с NULL research_id / employee_id не трогаем (их чинит задача B).
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // MySQL: удалить строку, если есть «близнец» с меньшим id
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
