const express = require('express');
const router = express.Router();
const laboratoryController = require('../controllers/laboratoryController'); // Путь к вашему контроллеру

// Создание новой лаборатории
router.post('/', laboratoryController.createLaboratory);

// Получение всех лабораторий
router.get('/', laboratoryController.getAllLaboratories);

// Получение лаборатории по уникальному идентификатору
router.get('/:id', laboratoryController.getLaboratoryById);

// Обновление данных лаборатории по уникальному идентификатору
router.put('/:id', laboratoryController.updateLaboratory);

// Удаление лаборатории по уникальному идентификатору
router.delete('/:id', laboratoryController.deleteLaboratory);

module.exports = router;
