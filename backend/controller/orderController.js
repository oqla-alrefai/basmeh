const Order = require('../models/orderModel');
const Product = require('../models/product');

exports.createOrder = async (req, res) => {
  try {
    const { products } = req.body; // Expecting an array of products with productId and quantity
    const user = req.user.userId;

    let orderProducts = [];

    for (let item of products) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: `Product with id ${item.productId} not found` });
      }

      const totalPrice = product.price * item.quantity;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        totalPrice
      });
    }

    const order = await Order.create({
      user,
      products: orderProducts
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).populate('products.product');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addProductToOrder = async (req, res) => {
  try {
    const { orderId, productId, quantity } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existingProductIndex = order.products.findIndex(item => item.product.toString() === productId);
    if (existingProductIndex > -1) {
      // Product exists in order, increase quantity
      order.products[existingProductIndex].quantity += quantity;
      order.products[existingProductIndex].totalPrice += product.price * quantity;
    } else {
      // Product does not exist in order, add new product
      order.products.push({
        product: productId,
        quantity,
        totalPrice: product.price * quantity
      });
    }

    await order.save();
    res.status(200).json({ message: 'Product added to order', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeProductFromOrder = async (req, res) => {
  try {
    const { orderId, productId, quantity } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const productIndex = order.products.findIndex(item => item.product.toString() === productId);
    if (productIndex > -1) {
      if (order.products[productIndex].quantity <= quantity) {
        // Remove product from order
        order.products.splice(productIndex, 1);
      } else {
        // Decrease quantity
        order.products[productIndex].quantity -= quantity;
        order.products[productIndex].totalPrice -= order.products[productIndex].product.price * quantity;
      }
      await order.save();
      res.status(200).json({ message: 'Product removed from order', order });
    } else {
      res.status(404).json({ message: 'Product not found in order' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};