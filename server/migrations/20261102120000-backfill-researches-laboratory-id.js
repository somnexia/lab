'use strict';

/**
 * Повторно заполняет researches.laboratory_id там, где ещё NULL.
 *
 * Правило: MIN(employees.lab_id) среди участников команды
 * (researchemployees → employees). Это эвристика для хвостов
 * миграции, не «голосование» за владеющую lab.
 *
 * Строки без участников или без lab у участников остаются NULL —
 * их нужно назначить вручную (admin) до NOT NULL и снятия orphan-fallback.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE researches AS r
      SET laboratory_id = (
        SELECT MIN(e.lab_id)
        FROM researchemployees AS re
        INNER JOIN employees AS e ON e.id = re.employee_id
        WHERE re.research_id = r.id
          AND e.lab_id IS NOT NULL
      )
      WHERE r.laboratory_id IS NULL
    `);
  },

  async down() {
    // Не откатываем: нельзя надёжно отличить «только что заполненные»
    // значения от тех, что стояли до миграции.
  },
};
