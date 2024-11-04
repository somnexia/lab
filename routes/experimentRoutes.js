const express = require('express');
const router = express.Router();
const experimentController = require('../controllers/experimentController'); // Путь к вашему контроллеру

// Создание нового эксперимента
router.post('/', experimentController.createExperiment);

// Получение всех экспериментов
router.get('/', experimentController.getAllExperiments);

// Получение эксперимента по ID
router.get('/:id', experimentController.getExperimentById);

// Обновление эксперимента по ID
router.put('/:id', experimentController.updateExperiment);

// Удаление эксперимента по ID
router.delete('/:id', experimentController.deleteExperiment);

module.exports = router;
