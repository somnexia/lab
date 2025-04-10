const { Order } = require('../models');

// Создание нового заказа
const createOrder = async (data) => {
  try {
    const order = await Order.create(data);
    return order;
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};

// Получение всех заказов
const getAllOrders = async () => {
  try {
    return await Order.findAll();
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    throw error;
  }
};

// Получение заказа по ID
const getOrderById = async (id) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error(`Заказ с id ${id} не найден`);
    }
    return order;
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    throw error;
  }
};

// Обновление заказа по ID
const updateOrder = async (id, data) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error(`Заказ с id ${id} не найден`);
    }
    await order.update(data);
    return order;
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error);
    throw error;
  }
};

// Удаление заказа по ID
const deleteOrder = async (id) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw new Error(`Заказ с id ${id} не найден`);
    }
    await order.destroy();
    return { message: `Заказ с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении заказа:', error);
    throw error;
  }
};

// Подсчет активных заказов
const getActiveOrderCount = async () => {
  try {
    const count = await Order.count({
      where: {
        status: 'active',
      },
    });
    return count;
  } catch (error) {
    throw new Error('Ошибка при подсчете активных заказов: ' + error.message);
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getActiveOrderCount,
};
