'use strict';

const bcrypt = require('bcrypt');
const { ROLES } = require('../config/roles');

/**
 * Базовый сидер users (обновлён в фазе 1: колонка role).
 * Для чистой установки после migrate. Демо-роли — см. seed-role-demo-users.
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password1 = await bcrypt.hash('1234', 10);
    const password2 = await bcrypt.hash('1234', 10);
    await queryInterface.bulkInsert('users', [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: password1,
        role: ROLES.STUDENT,
        employee_id: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: password2,
        role: ROLES.RESEARCHER,
        employee_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'ggg',
        email: 'georgiigiblov@gmail.com',
        password: '$2b$10$lBXn0WnFRo8neGX00e4Y1.B/VmkYzX0AH2ldnwW3OKP6tlUlBezGi',
        role: ROLES.LAB_ADMIN,
        employee_id: 2,
        createdAt: new Date('2025-03-17T12:38:45'),
        updatedAt: new Date('2025-03-17T13:04:06'),
      },
      {
        id: 4,
        name: 'fff',
        email: 'giblov@gmail.com',
        password: '$2b$10$yWtEJ2xVW.kQS2fGQEYVnedgAniNAeWVSwcx/NT1pbT7PiEa8JQYi',
        role: ROLES.STUDENT,
        employee_id: 3,
        createdAt: new Date('2025-03-17T12:41:20'),
        updatedAt: new Date('2025-03-17T13:06:28'),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { id: [1, 2, 3, 4] }, {});
  },
};
