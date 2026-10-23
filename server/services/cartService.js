const { Cart, Inventory, User } = require('../models');
const {
  resolveOwnCartUserId,
  prepareCartCreatePayload,
} = require('../utils/cartScope');

/**
 * Добавить позицию в корзину.
 * user_id берётся из req.user (prepareCartCreatePayload), не из доверия к body.
 */
const createCartItem = async (data, user) => {
  try {
    const payload = prepareCartCreatePayload(user, data);
    const { user_id, item_id, quantity } = payload;

    let cartItem = await Cart.findOne({
      where: { user_id, item_id },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await Cart.create(payload);
    }

    return cartItem;
  } catch (error) {
    console.error('Ошибка при добавлении элемента в корзину:', error);
    throw error;
  }
};

/**
 * Список позиций корзины.
 * user — req.user; requestedUserId — params.user_id (должен совпасть с актором).
 */
const getAllCartItems = async (user, requestedUserId) => {
  try {
    const user_id = resolveOwnCartUserId(user, requestedUserId);
    return await Cart.findAll({
      where: { user_id },
    });
  } catch (error) {
    console.error('Ошибка при получении элементов корзины пользователя:', error);
    throw error;
  }
};

// Получение элемента корзины по ID
const getCartItemById = async (id) => {
  try {
    const cartItem = await Cart.findByPk(id, {
      include: [
        { association: 'inventory' },
        { association: 'user' },
      ],
    });
    if (!cartItem) {
      throw new Error(`Элемент корзины с id ${id} не найден`);
    }
    return cartItem;
  } catch (error) {
    console.error('Ошибка при получении элемента корзины по id:', error);
    throw error;
  }
};

// Обновление элемента корзины по ID
const updateCartItem = async (id, data) => {
  try {
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      throw new Error(`Элемент корзины с id ${id} не найден`);
    }
    await cartItem.update(data);
    return cartItem;
  } catch (error) {
    console.error('Ошибка при обновлении элемента корзины:', error);
    throw error;
  }
};

// Удаление элемента корзины по ID
const deleteCartItem = async (id) => {
  try {
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      throw new Error(`Элемент корзины с id ${id} не найден`);
    }
    await cartItem.destroy();
    return { message: `Элемент корзины с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении элемента корзины:', error);
    throw error;
  }
};

/** Очистка только своей корзины (см. resolveOwnCartUserId). */
const clearCart = async (user, requestedUserId) => {
  try {
    const user_id = resolveOwnCartUserId(user, requestedUserId);
    await Cart.destroy({
      where: { user_id },
    });
    return { message: 'Корзина очищена успешно' };
  } catch (error) {
    console.error('Ошибка при очистке корзины:', error);
    throw error;
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
