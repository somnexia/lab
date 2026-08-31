'use strict';

const bcrypt = require('bcrypt');
const { ROLES } = require('../config/roles');

/**
 * Фаза 1: демо-учётки по одной на каждую роль.
 *
 * Пароль у всех: Password123!
 *
 * Привязка tenant (через employees.lab_id из seed-employees):
 *   system_admin  — без employee (laboratory_id в JWT будет null)
 *   lab_admin     — employee_id 5, lab_id 1
 *   researcher    — employee_id 1, lab_id 1
 *   student       — employee_id 4, lab_id 4
 *
 * Запуск (после migrate):
 *   npx sequelize-cli db:seed --seed 20260831190500-seed-role-demo-users.js
 *
 * Идемпотентность: удаляет строки с этими email и вставляет заново.
 */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash('Password123!', 10);
    const now = new Date();

    const demos = [
      {
        name: 'System Admin',
        email: 'system.admin@lab.local',
        password: passwordHash,
        role: ROLES.SYSTEM_ADMIN,
        employee_id: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Lab Admin',
        email: 'lab.admin@lab.local',
        password: passwordHash,
        role: ROLES.LAB_ADMIN,
        employee_id: 5,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Demo Researcher',
        email: 'researcher@lab.local',
        password: passwordHash,
        role: ROLES.RESEARCHER,
        employee_id: 1,
        createdAt: now,
        updatedAt: now,
      },
      {
        name: 'Demo Student',
        email: 'student@lab.local',
        password: passwordHash,
        role: ROLES.STUDENT,
        employee_id: 4,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const emails = demos.map((u) => u.email);
    await queryInterface.bulkDelete('users', { email: emails }, {});
    await queryInterface.bulkInsert('users', demos);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      {
        email: [
          'system.admin@lab.local',
          'lab.admin@lab.local',
          'researcher@lab.local',
          'student@lab.local',
        ],
      },
      {}
    );
  },
};
