const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const mongoose = require('mongoose');

const router = express.Router();

// Fixed admin credentials (cannot be changed via registration)
const FIXED_ADMIN = {
  _id: 'admin_fixed',
  name: 'System Administrator',
  email: 'admin@university.edu',
  password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: admin123
  role: 'admin'
};

// In-memory users for fallback (development only)
let fallbackUsers = [
  FIXED_ADMIN,
  {
    _id: 'student1',
    name: 'Demo Student',
    email: 'student@test.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
    role: 'student',
    studentId: 'STU001',
    department: 'Computer Science'
  }
];

// Register (Students only - Admin credentials are fixed)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, studentId, department } = req.body;
    
    // Prevent admin registration - Admin credentials are fixed
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration is not allowed. Admin credentials are fixed.' });
    }
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use fallback for development
      const existingUser = fallbackUsers.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: Date.now().toString(),
        name,
        email,
        password: hashedPassword,
        role: 'student', // Force role to student
        studentId,
        department
      };
      fallbackUsers.push(newUser);

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.status(201).json({ token, user: { id: newUser._id, name, email, role: 'student', department } });
    }
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role: 'student', studentId, department });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email, role: 'student', department } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { email, password } = req.body;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState !== 1) {
      // Use fallback for development
      const user = fallbackUsers.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
    }
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'YES' : 'NO');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;