const Category = require('../models/Category');

// @desc    Get all categories for company
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ company: req.user.company });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Admin / Manager)
const createCategory = async (req, res) => {
  try {
    const { name, fields, daily_limit } = req.body;

    // Check if category exists for company
    const categoryExists = await Category.findOne({ name, company: req.user.company });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      company: req.user.company,
      fields, // e.g., [{ name: 'GST No', type: 'string', required: true }]
      daily_limit: daily_limit || null,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { force } = req.query;

    const Expense = require('../models/Expense');
    const inUse = await Expense.exists({ category: id });

    if (inUse && force !== 'true') {
      return res.status(409).json({ message: 'Category is in use', inUse: true });
    }

    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCategories, createCategory, deleteCategory };
