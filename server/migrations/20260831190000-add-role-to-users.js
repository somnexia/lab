'use strict';

/**
 * Фаза 1: колонка users.role — ENUM из 4 ролей LIMS.
 *
 * laboratory_id на users НЕ добавляем: tenant резолвится при логине
 * из employees.lab_id (см. docs/README.md, вариант B).
 *
 * После up существующие строки получают default 'student'.
 * Демо-аккаунты с разными ролями — сидер seed-role-demo-users.
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM(
        'system_admin',
        'lab_admin',
        'researcher',
        'student'
      ),
      allowNull: false,
      defaultValue: 'student',
      comment: 'LIMS role: system_admin | lab_admin | researcher | student',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'role');
    // MySQL: удалить тип ENUM, если sequelize создал именованный
    try {
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS `enum_users_role`;'
      );
    } catch (_) {
      // MySQL обычно хранит ENUM inline в колонке — игнор
    }
  },
};
