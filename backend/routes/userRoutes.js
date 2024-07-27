const express = require('express');
const authController = require('../controller/user');
const authMiddleware = require('../utils/Auth');
const router = express.Router();

router.post('/register', authController.signup);
router.post('/login', authController.login);
router.put('/users/:userId', authMiddleware.authenticateToken, authController.updateUser);
router.get('/users', authMiddleware.authenticateToken, authMiddleware.isAdmin, authController.getAllUsers);
router.delete('/users/:userId', authMiddleware.authenticateToken, authController.deleteUser);
router.get("/user/:name", authMiddleware.authenticateToken, authMiddleware.isAdmin, authController.getUser )
module.exports = router;
