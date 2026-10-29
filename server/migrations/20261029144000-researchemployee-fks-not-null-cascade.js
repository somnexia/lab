'use strict';

/**
 * research_id и employee_id обязательны; при удалении research
 * или employee связанные memberships удаляются (CASCADE).
 * Перед прогоном пустые/битые строки должны быть удалены.
 */

const TABLE = 'researchemployees';

async function listForeignKeyNames(queryInterface, tableName) {
  const [rows] = await queryInterface.sequelize.query(
    `
      SELECT CONSTRAINT_NAME AS name
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = :tableName
        AND CONSTRAINT_TYPE = 'FOREIGN KEY'
    `,
    { replacements: { tableName } }
  );
  return rows.map((row) => row.name).filter(Boolean);
}

async function dropAllForeignKeys(queryInterface, tableName) {
  const names = await listForeignKeyNames(queryInterface, tableName);
  for (const name of names) {
    await queryInterface.removeConstraint(tableName, name);
  }
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await dropAllForeignKeys(queryInterface, TABLE);

    await queryInterface.changeColumn(TABLE, 'research_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn(TABLE, 'employee_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.addConstraint(TABLE, {
      fields: ['research_id'],
      type: 'foreign key',
      name: 'researchemployees_research_id_fkey',
      references: { table: 'researches', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint(TABLE, {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'researchemployees_employee_id_fkey',
      references: { table: 'employees', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await dropAllForeignKeys(queryInterface, TABLE);

    await queryInterface.changeColumn(TABLE, 'research_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.changeColumn(TABLE, 'employee_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addConstraint(TABLE, {
      fields: ['research_id'],
      type: 'foreign key',
      name: 'researchemployees_research_id_fkey',
      references: { table: 'researches', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });

    await queryInterface.addConstraint(TABLE, {
      fields: ['employee_id'],
      type: 'foreign key',
      name: 'researchemployees_employee_id_fkey',
      references: { table: 'employees', field: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
