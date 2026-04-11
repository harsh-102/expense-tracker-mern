const mongoose = require('mongoose');

const expenseReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  manager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  // e.g. "2023-11" or custom range naming
  month_year: {
    type: String,
  },
  status: {
    type: String,
    enum: [
      'draft',            // just created, not submitted yet
      'pending',          // employee submitted
      'manager_approved', 
      'manager_rejected', 
      'admin_approved', 
      'admin_rejected', 
      'reimbursed'
    ],
    default: 'draft'
  },
  total_amount: {
    type: Number,
    default: 0
  },
  rejection_reason: {
    type: String,
    default: null
  }
}, { timestamps: true });

module.exports = mongoose.model('ExpenseReport', expenseReportSchema);
