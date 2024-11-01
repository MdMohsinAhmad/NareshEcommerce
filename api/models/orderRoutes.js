const express = require('express');
const { getAllOrders, cancelProductInOrder } = require('./orderController');
const router = express.Router();

// Route to get all orders
router.get('/', getAllOrders);

// Route to cancel a specific product in an order
router.patch('/:orderId/cancel/:productId', cancelProductInOrder);

module.exports = router;
