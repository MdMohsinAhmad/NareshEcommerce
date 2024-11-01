// controllers/orderController.js

const Order = require('../models/order');

// Controller to cancel a specific product in an order
const cancelProductInOrder = async (req, res) => {
    const { orderId, productId } = req.params;

    try {
        // Find the order by orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the product within the order's products array
        const product = order.products.find(p => p._id.toString() === productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found in the order' });
        }

        // Check if product is already canceled
        if (product.canceled) {
            return res.status(400).json({ message: 'Product is already canceled' });
        }

        // Mark the product as canceled
        product.canceled = true;

        // Recalculate the total order price, excluding canceled items
        order.totalPrice = order.products
            .filter(p => !p.canceled) // Exclude canceled items
            .reduce((sum, p) => sum + p.totalPrice, 0);

        // Save the updated order
        await order.save();

        res.status(200).json({ message: 'Product canceled successfully', order });
    } catch (error) {
        console.error('Error canceling product:', error);
        res.status(500).json({ message: 'Failed to cancel product', error: error.message });
    }
};

module.exports = { cancelProductInOrder };
