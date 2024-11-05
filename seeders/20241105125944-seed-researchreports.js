'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('researchreports', [
      {
        id: 21,
        research_id: 1,
        summary: 'Отчет по исследованию химической устойчивости компаундов.',
        total_experiments: 5,
        aggregate_results: JSON.stringify([
          { experiment: 'Опыт 1', result: 'Устойчивость до 90%' },
          { experiment: 'Опыт 2', result: 'Устойчивость до 75%' }
        ]),
        conclusions: 'Композиты показали отличные результаты устойчивости при разных условиях.',
        recommendations: 'Рекомендации: Использовать в условиях повышенной влажности с ограниченным воздействием солнечного света.',
        publication_ready: 0,
        createdAt: new Date('2024-11-03 14:52:25'),
        updatedAt: new Date('2024-11-03 14:52:25'),
        status: 'Under Review',
        aggregate_expenses: JSON.stringify([
          { item: 'Соляная кислота', quantity: 500, unit: 'мл' },
          { item: 'Хлорид натрия', quantity: 300, unit: 'г' }
        ])
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('researchreports', null, {});
  }
};
