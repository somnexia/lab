const cartService = require('../services/cartService');
const logService = require('../services/logService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackMessage, fallbackStatus = 500) {
  if (isScopeForbidden(error) || error.code === 'FORBIDDEN') {
    return res.status(403).json({
      message: error.message,
      code: error.code || 'FORBIDDEN',
    });
  }
  console.error(fallbackMessage, error);
  return res.status(fallbackStatus).json({ message: fallbackMessage });
}

// Создание нового элемента в корзине
const createCartItem = async (req, res) => {
  try {
    console.log('Полученные данные для создания элемента:', req.body);
    const data = req.body;
    const cartItem = await cartService.createCartItem(data);
    await logService.safeRecordAuditLog({
      action: logService.LOG_ACTIONS.CART_ITEM_ADDED,
      userId: data.user_id != null ? Number(data.user_id) : null,
      resourceType: 'Cart',
      resourceId: cartItem.id,
      description: { item_id: data.item_id, quantity: cartItem.quantity },
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta({}, req),
    });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('Ошибка при создании элемента в корзине:', error);
    res.status(500).json({ message: 'Ошибка при создании элемента в корзине' });
  }
};

// Получение всех элементов корзины для пользователя (только свои)
const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await cartService.getAllCartItems(req.user, req.params.user_id);
    res.status(200).json(cartItems);
  } catch (error) {
    return sendError(res, error, 'Ошибка при получении элементов корзины');
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

// Очистка корзины для пользователя (только свои)
const clearCart = async (req, res) => {
  try {
    const result = await cartService.clearCart(req.user, req.params.user_id);
    res.status(200).json(result);
  } catch (error) {
    return sendError(res, error, 'Ошибка при очистке корзины');
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
