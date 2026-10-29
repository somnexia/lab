'use strict';

/**
 * Unique на users.employee_id: один сотрудник — не больше одной учётки.
 * Несколько NULL допустимы (учётка без привязки к employee).
 * Перед применением дубли ненулевых employee_id должны быть сняты.
 */

const INDEX_NAME = 'users_employee_id_unique';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('users', ['employee_id'], {
      unique: true,
      name: INDEX_NAME,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', INDEX_NAME);
  },
};
