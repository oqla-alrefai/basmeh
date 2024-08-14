const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;
    
    // Validate input
    if (!validateInput(email, password, full_name, phone)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Check if user already exists
    if (await userExists(email)) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await createUser(email, hashedPassword, full_name, phone);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!validateInput(email, password)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    if (!await checkPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { full_name, email, password,phone, role } = req.body;

    // Check if the user is the owner of the data or an admin
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update this user' });
    }

    // Hash the password if it's provided
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Prevent updating to admin role unless the requester is an admin
    if (role && req.user.role !== 'admin' && role === 'admin') {
      return res.status(403).json({ message: 'You are not authorized to update user role to admin' });
    }

    // Find the user by ID and update the data
    const user = await User.findByIdAndUpdate(userId, { full_name, email, password: hashedPassword, phone, role }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if the user is the owner of the data or an admin
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You are not authorized to delete this user' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getUser = async (req, res) => {
  try {

    const { name } = req.params;
    let users = await User.find({
      $or: [
        { name: new RegExp(name, 'i') }, // case-insensitive search for name
        { email: new RegExp(name, 'i') } // case-insensitive search for email
      ]
    });
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};