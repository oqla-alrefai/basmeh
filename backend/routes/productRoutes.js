const express = require('express');
const productController = require('../controller/product');
const router = express.Router();
const authMiddleware = require('../utils/Auth');

router.post('/create', authMiddleware.authenticateToken, authMiddleware.isAdmin, productController.createProduct);
router.put('/update/:productId', authMiddleware.authenticateToken, authMiddleware.isAdmin, productController.updateProduct);
router.delete('/delete/:productId', authMiddleware.authenticateToken, authMiddleware.isAdmin, productController.deleteProduct);
router.get('/allproducts', productController.getAllProducts);
router.get('/search', productController.searchProducts);

module.exports = router;
