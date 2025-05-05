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

// 🔁 Forgot password - generate token
router.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "Email not found!" });
      }
  
      // Generate a password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiration = Date.now() + 3600000; // 1 hour from now
  
      // Save the token and expiration date in the database (for validation later)
      user.resetToken = resetToken;
      user.resetTokenExpiration = resetTokenExpiration;
      await user.save();
  
      // Create the reset link (this URL would be the frontend reset password page)
      const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
  
      // Send the reset link to the user's email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'darshan@sigvitas.com',
          pass: 'aqhf klky wpct uuuu',
        },
      });
  
      const mailOptions = {
        from: 'darshan@sigvitas.com',
        to: email,
        subject: 'Password Reset Request',
        text: `Click the following link to reset your password: ${resetLink}`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Password reset link sent to your email' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error sending reset link' });
    }
  });
  
  // 🔁 Reset password using token
  router.post("/reset-password/:token", async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() }, // Not expired
      });
  
      if (!user) return res.status(400).json({ message: "Invalid or expired token" });
  
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();
  
      res.json({ message: "Password reset successful" });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  });

module.exports = router;
