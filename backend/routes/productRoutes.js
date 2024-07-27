const express = require('express');
const productController = require('../controller/product');
const router = express.Router();
const authMiddleware = require('../utils/Auth');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/create', authMiddleware.authenticateToken, authMiddleware.isAdmin, upload.array('images', 10), productController.createProduct);
router.put('/update/:productId', authMiddleware.authenticateToken, authMiddleware.isAdmin, productController.updateProduct);
router.delete('/delete/:productId', authMiddleware.authenticateToken, authMiddleware.isAdmin, productController.deleteProduct);
router.get('/allproducts', productController.getAllProducts);
router.get('/product/:name', productController.searchProducts);
router.put('/add-discount/:productId', authMiddleware.authenticateToken, authMiddleware.isAdmin, productController.addDiscount);
router.put('/remove-discount/:productId', authMiddleware.authenticateToken, authMiddleware.isAdmin, productController.removeDiscount);


module.exports = router;
