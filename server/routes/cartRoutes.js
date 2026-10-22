const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_USE_CART } = require('../config/roles');

/**
 * Фаза 6b: корзина — роль не режет (все CAN_USE_CART = ALL_ROLES).
 * «Только свои» по user_id — в сервисе (фаза 8); authorize фиксирует контракт.
 */
router.post('/', authorize(CAN_USE_CART), cartController.createCartItem);
router.get('/:user_id', authorize(CAN_USE_CART), cartController.getAllCartItems);
router.get('/item/:id', authorize(CAN_USE_CART), cartController.getCartItemById);
router.put('/item/:id', authorize(CAN_USE_CART), cartController.updateCartItem);
router.delete('/item/:id', authorize(CAN_USE_CART), cartController.deleteCartItem);
router.delete('/clear/:user_id', authorize(CAN_USE_CART), cartController.clearCart);

module.exports = router;
