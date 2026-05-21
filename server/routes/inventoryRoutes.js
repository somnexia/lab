const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

router.post('/', inventoryController.createInventoryItem);

router.get('/locations/:entityType/:entityId', inventoryController.getLocationsForEntity);
router.get('/filter', inventoryController.getInventoriesByReferenceAndType);
router.get('/validate-catalog', inventoryController.validateCatalogReference);
router.get('/integrity/orphans', inventoryController.getOrphanInventoryLots);
router.get('/chemicals/count', inventoryController.getChemicalCount);
router.get('/equipment/count', inventoryController.getEquipmentCount);

router.get('/', inventoryController.getAllInventoryItems);

router.get('/:id', inventoryController.getInventoryItemById);
router.put('/:id', inventoryController.updateInventoryItem);
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
