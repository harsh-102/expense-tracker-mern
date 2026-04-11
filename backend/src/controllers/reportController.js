const ExpenseReport = require('../models/ExpenseReport');
const Expense = require('../models/Expense');

// @desc    Get all reports (filtered by role)
// @route   GET /api/reports
// @access  Private
const getReports = async (req, res) => {
  try {
    let query = { company: req.user.company };

    if (req.user.role === 'employee') {
      // Employees see only their own reports
      query.user = req.user._id;
    } else if (req.user.role === 'manager') {
      // Managers see their own AND ones assigned to them where status is submitted
      query.$or = [
        { user: req.user._id },
        { manager: req.user._id, status: { $ne: 'draft' } }
      ];
    } else if (req.user.role === 'admin') {
      // Admin sees their own drafts + all other non-draft reports in company
      query.$or = [
        { user: req.user._id },
        { status: { $ne: 'draft' } }
      ];
    }

    const reports = await ExpenseReport.find(query)
      .populate('user', 'name email role')
      .populate('manager', 'name email')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
  try {
    const { name, month_year } = req.body;

    const report = await ExpenseReport.create({
      name,
      user: req.user._id,
      manager: req.user.manager || null,
      company: req.user.company,
      month_year,
      status: 'draft',
      total_amount: 0,
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status (Approval/Rejection logic)
// @route   PATCH /api/reports/:id/status
// @access  Private (Admin / Manager)
const updateReportStatus = async (req, res) => {
  try {
    const { status, rejection_reason } = req.body;
    const report = await ExpenseReport.findById(req.params.id);

    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Validate access
    if (req.user.role === 'employee') {
      if (status === 'pending' && report.status === 'draft' && report.user.toString() === req.user._id.toString()) {
        // allowing draft to pending
      } else {
        return res.status(403).json({ message: 'Employees cannot change report status directly' });
      }
    } else if (req.user.role === 'manager') {
      if (status === 'pending' && report.status === 'draft' && report.user.toString() === req.user._id.toString()) {
         // manager submitting own draft
      } else if (report.manager && report.manager.toString() === req.user._id.toString()) {
        if (!['manager_approved', 'manager_rejected'].includes(status)) {
          return res.status(400).json({ message: 'Invalid status for manager' });
        }
      } else {
        return res.status(403).json({ message: 'Not authorized to approve this report' });
      }
    } else if (req.user.role === 'admin') {
      if (status === 'pending' && report.status === 'draft' && report.user.toString() === req.user._id.toString()) {
         // Auto approve admin's own reports on submit
         status = 'admin_approved';
      } else if (!['admin_approved', 'admin_rejected', 'reimbursed'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status for admin' });
      }
    }

    report.status = status;
    if (rejection_reason) {
      report.rejection_reason = rejection_reason;
    }

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getReports, createReport, updateReportStatus };
