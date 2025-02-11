const { Cart, Inventory, User } = require('../models');

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

// Получение всех элементов корзины для пользователя
const getAllCartItems = async (user_id) => {
  try {
    return await Cart.findAll({
      where: { user_id },
      // include: [
      //   { association: 'inventory' }, // Связь с Inventory
      //   { association: 'user' }, // Связь с User (если нужно)
      // ],

    });


  } catch (error) {
    console.log("userId:", user_id);
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

// Очистка корзины пользователя
const clearCart = async (user_id) => {
  try {
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
