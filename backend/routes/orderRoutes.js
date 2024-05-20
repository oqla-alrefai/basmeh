const express = require('express');
const orderController = require('../controller/orderController');
const authMiddleware = require('../utils/Auth');
const router = express.Router();

router.post('/create', authMiddleware.authenticateToken, orderController.createOrder);
router.get('/get', authMiddleware.authenticateToken, orderController.getUserOrders);
router.post('/orders/add-product', authMiddleware.authenticateToken, orderController.addProductToOrder);
router.post('/orders/remove-product', authMiddleware.authenticateToken, orderController.removeProductFromOrder);

module.exports = router;
