// routes/storageUnitRoutes.js
const express = require('express');
const router = express.Router();
const StorageUnitController = require('../controllers/storageUnitController');


router.post('/', StorageUnitController.createStorageUnit);

// Получение всех исследований
router.get('/', StorageUnitController.getAllStorageUnits);

// Получение исследования по ID
router.get('/:id', StorageUnitController.getStorageUnitById);

// Обновление исследования по ID
router.put('/:id', StorageUnitController.updateStorageUnit);

// Удаление исследования по ID
router.delete('/:id', StorageUnitController.deleteStorageUnit);

module.exports = router;
