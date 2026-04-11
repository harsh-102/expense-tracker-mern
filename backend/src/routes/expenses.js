const express = require('express');
const { getExpenses, addExpense, editExpense, deleteExpense } = require('../controllers/expenseController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');

const router = express.Router();

router.route('/')
  .get(protect, getExpenses)
  .post(protect, upload.single('bill_image'), addExpense);

router.route('/:id')
  .patch(protect, upload.single('bill_image'), editExpense)
  .delete(protect, deleteExpense);

module.exports = router;
