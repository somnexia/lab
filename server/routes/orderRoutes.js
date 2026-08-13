const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/', orderController.createOrder); // POST /api/orders/
router.get('/', orderController.getAllOrders); // GET /api/orders/

// Специальный маршрут — количество активных заказов (до /:id, иначе "active" попадёт в id)
router.get('/active/count', orderController.getActiveOrderCount); // GET /api/orders/active/count

router.get('/:id', orderController.getOrderById); // GET /api/orders/:id
router.put('/:id', orderController.updateOrder); // PUT /api/orders/:id
router.delete('/:id', orderController.deleteOrder); // DELETE /api/orders/:id

module.exports = router;
