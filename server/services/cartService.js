const { Cart, Inventory, User } = require('../models');
const {
  resolveOwnCartUserId,
  prepareCartCreatePayload,
  assertOwnsCartItem,
  sanitizeCartItemUpdatePayload,
} = require('../utils/cartScope');

function notFound(message) {
  const err = new Error(message);
  err.code = 'NOT_FOUND';
  err.status = 404;
  return err;
}

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

/**
 * Одна позиция по Cart.id — только если cartItem.user_id === req.user.id.
 */
const getCartItemById = async (id, user) => {
  try {
    const cartItem = await Cart.findByPk(id, {
      include: [
        { association: 'inventory' },
        { association: 'user' },
      ],
    });
    if (!cartItem) {
      throw notFound(`Элемент корзины с id ${id} не найден`);
    }
    assertOwnsCartItem(user, cartItem);
    return cartItem;
  } catch (error) {
    console.error('Ошибка при получении элемента корзины по id:', error);
    throw error;
  }
};

/**
 * Обновить количество и т.п. чужой строки нельзя;
 * body.user_id игнорируется (sanitize).
 */
const updateCartItem = async (id, data, user) => {
  try {
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      throw notFound(`Элемент корзины с id ${id} не найден`);
    }
    assertOwnsCartItem(user, cartItem);
    const payload = sanitizeCartItemUpdatePayload(data);
    await cartItem.update(payload);
    return cartItem;
  } catch (error) {
    console.error('Ошибка при обновлении элемента корзины:', error);
    throw error;
  }
};

/** Удалить позицию — только владелец строки. */
const deleteCartItem = async (id, user) => {
  try {
    const cartItem = await Cart.findByPk(id);
    if (!cartItem) {
      throw notFound(`Элемент корзины с id ${id} не найден`);
    }
    assertOwnsCartItem(user, cartItem);
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
