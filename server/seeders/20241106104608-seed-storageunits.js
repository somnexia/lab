'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('storageunits', [
      {
        id:1,
        storage_id: 1,
        parent_id: null,
        unit_type: 'refrigerator',
        unit_name: 'Main Refrigerator',
        capacity: 100.00,
        current_utilization: 50.00,
        temperature: 4.00,
        humidity: 60.00,
        pressure: null,
        material: 'Stainless Steel',
        is_locked: true,
        safety_rating: 'A',
        last_maintenance_date: '2024-01-01',
        next_maintenance_date: '2024-07-01',
        alarm_threshold: 2.00,
        location_description: 'North wing of the lab',
        expiration_date_check: true,
        description: 'Used for storing temperature-sensitive chemicals'
      },
      {
        id:2,
        storage_id: null,
        parent_id: 1,
        unit_type: 'shelf',
        unit_name: 'Top Shelf',
        capacity: 20.00,
        current_utilization: 5.00,
        temperature: 4.00,
        humidity: 60.00,
        pressure: null,
        material: 'Plastic',
        is_locked: false,
        safety_rating: 'B',
        last_maintenance_date: '2024-02-01',
        next_maintenance_date: '2024-08-01',
        alarm_threshold: 1.00,
        location_description: 'Inside Main Refrigerator',
        expiration_date_check: false,
        description: 'Shelf designated for samples'
      },
      {
        id:3,
        storage_id: 1,
        parent_id: null,
        unit_type: 'cabinet',
        unit_name: 'Chemical Storage Cabinet',
        capacity: 500.00,
        current_utilization: 200.00,
        temperature: null,
        humidity: null,
        pressure: null,
        material: 'Metal',
        is_locked: true,
        safety_rating: 'A+',
        last_maintenance_date: '2024-01-15',
        next_maintenance_date: '2024-07-15',
        alarm_threshold: null,
        location_description: 'East side of the lab',
        expiration_date_check: true,
        description: 'Secure cabinet for hazardous chemicals'
      },
      {
        id:4,
        storage_id: null,
        parent_id: 3,
        unit_type: 'drawer',
        unit_name: 'Hazardous Material Drawer',
        capacity: 50.00,
        current_utilization: 10.00,
        temperature: null,
        humidity: null,
        pressure: null,
        material: 'Metal',
        is_locked: true,
        safety_rating: 'A',
        last_maintenance_date: '2024-03-01',
        next_maintenance_date: '2024-09-01',
        alarm_threshold: null,
        location_description: 'Inside Chemical Storage Cabinet',
        expiration_date_check: true,
        description: 'Drawer for hazardous substances requiring special handling'
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('storageunits', null, {});
  }
};
