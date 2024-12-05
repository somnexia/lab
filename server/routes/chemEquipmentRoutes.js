const express = require('express');
const router = express.Router();
const chemEquipmentController = require('../controllers/chemEquipmentController'); // Путь к вашему контроллеру

// Создание нового оборудования
router.post('/', chemEquipmentController.createChemEquipment);

// Получение всех единиц оборудования
router.get('/', chemEquipmentController.getAllChemEquipments);

router.get('/equipments', chemEquipmentController.getChemEquipmentByCategory);

router.get("/groups", chemEquipmentController.getGroupsByCategory);

// Получение оборудования по уникальному идентификатору
router.get('/:id', chemEquipmentController.getChemEquipmentById);

// Обновление информации об оборудовании по уникальному идентификатору
router.put('/:id', chemEquipmentController.updateChemEquipment);

// Удаление оборудования по уникальному идентификатору
router.delete('/:id', chemEquipmentController.deleteChemEquipment);


router.get('/equipments', chemEquipmentController.getChemEquipmentByCategoryAndGroup);

router.get('/:id/locations', chemEquipmentController.getLocationsForEquipment);


module.exports = router;
