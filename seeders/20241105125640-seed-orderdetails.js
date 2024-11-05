'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('orderdetails', [
      {
        id: 1,
        inventory_id: 1,
        unique_id: 'EQ0001',
        reserved_quantity: 5,
        reservation_date: '2024-05-01 00:00:00',
        return_date: null,
        status: 'reserved',
        last_updated: '2024-06-03 13:12:44',
        order_number: 'ORD001'
      },
      {
        id: 2,
        inventory_id: 2,
        unique_id: 'EQ0002',
        reserved_quantity: 10,
        reservation_date: '2024-05-15 00:00:00',
        return_date: null,
        status: 'returned',
        last_updated: '2024-06-03 13:40:45',
        order_number: 'ORD002'
      },
      {
        id: 3,
        inventory_id: 3,
        unique_id: 'EQ0003',
        reserved_quantity: 7,
        reservation_date: '2024-05-20 00:00:00',
        return_date: '2024-06-03 16:13:51',
        status: 'returned',
        last_updated: '2024-06-03 13:13:51',
        order_number: 'ORD003'
      },
      {
        id: 4,
        inventory_id: 4,
        unique_id: 'EQ0004',
        reserved_quantity: 3,
        reservation_date: '2024-05-25 00:00:00',
        return_date: '2024-06-03 00:00:00',
        status: 'returned',
        last_updated: '2024-06-03 11:56:44',
        order_number: 'ORD004'
      },
      {
        id: 5,
        inventory_id: 5,
        unique_id: 'EQ0005',
        reserved_quantity: 12,
        reservation_date: '2024-05-30 00:00:00',
        return_date: '2024-06-03 16:11:31',
        status: 'returned',
        last_updated: '2024-06-03 13:11:31',
        order_number: 'ORD005'
      },
      {
        id: 6,
        inventory_id: 13,
        unique_id: 'E0005',
        reserved_quantity: 1,
        reservation_date: '2024-06-05 00:00:00',
        return_date: '2024-06-10 00:00:00',
        status: 'returned',
        last_updated: '2024-06-02 14:14:56',
        order_number: 'ORD006'
      },
      {
        id: 7,
        inventory_id: 14,
        unique_id: 'E0009',
        reserved_quantity: 2,
        reservation_date: '2024-06-10 00:00:00',
        return_date: '2024-06-20 00:00:00',
        status: 'returned',
        last_updated: '2024-06-02 14:14:56',
        order_number: 'ORD007'
      },
      {
        id: 8,
        inventory_id: 15,
        unique_id: 'E0020',
        reserved_quantity: 3,
        reservation_date: '2024-06-15 00:00:00',
        return_date: null,
        status: 'returned',
        last_updated: '2024-06-02 14:39:10',
        order_number: 'ORD008'
      },
      {
        id: 9,
        inventory_id: 16,
        unique_id: 'E0025',
        reserved_quantity: 1,
        reservation_date: '2024-06-20 00:00:00',
        return_date: '2024-06-03 15:01:29',
        status: 'returned',
        last_updated: '2024-06-03 12:01:29',
        order_number: 'ORD009'
      },
      {
        id: 10,
        inventory_id: 17,
        unique_id: 'E0001',
        reserved_quantity: 2,
        reservation_date: '2024-06-25 00:00:00',
        return_date: null,
        status: 'in use',
        last_updated: '2024-06-03 12:53:58',
        order_number: 'ORD010'
      },
      {
        id: 11,
        inventory_id: 18,
        unique_id: 'E0002',
        reserved_quantity: 1,
        reservation_date: '2024-06-30 00:00:00',
        return_date: null,
        status: 'reserved',
        last_updated: '2024-06-02 14:14:56',
        order_number: 'ORD011'
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('orderdetails', null, {});
  }
};
