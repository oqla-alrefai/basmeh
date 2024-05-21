const Cart = require("../models/cart");
const Product = require("../models/product");
const transporter = require('../utils/nodemailer');
require('dotenv').config();


exports.addItemToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({ user: userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex > -1) {
      // Product exists in cart, increase quantity
      cart.products[productIndex].quantity += 1;
      cart.totalPrice += product.price;
    } else {
      // Product does not exist in cart, add new product with quantity = 1
      cart.products.push({ product: productId, quantity: 1 });
      cart.totalPrice += product.price;
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product._id.toString() === productId
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (cart.products[productIndex].quantity > 1) {
      // Decrease quantity
      cart.products[productIndex].quantity -= 1;
      cart.totalPrice -= product.price;
    } else {
      // Remove product from cart
      cart.products.splice(productIndex, 1);
      cart.totalPrice -= product.price;
    }

    if (cart.products.length === 0) {
      // Delete cart if no products left
      await Cart.findByIdAndDelete(cart._id);
      return res
        .status(200)
        .json({ message: "Cart is empty and has been deleted" });
    } else {
      await cart.save();
      return res
        .status(200)
        .json({ message: "Product removed from cart", cart });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.checkout = async (req, res) => {
  try {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email, // Make sure the user object has an email property
      subject: 'Order Confirmation',
      text: `Dear ${req.user.full_name},\n\nThank you for your purchase. Here are the details of your order:\n\n` +
            cart.products.map(item => `- ${item.product.name}: ${item.quantity} x $${item.product.price}`).join('\n') +
            `\n\nTotal Price: $${cart.totalPrice}\n\nThank you for shopping with us!`
    };

    await transporter.sendMail(mailOptions);

    await Cart.findByIdAndDelete(cart._id);

    res.status(200).json({ message: 'Order confirmed and cart deleted. Email sent to the user.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};