const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// Создание нового элемента в корзине
router.post('/', cartController.createCartItem);

// Получение всех элементов корзины для пользователя
router.get('/:user_id', cartController.getAllCartItems);

// Получение элемента корзины по ID
router.get('/item/:id', cartController.getCartItemById);

// Обновление элемента корзины по ID
router.put('/item/:id', cartController.updateCartItem);

// Удаление элемента корзины по ID
router.delete('/item/:id', cartController.deleteCartItem);

// Очистка корзины для пользователя
router.delete('/clear/:user_id', cartController.clearCart);

module.exports = router;
