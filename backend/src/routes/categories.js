const express = require('express');
const { getCategories, createCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCategories)
  .post(protect, authorize('admin', 'manager'), createCategory);

router.route('/:id')
  .delete(protect, authorize('admin'), deleteCategory);

module.exports = router;
