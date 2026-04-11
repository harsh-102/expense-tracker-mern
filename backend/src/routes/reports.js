const express = require('express');
const { getReports, createReport, updateReportStatus } = require('../controllers/reportController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getReports)
  .post(protect, createReport);

router.route('/:id/status')
  .patch(protect, authorize('admin', 'manager'), updateReportStatus);

module.exports = router;
