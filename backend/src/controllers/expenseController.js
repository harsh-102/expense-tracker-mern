const Expense = require('../models/Expense');
const ExpenseReport = require('../models/ExpenseReport');
const Category = require('../models/Category');

// @desc    Get expenses for a report
// @route   GET /api/expenses?reportId=X
// @access  Private
const getExpenses = async (req, res) => {
  try {
    const { reportId } = req.query;
    if (!reportId) return res.status(400).json({ message: 'reportId is required' });

    const report = await ExpenseReport.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Ensure access rights here if needed

    const expenses = await Expense.find({ report: reportId }).populate('category');
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add an expense item to a report
// @route   POST /api/expenses
// @access  Private (Employee)
const addExpense = async (req, res) => {
  try {
    const { reportId, categoryId, date, amount, details } = req.body;
    let comments = req.body.comments || null;
    let parsedDetails = details;
    if (typeof details === 'string') {
      try { parsedDetails = JSON.parse(details); } catch (e) { }
    }

    const report = await ExpenseReport.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (report.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized for this report' });
    }
    if (!['draft', 'manager_rejected', 'admin_rejected'].includes(report.status)) {
      return res.status(400).json({ message: 'Cannot add expenses to a submitted or approved report' });
    }

    const category = await Category.findById(categoryId);
    const warnings = [];

    // Check limits
    if (category && category.daily_limit && Number(amount) > category.daily_limit) {
      warnings.push('The Amount Exceeds the set limit for this Expense type');
    }

    const bill_image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const expense = await Expense.create({
      report: reportId,
      user: req.user._id,
      category: categoryId,
      date,
      amount: Number(amount),
      details: parsedDetails,
      bill_image_url,
      warnings,
      comments
    });

    // Update report total amount
    report.total_amount += Number(amount);
    await report.save();

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Edit expense item
// @route   PATCH /api/expenses/:id
// @access  Private
const editExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // If manager/admin is leaving a comment
    if (req.user.role !== 'employee' && req.body.comments !== undefined) {
      expense.comments = req.body.comments;
      await expense.save();
      return res.json(expense);
    }

    if (expense.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const oldAmount = expense.amount;
    Object.assign(expense, req.body);

    if (req.file) {
      expense.bill_image_url = `/uploads/${req.file.filename}`;
    }

    // details parse
    if (req.body.details && typeof req.body.details === 'string') {
      try { expense.details = JSON.parse(req.body.details); } catch (e) { }
    }

    await expense.save();

    const report = await ExpenseReport.findById(expense.report);
    report.total_amount = report.total_amount - oldAmount + Number(expense.amount);
    await report.save();

    res.json(expense);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Delete expense item
// @route   DELETE /api/expenses/:id
// @access  Private (Owner only)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    if (expense.user.toString() !== req.user._id.toString() && req.user.role === 'employee') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const report = await ExpenseReport.findById(expense.report);
    if (!['draft', 'manager_rejected', 'admin_rejected'].includes(report.status)) {
      return res.status(400).json({ message: 'Cannot delete expenses from a submitted or approved report' });
    }

    // Subtract from report total
    report.total_amount -= expense.amount;
    await report.save();

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getExpenses, addExpense, editExpense, deleteExpense };
