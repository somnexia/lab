const orderService = require('../services/orderService');
const { isScopeForbidden } = require('../utils/labScope');

function sendError(res, error, fallbackStatus = 500) {
  if (isScopeForbidden(error) || error.code === 'FORBIDDEN' || error.code === 'LAB_REQUIRED') {
    return res.status(403).json({
      error: error.message,
      code: error.code || 'FORBIDDEN',
    });
  }
  if (error.code === 'NOT_FOUND' || /не найден/i.test(error.message || '')) {
    return res.status(404).json({
      error: error.message,
      code: 'NOT_FOUND',
    });
  }
  console.error(error);
  return res.status(fallbackStatus).json({ error: error.message });
}

const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body, req.user);
    return res.status(201).json(order);
  } catch (error) {
    return sendError(res, error);
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    return res.json(orders);
  } catch (error) {
    return sendError(res, error);
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id, req.user);
    return res.json(order);
  } catch (error) {
    return sendError(res, error);
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body, req.user);
    return res.json(order);
  } catch (error) {
    return sendError(res, error);
  }
};

const deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    return res.json(result);
  } catch (error) {
    return sendError(res, error);
  }
};

const getActiveOrderCount = async (req, res) => {
  try {
    const count = await orderService.getActiveOrderCount();
    return res.json({ count });
  } catch (error) {
    return sendError(res, error);
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
