const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require('nodemailer');

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    console.log("Inside the register Section");

    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hash });
    await newUser.save();

    // Send email for confirmation
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to MyDashboard - Account Created',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #4A00E0;">Welcome to MyDashboard, ${username}!</h2>
          <p style="font-size: 16px; color: #333;">Your account has been successfully created.</p>
          <p style="font-size: 16px; color: #333;">
            <strong>Username:</strong> ${email}<br/>
            <strong>Password:</strong> ${password}
          </p>
          <p style="font-size: 14px; color: #666;">
            You can now log in to your account using your username and the password you set during registration.
            For security reasons, we recommend keeping your password safe and not sharing it with anyone.
          </p>
          <a href="http://localhost:5173/login" style="display: inline-block; padding: 10px 20px; margin-top: 20px; background-color: #4A00E0; color: white; text-decoration: none; border-radius: 5px;">
            Log In Now
          </a>
          <p style="font-size: 14px; color: #666; margin-top: 20px;">
            If you did not create this account, please ignore this email or contact our support team.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
            &copy; ${new Date().getFullYear()} MyDashboard. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Register] Confirmation email sent to: ${email}`);

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("Inside the Login Page");

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "2h" });

    // Send response
    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err); // Add logging for better debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot Password - Generate OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log(`[Forgot Password] Missing email: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[Forgot Password] Email not found: ${email}`);
      return res.status(400).json({ message: 'Email not found' });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiration = Date.now() + 2 * 60 * 1000; // 2 minutes

    // Update user with OTP and expiration
    user.resetOtp = otp;
    user.resetOtpExpiration = otpExpiration;
    await user.save();

    // Verify save
    const updatedUser = await User.findOne({ email });
    if (!updatedUser.resetOtp || !updatedUser.resetOtpExpiration) {
      console.error(`[Forgot Password] Failed to save OTP for: ${email}`);
      return res.status(500).json({ message: 'Error saving OTP' });
    }

    console.log(`[Forgot Password] Saved OTP: ${otp}, Expiration: ${new Date(otpExpiration).toISOString()}, Email: ${email}`);

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 30px; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #ffffff;">
          <h2 style="color: #4A00E0; font-size: 24px; margin-bottom: 20px;">Password Reset OTP</h2>
          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 15px;">
            Hello ${user.username},
          </p>
          <p style="font-size: 16px; color: #333; line-height: 1.6; margin-bottom: 15px;">
            We received a request to reset your password. Your OTP is:
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #4A00E0; letter-spacing: 5px; background-color: #f5f5f5; padding: 10px 20px; border-radius: 5px; display: inline-block;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 15px;">
            This OTP is valid for <strong>2 minutes</strong>. Please use it to reset your password. If the OTP expires, you can request a new one.
          </p>
          <p style="font-size: 14px; color: #666; line-height: 1.6; margin-bottom: 20px;">
            If you did not request this password reset, please ignore this email or contact our support team at <a href="mailto:${process.env.EMAIL_USER}" style="color: #4A00E0; text-decoration: none;">${process.env.EMAIL_USER}</a>.
          </p>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            © ${new Date().getFullYear()} MyDashboard. All rights reserved.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Forgot Password] OTP email sent to: ${email}`);

    res.status(200).json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error(`[Forgot Password] Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).json({ message: 'Error sending OTP' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    console.log(`[Verify OTP] Missing email or OTP: ${JSON.stringify(req.body)}`);
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`[Verify OTP] Email not found: ${email}`);
      return res.status(400).json({ message: 'Email not found' });
    }

    console.log(`[Verify OTP] User found: ${email}, resetOtp: ${user.resetOtp}, resetOtpExpiration: ${user.resetOtpExpiration}`);
    console.log(`[Verify OTP] Received OTP: ${otp}, Type: ${typeof otp}`);
    console.log(`[Verify OTP] Time Check - Expires: ${user.resetOtpExpiration ? new Date(user.resetOtpExpiration).toISOString() : 'null'}, Now: ${new Date().toISOString()}`);

    if (!user.resetOtp || !user.resetOtpExpiration) {
      console.log(`[Verify OTP] No OTP or expiration set for: ${email}`);
      return res.status(400).json({ message: 'No OTP request found' });
    }

    if (user.resetOtp.toString() !== otp.toString()) {
      console.log(`[Verify OTP] OTP mismatch - Received: ${otp}, Stored: ${user.resetOtp}`);
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.resetOtpExpiration < Date.now()) {
      console.log(`[Verify OTP] OTP expired - Expiration: ${user.resetOtpExpiration}, Now: ${Date.now()}`);
      return res.status(400).json({ message: 'Expired OTP' });
    }

    // Clear OTP after verification
    user.resetOtp = null;
    user.resetOtpExpiration = null;
    await user.save();
    console.log(`[Verify OTP] OTP cleared and verified successfully for: ${email}`);

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(`[Verify OTP] Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  console.log('Password Resetting...');

  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Email not found!' });
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = null;
    user.resetOtpExpiration = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// GET /api/auth/user
router.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Expect "Bearer <token>"
    if (!token) {
      console.log('[Get User] No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('username email');
    if (!user) {
      console.log(`[Get User] User not found: ${decoded.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(`[Get User] Fetched user: ${user.email}`);
    res.status(200).json({ username: user.username, email: user.email });
  } catch (err) {
    console.error(`[Get User] Error: ${err.message}, Stack: ${err.stack}`);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// GET /api/patents
router.get('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('[Patent Fetch] No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log(`[Patent Fetch] User not found: ${decoded.id}`);
      return res.status(404).json({ message: 'User not found' });
    }

    const patents = await Patent.find();
    console.log(`[Patent Fetch] Fetched ${patents.length} patents for user: ${user.email}`);
    res.status(200).json(patents);
  } catch (err) {
    console.error(`[Patent Fetch] Error: ${err.message}, Stack: ${err.stack}`);
    res.status(500).json({ message: 'Error fetching patents' });
  }
});

module.exports = router;
