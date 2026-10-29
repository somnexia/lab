'use strict';

/**
 * Убирает дубли users.employee_id: один employee не должен быть
 * привязан к нескольким учёткам. Для каждого ненулевого employee_id
 * оставляем пользователя с минимальным id, у остальных employee_id = NULL
 * (учётки не удаляем).
 *
 * Нужно перед unique-индексом на users.employee_id.
 * Несколько NULL допустимы и после unique (учётка без сотрудника).
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // Битые ссылки → NULL (employee уже нет)
    await queryInterface.sequelize.query(`
      UPDATE users AS u
      LEFT JOIN employees AS e ON e.id = u.employee_id
      SET u.employee_id = NULL
      WHERE u.employee_id IS NOT NULL
        AND e.id IS NULL
    `);

    // Дубли: оставить MIN(id), остальным обнулить связь
    await queryInterface.sequelize.query(`
      UPDATE users AS u_dup
      INNER JOIN users AS u_keep
        ON u_keep.employee_id = u_dup.employee_id
       AND u_keep.id < u_dup.id
      SET u_dup.employee_id = NULL
      WHERE u_dup.employee_id IS NOT NULL
    `);
  },

  async down() {
    // Обнулённые связи восстановить нельзя — down намеренно пустой.
  },
};
