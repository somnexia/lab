const { Order } = require('../models');
const {
  prepareOrderCreatePayload,
  assertCanAccessOrder,
  sanitizeOrderUpdatePayload,
} = require('../utils/orderScope');

function notFound(message) {
  const err = new Error(message);
  err.code = 'NOT_FOUND';
  err.status = 404;
  return err;
}

/** Создать заказ — employee_id только из req.user */
const createOrder = async (data, user) => {
  try {
    const payload = prepareOrderCreatePayload(user, data);
    return await Order.create(payload);
  } catch (error) {
    console.error('Ошибка при создании заказа:', error);
    throw error;
  }
};

/** Список всех — только для admin-роута (без фильтра здесь) */
const getAllOrders = async () => {
  try {
    return await Order.findAll();
  } catch (error) {
    console.error('Ошибка при получении заказов:', error);
    throw error;
  }
};

/** Один заказ — свой или admin */
const getOrderById = async (id, user) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw notFound(`Заказ с id ${id} не найден`);
    }
    assertCanAccessOrder(user, order);
    return order;
  } catch (error) {
    console.error('Ошибка при получении заказа:', error);
    throw error;
  }
};

/** Обновить — свой или admin; employee_id из body выкидываем */
const updateOrder = async (id, data, user) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw notFound(`Заказ с id ${id} не найден`);
    }
    assertCanAccessOrder(user, order);
    const payload = sanitizeOrderUpdatePayload(data);
    await order.update(payload);
    return order;
  } catch (error) {
    console.error('Ошибка при обновлении заказа:', error);
    throw error;
  }
};

/** Удаление — только admin-роут; сервис без доп. owner-check */
const deleteOrder = async (id) => {
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      throw notFound(`Заказ с id ${id} не найден`);
    }
    await order.destroy();
    return { message: `Заказ с id ${id} удален` };
  } catch (error) {
    console.error('Ошибка при удалении заказа:', error);
    throw error;
  }
};

const getActiveOrderCount = async () => {
  try {
    return await Order.count({
      where: { status: 'active' },
    });
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
