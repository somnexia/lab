'use strict';

/**
 * researches.laboratory_id становится обязательным.
 * Перед этим не должно остаться NULL (см. backfill-миграцию
 * и ручное назначение оставшимся строкам).
 *
 * ON DELETE RESTRICT: нельзя удалить лабораторию, пока на неё
 * ссылаются исследования (вместо прежнего SET NULL).
 */

const TABLE = 'researches';
const FK_NAME = 'researches_laboratory_id_fkey';

async function dropLaboratoryIdForeignKeys(queryInterface) {
  const [rows] = await queryInterface.sequelize.query(
    `
      SELECT CONSTRAINT_NAME AS name
      FROM information_schema.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
        AND COLUMN_NAME = 'laboratory_id'
        AND REFERENCED_TABLE_NAME IS NOT NULL
    `,
    { replacements: { tableName: TABLE } }
  );
  const names = [...new Set(rows.map((r) => r.name).filter(Boolean))];
  for (const name of names) {
    await queryInterface.removeConstraint(TABLE, name);
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ещё раз подтянуть lab из команды, если остались дырки
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

    const [rows] = await queryInterface.sequelize.query(`
      SELECT id FROM researches WHERE laboratory_id IS NULL
    `);
    if (rows.length > 0) {
      const ids = rows.map((r) => r.id).join(', ');
      throw new Error(
        `Нельзя сделать laboratory_id NOT NULL: ещё есть researches без lab (id: ${ids}). ` +
          'Назначьте laboratory_id вручную и повторите migrate.'
      );
    }

    await dropLaboratoryIdForeignKeys(queryInterface);

    await queryInterface.changeColumn(TABLE, 'laboratory_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addConstraint(TABLE, {
      fields: ['laboratory_id'],
      type: 'foreign key',
      name: FK_NAME,
      references: { table: 'laboratories', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface, Sequelize) {
    await dropLaboratoryIdForeignKeys(queryInterface);

    await queryInterface.changeColumn(TABLE, 'laboratory_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint(TABLE, {
      fields: ['laboratory_id'],
      type: 'foreign key',
      name: FK_NAME,
      references: { table: 'laboratories', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
