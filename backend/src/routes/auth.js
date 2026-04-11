const express = require('express');
const { signupAdmin, loginUser, setPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signupAdmin);
router.post('/login', loginUser);
router.post('/set-password', setPassword);

module.exports = router;
