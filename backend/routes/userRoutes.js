const express = require('express');
const authController = require('../controller/user');
const authMiddleware = require('../utils/Auth');
const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/users/:userId', authMiddleware.authenticateToken, authController.updateUser);
router.get('/users', authMiddleware.authenticateToken, authController.getAllUsers);
router.delete('/users/:userId', authMiddleware.authenticateToken, authController.deleteUser);

module.exports = router;
