const express = require('express');
const router = express.Router();
const laboratoryController = require('../controllers/laboratoryController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_CREATE_LABORATORIES,
  CAN_DELETE_LABORATORIES,
  CAN_MANAGE_LABORATORIES,
  CAN_VIEW_LABORATORIES,
} = require('../config/roles');

/**
 * Фаза 5a: роль (authorize) + tenant в сервисе (scopeByLab / assertLabAccess).
 * Глобальный authenticate уже отработал в protectApiRoutes.
 */

// C — только system_admin
router.post('/', authorize(CAN_CREATE_LABORATORIES), laboratoryController.createLaboratory);

// R — все роли; список режется по lab в сервисе
router.get('/', authorize(CAN_VIEW_LABORATORIES), laboratoryController.getAllLaboratories);
router.get('/:id', authorize(CAN_VIEW_LABORATORIES), laboratoryController.getLaboratoryById);

// U — system_admin + lab_admin (свою проверит assertLabAccess)
router.put('/:id', authorize(CAN_MANAGE_LABORATORIES), laboratoryController.updateLaboratory);

// D — только system_admin
router.delete('/:id', authorize(CAN_DELETE_LABORATORIES), laboratoryController.deleteLaboratory);

module.exports = router;
