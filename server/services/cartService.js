const { Cart, Inventory, User } = require('../models');
const { resolveOwnCartUserId } = require('../utils/cartScope');

// Создание нового элемента в корзине
const createCartItem = async (data) => {
  try {
    const { user_id, item_id, quantity } = data;

    // Проверяем, есть ли уже этот предмет в корзине пользователя
    let cartItem = await Cart.findOne({
      where: { user_id, item_id }
    });

    if (cartItem) {
      // Если предмет уже есть в корзине, обновляем его количество
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      // Если предмета нет, создаем новый элемент корзины
      cartItem = await Cart.create(data);
      console.log('Data received for Cart creation:', data);
      
    }
    console.log('CartItem:', cartItem);
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
