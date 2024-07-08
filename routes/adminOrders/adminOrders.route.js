const express = require('express');
const router = express.Router();
const authenticateToken = require('../../middlewares/authenticateToken/authenticateToken');
const { getAllOrders, updateOrderStatus, createOrder } = require('../../controllers/adminOrders/adminOrder.controller');

router.post('/orders', authenticateToken, createOrder);
router.get('/orders', authenticateToken, getAllOrders);
router.put('/orders/:orderId/items/:itemId', authenticateToken, updateOrderStatus);

module.exports = router;