'use strict';

/**
 * Удаляет «пустые» и битые memberships в researchemployees:
 * - research_id IS NULL или employee_id IS NULL (после ON DELETE SET NULL
 *   строка остаётся, но уже ни к чему не привязана);
 * - research_id / employee_id ссылаются на несуществующую запись
 *   (на случай расхождений без FK).
 *
 * Нужно перед сменой колонок на NOT NULL и сменой ON DELETE.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      DELETE FROM researchemployees
      WHERE research_id IS NULL
         OR employee_id IS NULL
    `);

    await queryInterface.sequelize.query(`
      DELETE re
      FROM researchemployees AS re
      LEFT JOIN researches AS r ON r.id = re.research_id
      WHERE r.id IS NULL
    `);

    await queryInterface.sequelize.query(`
      DELETE re
      FROM researchemployees AS re
      LEFT JOIN employees AS e ON e.id = re.employee_id
      WHERE e.id IS NULL
    `);
  },

  async down() {
    // Удалённые строки восстановить нельзя — down намеренно пустой.
  },
};
