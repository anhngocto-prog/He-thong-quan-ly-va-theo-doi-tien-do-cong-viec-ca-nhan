const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/userController');

// Đường dẫn Đăng ký: POST http://localhost:5000/api/users/register
router.post('/register', registerUser);

// Đường dẫn Đăng nhập: POST http://localhost:5000/api/users/login
router.post('/login', loginUser);

module.exports = router;