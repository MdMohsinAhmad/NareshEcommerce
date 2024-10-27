const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());
const { ADDTOCART, GETFROMCART, REGISTER, VERIFYTOKEN, ADDRESS, GETADDRESS, DELETECART, ORDER, GETPROFILE, GETORDER, LOGIN } = require('./models/Functionality')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// const jwt = require('jsonwebtoken');
const MONGO_URL = 'mongodb+srv://ecommerce:ecommerce@ecommerce.vdosh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=ecommerce'
mongoose
  .connect(`${MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB', err);
  });


// endpoint to register user
app.post('/register', REGISTER);

//endpoint to verify the email
app.get('/verify/:token', VERIFYTOKEN);

// endpoint to login the user
app.post('/login', LOGIN);

// endpoint to store a new address into the backend
app.post('/addresses', ADDRESS);

//endpoint to get all the addresses of a particular user
app.get('/addresses/:userId', GETADDRESS);

// add to cart
app.post('/addtocart', ADDTOCART);

// Retrive cart item from database
app.get('/getcart', GETFROMCART);

// Detele from database of cart items
app.delete('/deletecartitem/:id', DELETECART);


//endpoint to store all the orders
app.post('/orders', ORDER);

//get the user profile
app.get('/profile/:userId', GETPROFILE);

// get the order of that particular user
app.get('/orders/:userId', GETORDER);


app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});