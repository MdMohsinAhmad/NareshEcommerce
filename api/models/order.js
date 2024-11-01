// models/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
      canceled: { type: Boolean, default: false },
      totalPrice: { type: Number },
      uniqueId: { type: String, required: true },
      orderStatus: { type: Boolean, default: false },
    },
  ],
  totalPrice: { // Total order price
    type: Number,
    required: true,
  },
  shippingAddress: {
    name: { type: String, required: true },
    mobileNo: { type: String, required: true },
    houseNo: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to calculate totalPrice for each product and the entire order
orderSchema.pre('save', function (next) {
  this.products.forEach(product => {
    product.totalPrice = product.quantity * product.price;
  });
  this.totalPrice = this.products
    .filter(product => !product.canceled) // Only include non-canceled items
    .reduce((sum, product) => sum + product.totalPrice, 0);
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
