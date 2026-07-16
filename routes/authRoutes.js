const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

// Register — supports file uploads for seller document verification
router.post('/register', upload.fields([
    { name: 'idDoc',        maxCount: 1 },
    { name: 'bankProof',    maxCount: 1 },
    { name: 'bizReg',       maxCount: 1 },
    { name: 'directorIdDoc', maxCount: 1 }
]), registerUser);

// Login
router.post('/login', loginUser);

// Forgot Password — sends reset email
router.post('/forgot-password', forgotPassword);

// Reset Password — validates token, sets new password
router.put('/reset-password/:token', resetPassword);

module.exports = router;
