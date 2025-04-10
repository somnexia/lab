const orderService = require('../services/orderService');

// CREATE
const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ BY ID
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// UPDATE
const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
const deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// COUNT ACTIVE
const getActiveOrderCount = async (req, res) => {
  try {
    const count = await orderService.getActiveOrderCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
