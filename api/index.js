const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
// const orderRoutes = require('./models/orderRoutes')
const app = express();
const port = 8800;
const router = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const MONGO_URL = process.env.MONGO_URL; // Use an environment variable
const MONGO_URL = 'mongodb+srv://ecommerce:ecommerce@ecommerce.vdosh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce';

mongoose
  .connect(MONGO_URL, {

  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Product Schema
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  image: String,
});

const Product = mongoose.model('Product', productSchema);
// User authentication endpoints
const { ADDTOCART, GETFROMCART, REGISTER, VERIFYTOKEN, ADDRESS, GETADDRESS, DELETECART, ORDER, GETPROFILE, GETORDER, LOGIN ,cancelProduct} = require('./models/Functionality');

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});
// Retrieve product from MongoDB database
app.get('/api/products', async (req, res, next) => {
  try {
    const products = await Product.find();
    res.json(products );
  } catch (err) {
    next(err);
  }
});

// app.use('/orders', orderRoutes);
app.post('/register', REGISTER);
app.get('/verify/:token', VERIFYTOKEN);
app.post('/login', LOGIN);
app.post('/addresses', ADDRESS);
app.get('/addresses/:userId', GETADDRESS);
app.post('/addtocart', ADDTOCART);
app.get('/getcart', GETFROMCART);
app.delete('/deletecartitem/:id', DELETECART);
app.post('/orders', ORDER);
app.get('/profile/:userId', GETPROFILE);
app.get('/orders/:userId', GETORDER);
app.patch('/orders/:orderId/cancel/:productId', cancelProduct);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
