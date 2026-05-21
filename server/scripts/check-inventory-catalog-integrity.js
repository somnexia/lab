/**
 * CLI: list inventory lots with invalid (item_type, reference_id) pairs.
 * Usage: node server/scripts/check-inventory-catalog-integrity.js
 */
require('dotenv').config();
const { findOrphanInventoryLots } = require('../services/inventoryService');

(async () => {
  try {
    const orphans = await findOrphanInventoryLots();
    if (!orphans.length) {
      console.log('OK: all inventory lots resolve to catalog entries.');
      process.exit(0);
    }
    console.log(`Found ${orphans.length} orphan lot(s):`);
    console.table(orphans);
    process.exit(1);
  } catch (error) {
    console.error('Integrity check failed:', error.message);
    process.exit(2);
  }
})();
