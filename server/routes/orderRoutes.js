const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authorize } = require('../middleware/authMiddleware');
const {
  CAN_USE_CART,
  CAN_ACCESS_ADMIN_UI,
} = require('../config/roles');

/**
 * Фаза 6b: заказы.
 * Создать/читать «свои» — CAN_USE_CART; список всех / delete — admin UI
 * (lab_admin видит заказы своей lab — фильтр в сервисе позже).
 */
router.post('/', authorize(CAN_USE_CART), orderController.createOrder);
router.get('/', authorize(CAN_ACCESS_ADMIN_UI), orderController.getAllOrders);

router.get('/active/count', authorize(CAN_ACCESS_ADMIN_UI), orderController.getActiveOrderCount);

router.get('/:id', authorize(CAN_USE_CART), orderController.getOrderById);
router.put('/:id', authorize(CAN_USE_CART), orderController.updateOrder);
router.delete('/:id', authorize(CAN_ACCESS_ADMIN_UI), orderController.deleteOrder);

module.exports = router;
