const cartService = require('../services/cartService');

// Создание нового элемента в корзине
const createCartItem = async (req, res) => {
  try {
    console.log('Полученные данные для создания элемента:', req.body);
    const data = req.body;
    const cartItem = await cartService.createCartItem(data);
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Ошибка при создании элемента в корзине:', error);
    res.status(500).json({ message: 'Ошибка при создании элемента в корзине' });
  }
};

// Получение всех элементов корзины для пользователя
const getAllCartItems = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const cartItems = await cartService.getAllCartItems(user_id);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Ошибка при получении элементов корзины пользователя:', error);
    res.status(500).json({ message: 'Ошибка при получении элементов корзины' });
  }
};

// Получение элемента корзины по ID
const getCartItemById = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const cartItem = await cartService.getCartItemById(cartItemId);
    res.status(200).json(cartItem);
  } catch (error) {
    console.error('Ошибка при получении элемента корзины по id:', error);
    res.status(500).json({ message: 'Ошибка при получении элемента корзины' });
  }
};

// Обновление элемента корзины по ID
const updateCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const data = req.body;
    const updatedCartItem = await cartService.updateCartItem(cartItemId, data);
    res.status(200).json(updatedCartItem);
  } catch (error) {
    console.error('Ошибка при обновлении элемента корзины:', error);
    res.status(500).json({ message: 'Ошибка при обновлении элемента корзины' });
  }
};

// Удаление элемента корзины по ID
const deleteCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const result = await cartService.deleteCartItem(cartItemId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при удалении элемента корзины:', error);
    res.status(500).json({ message: 'Ошибка при удалении элемента корзины' });
  }
};

// Очистка корзины для пользователя
const clearCart = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const result = await cartService.clearCart(user_id);
    res.status(200).json(result);
  } catch (error) {
    console.error('Ошибка при очистке корзины:', error);
    res.status(500).json({ message: 'Ошибка при очистке корзины' });
  }
};

module.exports = {
  createCartItem,
  getAllCartItems,
  getCartItemById,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
