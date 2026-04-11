const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Get all users in the same company
// @route   GET /api/users
// @access  Private
const getUsers = async (req, res) => {
  try {
    // If admin, can see all users in the company
    // If manager, can see users they manage and themselves? The prompt says admin has full access.
    // Let's just return all users in the company for simplicity, front-end will filter
    const users = await User.find({ company: req.user.company }).select('-password').populate('manager', 'name email');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new employee or manager
// @route   POST /api/users
// @access  Private (Admin / Manager)
const addUser = async (req, res) => {
  try {
    const { name, email, role, employee_id, manager_id } = req.body;

    // Only admin or manager can add
    if (req.user.role === 'employee') {
      return res.status(403).json({ message: 'Employees cannot add new users' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const user = await User.create({
      name,
      email,
      role, // 'manager' | 'employee'
      employee_id,
      manager: manager_id || null, // null means admin acts as manager
      company: req.user.company,
      isActive: false, // Must set password to activate
      password: null, // No password initially
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsers, addUser };
