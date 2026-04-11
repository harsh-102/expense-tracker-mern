const User = require('../models/User');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');

// @desc    Register new company & admin
// @route   POST /api/auth/signup
const signupAdmin = async (req, res) => {
  try {
    const { companyName, userName, email, password } = req.body;

    const companyExists = await Company.findOne({ name: companyName });
    if (companyExists) return res.status(400).json({ message: 'Company already exists' });

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Dummy company creation initially
    const company = await Company.create({ name: companyName, admin: null }); // Placeholder

    const user = await User.create({
      name: userName,
      email,
      password,
      role: 'admin',
      company: company._id,
      isActive: true,
    });

    // Update company admin
    company.admin = user._id;
    await company.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: company.name,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate('company');
    
    // If user is not active, they need to activate first
    if (user && !user.isActive) {
      return res.status(403).json({ message: 'Account is not activated. Please set your password first.', isInactive: true });
    }

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        company: user.company.name,
        companyId: user.company._id,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set password for invited employees
// @route   POST /api/auth/set-password
const setPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isActive) return res.status(400).json({ message: 'User already active' });

    user.password = newPassword;
    user.isActive = true;
    await user.save();

    const populatedUser = await User.findById(user._id).populate('company');

    res.json({
      _id: populatedUser._id,
      name: populatedUser.name,
      email: populatedUser.email,
      role: populatedUser.role,
      company: populatedUser.company.name,
      token: generateToken(populatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { signupAdmin, loginUser, setPassword };
