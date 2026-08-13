'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      UPDATE experiments
      SET research_id = (
        SELECT id FROM researches ORDER BY id ASC LIMIT 1
      )
      WHERE research_id IS NULL
        AND EXISTS (SELECT 1 FROM researches LIMIT 1)
    `);

    await queryInterface.sequelize.query(`
      DELETE FROM experiment_inputs
      WHERE experiment_id IN (SELECT id FROM experiments WHERE research_id IS NULL)
    `);
    await queryInterface.sequelize.query(`
      DELETE FROM experiment_outputs
      WHERE experiment_id IN (SELECT id FROM experiments WHERE research_id IS NULL)
    `);
    await queryInterface.sequelize.query(`
      DELETE FROM experiments WHERE research_id IS NULL
    `);

    await queryInterface.changeColumn('experiments', 'research_id', {
      type: require('sequelize').INTEGER,
      allowNull: false,
      references: { model: 'researches', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('experiments', 'research_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: 'researches', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },
};
