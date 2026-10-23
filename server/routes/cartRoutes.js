const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authorize } = require('../middleware/authMiddleware');
const { CAN_USE_CART } = require('../config/roles');

/**
 * Корзина: CAN_USE_CART = все роли.
 * Owner-scope (по частям):
 *   1) GET /:user_id и DELETE /clear/:user_id — только req.user.id ✓
 *   2) POST / — user_id из req.user (prepareCartCreatePayload) ✓
 *   3) GET|PUT|DELETE /item/:id — assertOwnsCartItem ✓
 *   4) Orders — отдельно
 */
router.post('/', authorize(CAN_USE_CART), cartController.createCartItem);
router.get('/:user_id', authorize(CAN_USE_CART), cartController.getAllCartItems);
router.get('/item/:id', authorize(CAN_USE_CART), cartController.getCartItemById);
router.put('/item/:id', authorize(CAN_USE_CART), cartController.updateCartItem);
router.delete('/item/:id', authorize(CAN_USE_CART), cartController.deleteCartItem);
router.delete('/clear/:user_id', authorize(CAN_USE_CART), cartController.clearCart);

module.exports = router;
