const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseReport',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  // Map or Schema.Types.Mixed for dynamic fields mapping to the category
  details: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  bill_image_url: {
    type: String,
    default: null
  },
  warnings: [{
    type: String,
  }],
  comments: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
