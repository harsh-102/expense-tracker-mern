const express = require('express');
const { getUsers, addUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getUsers)
  .post(protect, authorize('admin', 'manager'), addUser);

module.exports = router;
