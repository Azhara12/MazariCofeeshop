import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  sendOtp,
  verifyOtpAndResetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', loginUser);

// @route   GET /api/auth/profile
// @desc    Get logged in user profile (Protected Route)
router.get('/profile', protect, getUserProfile);

// @route   POST /api/auth/send-otp
// @desc    Generate & email a 6-digit OTP for password reset
router.post('/send-otp', sendOtp);

// @route   POST /api/auth/reset-password-otp
// @desc    Verify OTP and reset user password
router.post('/reset-password-otp', verifyOtpAndResetPassword);

export default router;