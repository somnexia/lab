'use strict';

/**
 * Part 1: researches.laboratory_id — «владеющая» лаборатория проекта.
 *
 * Раньше lab выводили только через researchemployees → employees.lab_id.
 * Колонка nullable: существующие строки без участников могут остаться null
 * до backfill / до части 2 (create всегда пишет lab актора).
 *
 * Backfill: первая lab участника (MIN(lab_id) среди employees команды).
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('researches', 'laboratory_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: 'laboratories',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      comment: 'Owning laboratory for tenant scope (not membership)',
    });

    // MySQL: подставить lab из участников (если есть)
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

  async down(queryInterface) {
    await queryInterface.removeColumn('researches', 'laboratory_id');
  },
};
