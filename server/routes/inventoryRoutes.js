const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController'); // Путь к вашему контроллеру

// Создание новой записи инвентаря
router.post('/', inventoryController.createInventoryItem);

// Получение всех записей инвентаря
router.get('/', inventoryController.getAllInventoryItems);

router.get('/locations/:entityType/:entityId', inventoryController.getLocationsForEntity);
// Получение инвентаря по reference_id и item_type
router.get('/filter', inventoryController.getInventoriesByReferenceAndType);

// Получение записи инвентаря по ID
router.get('/:id', inventoryController.getInventoryItemById);

// router.get('/inventories', inventoryController.getInventoriesByStorageUnitId);

// Обновление записи инвентаря по ID
router.put('/:id', inventoryController.updateInventoryItem);

// Удаление записи инвентаря по ID
router.delete('/:id', inventoryController.deleteInventoryItem);

router.get('/chemicals/count', inventoryController.getChemicalCount);

router.get('/equipment/count', inventoryController.getEquipmentCount);


module.exports = router;
