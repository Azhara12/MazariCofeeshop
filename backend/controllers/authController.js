import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Resend } from 'resend';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// ─── REGISTER ────────────────────────────────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill all fields');
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        savedAddresses: user.savedAddresses,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// ─── SEND OTP  (POST /api/auth/send-otp) ─────────────────────────────────────
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error('Email is required');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('No account found with this email address');
    }

    // Lazy-initialize Resend here so dotenv has already loaded env vars
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Generate a random 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash the OTP before storing (security best practice)
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // Save hashed OTP + 10-minute expiry window to DB
    user.resetOtp = hashedOtp;
    user.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save({ validateBeforeSave: false });

    // Send styled HTML email via Resend
    const { error: sendError } = await resend.emails.send({
      from: 'MazariCS <onboarding@resend.dev>',
      to: ['azharmahmoodmazari@gmail.com'], // test address as specified
      subject: '☕ Your MazariCS Password Reset OTP',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:0;background-color:#3D2817;font-family:'Segoe UI',Arial,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#3D2817;padding:40px 20px;">
              <tr>
                <td align="center">
                  <table width="480" cellpadding="0" cellspacing="0" style="background-color:#FAF6F0;border-radius:24px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                    <!-- Header -->
                    <tr>
                      <td style="background:linear-gradient(135deg,#3D2817 0%,#C68B45 100%);padding:32px;text-align:center;">
                        <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;font-size:32px;">☕</div>
                        <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">MazariCS</h1>
                        <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Premium Coffee Experience</p>
                      </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                      <td style="padding:40px 32px;">
                        <h2 style="margin:0 0 8px;color:#3D2817;font-size:22px;font-weight:700;">Password Reset OTP</h2>
                        <p style="margin:0 0 24px;color:#78716C;font-size:15px;line-height:1.6;">
                          Hello <strong style="color:#3D2817;">${user.name}</strong>,<br/>
                          We received a request to reset your MazariCS account password. Use the code below to proceed.
                        </p>
                        <!-- OTP Box -->
                        <div style="background:linear-gradient(135deg,#FAF6F0 0%,#F0E8DC 100%);border:2px solid #C68B45;border-radius:16px;padding:28px;text-align:center;margin:0 0 24px;">
                          <p style="margin:0 0 8px;color:#78716C;font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Your 6-Digit OTP</p>
                          <div style="font-size:48px;font-weight:800;letter-spacing:12px;color:#3D2817;font-family:'Courier New',monospace;">${otp}</div>
                          <p style="margin:12px 0 0;color:#A8A29E;font-size:12px;">⏱ Expires in <strong style="color:#C68B45;">10 minutes</strong></p>
                        </div>
                        <div style="background:#FEF3C7;border-left:4px solid #F59E0B;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
                          <p style="margin:0;color:#92400E;font-size:13px;">⚠️ <strong>Do not share this OTP</strong> with anyone. MazariCS will never ask for your OTP via phone or email.</p>
                        </div>
                        <p style="margin:0;color:#A8A29E;font-size:13px;">If you didn't request a password reset, please ignore this email. Your account remains secure.</p>
                      </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                      <td style="background:#F5F5F4;padding:20px 32px;text-align:center;border-top:1px solid #E7E5E4;">
                        <p style="margin:0;color:#A8A29E;font-size:12px;">© 2024 MazariCS Coffee Shop. All rights reserved.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (sendError) {
      console.error('[Resend Error]', sendError);
      res.status(500);
      throw new Error('Failed to send OTP email. Please try again.');
    }

    res.json({
      success: true,
      message: 'OTP sent successfully to your email address',
    });
  } catch (error) {
    next(error);
  }
};

// ─── VERIFY OTP & RESET PASSWORD  (POST /api/auth/reset-password-otp) ─────────
export const verifyOtpAndResetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error('Email, OTP, and new password are all required');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error('No account found with this email address');
    }

    // Check OTP existence and expiry
    if (!user.resetOtp || !user.resetOtpExpire) {
      res.status(400);
      throw new Error('No OTP request found. Please request a new OTP.');
    }

    if (user.resetOtpExpire < new Date()) {
      // Cleanup expired OTP fields
      user.resetOtp = null;
      user.resetOtpExpire = null;
      await user.save({ validateBeforeSave: false });
      res.status(400);
      throw new Error('OTP has expired. Please request a new one.');
    }

    // Verify OTP against stored hash
    const isOtpValid = await bcrypt.compare(otp, user.resetOtp);
    if (!isOtpValid) {
      res.status(400);
      throw new Error('Invalid OTP. Please check and try again.');
    }

    // Set new plain-text password — the pre-save hook will hash it automatically
    user.password = newPassword;

    // Clear OTP fields after successful reset
    user.resetOtp = null;
    user.resetOtpExpire = null;

    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
};