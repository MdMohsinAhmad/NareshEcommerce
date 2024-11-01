const crypto = require('crypto');
const Cart = require('./Cart');  // Adjust the import path based on your project structure
const User = require('./user');
const Order = require('./order')
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
// const Orders = require('./order');

const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString('hex');
    return secretKey;
};
const secretKey = generateSecretKey();

const ADDTOCART = async (req, res) => {
    try {
        const { name, quantity, price, image, createdAt } = req.body;

        // Create a new cart item
        const newCartItem = new Cart({ name, quantity, price, image, createdAt });

        // Save the item to the database
        await newCartItem.save();

        res.status(201).json({ message: 'Item Added to Cart', newCartItem });
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ message: 'Failed to add item to cart', error });
    }
};

const GETFROMCART = async (req, res) => {
    try {
        const GetCartItems = await Cart.find();
        if (GetCartItems.length > 0) {
            return res.status(200).json({ GetCartItems });
        } else {
            return res.status(404).json({ message: 'No items found' });
        }
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ message: 'Server error', error });
    }
};

const REGISTER = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('Email already registered:', email);
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create a new user and generate verification token
        const newUser = new User({ name, email, password });
        newUser.verificationToken = crypto.randomBytes(20).toString('hex');

        // Save the user to the database
        await newUser.save();
        // Send verification email
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(201).json({
            message: 'Registration successful. Please check your email for verification.',
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed', error });
    }
};
const sendVerificationEmail = async (email, verificationToken) => {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        // Configure the email service or SMTP details here
        service: 'gmail',
        auth: {
            user: 'mdm01046@gmail.com',
            pass: 'rhhevghabbyidrso',
        },
    });

    // componse the email message
    const mailOptions = {
        from: 'freshandfreshmilk@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `Please click the following link to verify your email: http://localhost:8800/verify/${verificationToken}`,
    };

    // send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
    } catch (error) {
        console.error('Error sending verification email:', error);
    }
};
//endpoint to verify the email
const VERIFYTOKEN = async (req, res) => {
    try {
        const token = req.params.token;

        //Find the user witht the given verification token
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: 'Invalid verification token' });
        }

        //Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Email Verificatioion Failed' });
    }
}

const LOGIN = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check if the user exist
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // check if password is right or not
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // generate a token
        const token = jwt.sign({ userId: user._id }, secretKey);

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Login Failed' });
    }
}
// endpoint to store a new address into the backend

const ADDRESS = async (req, res) => {
    try {
        const { userId, address } = req.body;

        // find the user by userid
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // add the new address to the users addresses array
        user.addresses.push(address);

        // save the updated user in the backend
        await user.save();

        res.status(200).json({ message: 'Address Created Successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error Entering Address' });
    }
}

//endpoint to get all the addresses of a particular user
const GETADDRESS = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addresses = user.addresses;
        res.status(200).json({ addresses });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving the address' });
    }
}

// Detele from database of cart items
const DELETECART = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the item by ID and delete it
        const deletedItem = await Cart.findByIdAndDelete(id);

        if (deletedItem) {
            res.status(200).json({ message: 'Item deleted from cart', deletedItem });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ message: 'Failed to delete item', error });
    }
}

// Function to generate a unique 12-digit number
async function generateUniqueId() {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        // Generate a random 12-digit number
        uniqueId = String(Math.floor(100000000000 + Math.random() * 900000000000)); // Generates a random 12-digit number

        // Check if the uniqueId already exists
        const existingProduct = await Order.findOne({ uniqueId });
        if (!existingProduct) {
            isUnique = true; // If it doesn't exist, we have a unique ID
        }
    }

    return uniqueId;
}
//endpoint to store all the orders
const ORDER = async (req, res) => {
    try {
        const { userId, cartItems, totalPrice, shippingAddress, paymentMethod } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        //create an array of product objects from the cart Items
        const products = await Promise.all(cartItems.map(async (item) => ({
            name: item?.title,
            quantity: item.quantity,
            price: item.price,
            image: item?.image,
            uniqueId: await generateUniqueId() // Generate a unique ID for each product
        })));


        //create a new Order
        const order = new Order({
            user: userId,
            products: products,
            totalPrice: totalPrice,
            shippingAddress: shippingAddress,
            paymentMethod: paymentMethod,
        });

        await order.save();

        res.status(200).json({ message: 'Order created successfully!' });
    } catch (error) {
        console.log('error creating orders', error);
        res.status(500).json({ message: 'Error creating orders' });
    }
}

//get the user profile
const GETPROFILE = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving the user profile' });
    }
}

// get the order of that particular user
const GETORDER = async (req, res) => {
    try {
        const userId = req.params.userId;

        const orders = await Order.find({ user: userId }).populate('user');

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }
        // console.log({ orders })
        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: 'Error' });
    }
}


// cancel orders
const cancelProduct = async (req, res) => {
    const { orderId, productId } = req.params;
    try {
        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the product and remove it
        const productIndex = order.products.findIndex(product => product._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Product not found in order' });
        }

        // Remove the product from the array
        const productToRemove = order.products[productIndex];
        order.products.splice(productIndex, 1);

        // Recalculate totalPrice
        const updatedTotalPrice = order.products.reduce((total, product) => {
            return total + (product.price * product.quantity); // Adjusting this based on your requirement
        }, 0);

        // Update the totalPrice and save the order
        order.totalPrice = updatedTotalPrice;

        await order.save();

        res.json({ message: 'Product canceled successfully', order });
    } catch (error) {
        console.error('Error canceling product:', error);
        res.status(500).json({ message: 'Error canceling product' });
    }
};

module.exports = { GETORDER, GETPROFILE, ORDER, DELETECART, GETADDRESS, ADDRESS, ADDTOCART, GETFROMCART, REGISTER, VERIFYTOKEN, LOGIN, cancelProduct };
