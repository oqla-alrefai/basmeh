const express = require('express');
const cartController = require('../controller/cart');
const authMiddleware = require('../utils/Auth');
const router = express.Router();

router.post('/add', authMiddleware.authenticateToken, cartController.addItemToCart);
router.post('/remove', authMiddleware.authenticateToken, cartController.removeItemFromCart);
router.post('/checkout', authMiddleware.authenticateToken, cartController.checkout);
router.get('/mycart', authMiddleware.authenticateToken, cartController.getCart);
router.get('/allcarts', authMiddleware.authenticateToken, authMiddleware.isAdmin, cartController.getAllCarts);


module.exports = router;
