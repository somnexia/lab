const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController'); // Путь к вашему контроллеру

// Создание новой записи инвентаря
router.post('/', inventoryController.createInventoryItem);

// Получение всех записей инвентаря
router.get('/', inventoryController.getAllInventoryItems);

// Получение записи инвентаря по ID
router.get('/:id', inventoryController.getInventoryItemById);

// Обновление записи инвентаря по ID
router.put('/:id', inventoryController.updateInventoryItem);

// Удаление записи инвентаря по ID
router.delete('/:id', inventoryController.deleteInventoryItem);

module.exports = router;
