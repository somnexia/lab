'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orders', [
      {
        id: 1,
        order_number: 'ORD001',
        research_id: 1,
        order_date: '2024-05-01 00:00:00',
        comment: 'Order for experiment A',
        employee_id: 2,
        last_updated: '2024-06-03 16:11:55',
        status: 'active'
      },
      {
        id: 2,
        order_number: 'ORD002',
        research_id: 3,
        order_date: '2024-05-15 00:00:00',
        comment: 'Preparation for research B',
        employee_id: 3,
        last_updated: '2024-06-03 16:53:20',
        status: 'active'
      },
      {
        id: 3,
        order_number: 'ORD003',
        research_id: 2,
        order_date: '2024-05-20 00:00:00',
        comment: 'Order for experiment C',
        employee_id: 1,
        last_updated: '2024-06-03 16:13:51',
        status: 'completed'
      },
      {
        id: 4,
        order_number: 'ORD004',
        research_id: 4,
        order_date: '2024-05-25 00:00:00',
        comment: 'Current project D',
        employee_id: 4,
        last_updated: '2024-06-03 16:12:08',
        status: 'active'
      },
      {
        id: 5,
        order_number: 'ORD005',
        research_id: 1,
        order_date: '2024-05-30 00:00:00',
        comment: 'Upcoming experiment E',
        employee_id: 2,
        last_updated: '2024-06-03 16:12:12',
        status: 'active'
      },
      {
        id: 6,
        order_number: 'ORD006',
        research_id: 1,
        order_date: '2024-06-05 00:00:00',
        comment: 'Order for experiment A',
        employee_id: 2,
        last_updated: '2024-06-03 16:48:05',
        status: 'completed'
      },
      {
        id: 7,
        order_number: 'ORD007',
        research_id: 2,
        order_date: '2024-06-10 00:00:00',
        comment: 'Order for research B',
        employee_id: 3,
        last_updated: '2024-06-03 16:12:20',
        status: 'active'
      },
      {
        id: 8,
        order_number: 'ORD008',
        research_id: 3,
        order_date: '2024-06-15 00:00:00',
        comment: 'Current project C',
        employee_id: 4,
        last_updated: '2024-06-15 14:00:00',
        status: 'active'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orders', null, {});
  }
};
