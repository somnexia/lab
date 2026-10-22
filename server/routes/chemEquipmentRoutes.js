const express = require('express');
const router = express.Router();
const chemEquipmentController = require('../controllers/chemEquipmentController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_VIEW_EQUIPMENT,
  CAN_MANAGE_EQUIPMENT,
} = require('../config/roles');

/**
 * Фаза 6a: authorize на equipment.
 * Справочник оборудования глобальный (без laboratory_id) — режем только по роли.
 * Mutating = system_admin | lab_admin; чтение = все аутентифицированные.
 */
router.post('/', authorize(CAN_MANAGE_EQUIPMENT), chemEquipmentController.createChemEquipment);

router.get('/', authorize(CAN_VIEW_EQUIPMENT), chemEquipmentController.getAllChemEquipments);
router.get(
  '/equipments',
  authorize(CAN_VIEW_EQUIPMENT),
  chemEquipmentController.getChemEquipmentByCategory
);
router.get(
  '/groups',
  authorize(CAN_VIEW_EQUIPMENT),
  chemEquipmentController.getGroupsByCategory
);

router.get(
  '/:id/locations',
  authorize(CAN_VIEW_EQUIPMENT),
  chemEquipmentController.getLocationsForEquipment
);
router.get('/:id', authorize(CAN_VIEW_EQUIPMENT), chemEquipmentController.getChemEquipmentById);

router.put('/:id', authorize(CAN_MANAGE_EQUIPMENT), chemEquipmentController.updateChemEquipment);
router.delete('/:id', authorize(CAN_MANAGE_EQUIPMENT), chemEquipmentController.deleteChemEquipment);

module.exports = router;
