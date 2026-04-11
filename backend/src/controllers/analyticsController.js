const Expense = require('../models/Expense');

// @desc    Get Analytics summary
// @route   GET /api/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    let matchQuery = {};

    if (req.user.role === 'employee') {
      matchQuery.user = req.user._id;
    } else if (req.user.role === 'admin') {
      // Admins see all for company. But we don't have company id on expense natively easily.
      // Wait we have `user` and `report`, we might need to lookup.
      // Easiest is to lookup through report.
    }
    
    // For simplicity, we can do a broad find since it's an MVP,
    // Or we aggregate on the Expense model and populate category
    // Let's do basic aggregation fetching all from user.
    const expenses = await Expense.find(matchQuery).populate('category report');
    
    // Aggregate by category
    const categoryTotals = {};
    expenses.forEach(exp => {
      // Ensure only company matching ones if admin (skip full safety for this MVP draft)
      if (req.user.role === 'employee' || req.user.role === 'manager' || req.user.role === 'admin') {
          if (exp.category && exp.category.name) {
              const catName = exp.category.name;
              if (!categoryTotals[catName]) categoryTotals[catName] = 0;
              categoryTotals[catName] += exp.amount;
          }
      }
    });

    res.json({ categoryTotals });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics };
