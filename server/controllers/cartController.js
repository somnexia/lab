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
  if (error.code === 'NOT_FOUND' || /не найден/i.test(error.message || '')) {
    return res.status(404).json({
      message: error.message,
      code: 'NOT_FOUND',
    });
  }
  console.error(fallbackMessage, error);
  return res.status(fallbackStatus).json({ message: fallbackMessage });
}

// Создание нового элемента в корзине (user_id только из req.user)
const createCartItem = async (req, res) => {
  try {
    const cartItem = await cartService.createCartItem(req.body, req.user);
    await logService.safeRecordAuditLog({
      action: logService.LOG_ACTIONS.CART_ITEM_ADDED,
      userId: req.user?.id != null ? Number(req.user.id) : null,
      resourceType: 'Cart',
      resourceId: cartItem.id,
      description: { item_id: cartItem.item_id, quantity: cartItem.quantity },
      status: logService.LOG_STATUS.SUCCESS,
      ...logService.mergeMeta({}, req),
    });
    return res.status(201).json(cartItem);
  } catch (error) {
    return sendError(res, error, 'Ошибка при создании элемента в корзине');
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

// Одна позиция по id строки — только владелец
const getCartItemById = async (req, res) => {
  try {
    const cartItem = await cartService.getCartItemById(req.params.id, req.user);
    return res.status(200).json(cartItem);
  } catch (error) {
    return sendError(res, error, 'Ошибка при получении элемента корзины');
  }
};

// Обновление позиции — только владелец; user_id в body отбрасывается
const updateCartItem = async (req, res) => {
  try {
    const updatedCartItem = await cartService.updateCartItem(
      req.params.id,
      req.body,
      req.user
    );
    return res.status(200).json(updatedCartItem);
  } catch (error) {
    return sendError(res, error, 'Ошибка при обновлении элемента корзины');
  }
};

// Удаление позиции — только владелец
const deleteCartItem = async (req, res) => {
  try {
    const result = await cartService.deleteCartItem(req.params.id, req.user);
    return res.status(200).json(result);
  } catch (error) {
    return sendError(res, error, 'Ошибка при удалении элемента корзины');
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
