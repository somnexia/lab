'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('chemequipments', [
      { id: 1, unique_id: 'EQ0001', name: 'Beaker', description: 'Glass beaker for storage and transfer of liquid samples.', manufacturer: 'Glassware Co.', model: 'B-100', material: 'Glass' },
      { id: 2, unique_id: 'EQ0002', name: 'Distillation Flask', description: 'Glass flask for conducting the distillation process.', manufacturer: 'GlassTech', model: 'DistilLab-500', material: 'Glass' },
      { id: 3, unique_id: 'EQ0003', name: 'Chemical Funnel', description: 'Glass funnel for separating liquid phases and filtering solutions.', manufacturer: 'LabSupplies Ltd.', model: 'FunnelTech-200', material: 'Glass' },
      { id: 4, unique_id: 'EQ0004', name: 'Flat-Bottom Flask', description: 'Glass flask with a flat bottom for conducting various chemical reactions.', manufacturer: 'GlassTech', model: 'FlatFlask-100', material: 'Glass' },
      { id: 5, unique_id: 'EQ0005', name: 'Magnetic Stirrer', description: 'Laboratory device used to create a rotating magnetic field for stirring liquids.', manufacturer: 'LabTech Inc.', model: 'MagStir-3000', material: 'Metal' },
      { id: 6, unique_id: 'EQ0006', name: 'Burette', description: 'Glass tube with a valve at the bottom, used for precise dispensing of liquids.', manufacturer: 'Glassware Co.', model: 'Burette-200', material: 'Glass' },
      { id: 7, unique_id: 'EQ0007', name: 'Desiccator', description: 'Airtight container used to store substances in a dry environment.', manufacturer: 'DryTech Solutions', model: 'DesiDry-400', material: 'Plastic' },
      { id: 8, unique_id: 'EQ0008', name: 'Heating Mantle', description: 'Electrically heated device used to heat round-bottom flasks during chemical reactions.', manufacturer: 'HeaterTech Ltd.', model: 'HeatMantle-500', material: 'Metal' },
      { id: 9, unique_id: 'EQ0009', name: 'Chemical Reactor', description: 'Professional chemical reactor for conducting various chemical reactions.', manufacturer: 'ABC Chemicals', model: 'RX-1000', material: 'Glass' },
      { id: 10, unique_id: 'EQ0010', name: 'Gas Scrubber', description: 'Device for removing gases and vapors from chemical reactors.', manufacturer: 'XYZ Lab Equipment', model: 'GH-500', material: 'Stainless Steel' },
      { id: 11, unique_id: 'EQ0011', name: 'Chromatograph', description: 'Highly efficient chromatograph for analyzing components of mixtures.', manufacturer: 'LabTech Inc.', model: 'ChroMate-2000', material: 'Metal' },
      { id: 12, unique_id: 'EQ0012', name: 'Spectrophotometer', description: 'Device for measuring the optical density of solutions in various spectral regions.', manufacturer: 'Sigma Analytical', model: 'SpecTec-300', material: 'Plastic' },
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('chemequipments', null, {});
  }
};
