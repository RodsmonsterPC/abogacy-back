const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// @desc  Login user & get token
// @route POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get logged in user profile
// @route GET /api/auth/me
// @access Private
const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};

// @desc  Register first admin (only allowed if no users exist)
// @route POST /api/auth/register
// @access Public (seeding only)
const register = async (req, res) => {
  try {
    const count = await User.countDocuments();
    if (count > 0) {
      return res.status(403).json({ message: 'Registration is closed. Contact the system admin.' });
    }

    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password, role: 'admin' });

    res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { login, getMe, register };
