// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { hashPassword, comparePassword } = require('../utils/hash');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Register

    
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, university, year } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const passwordHash = await hashPassword(password);
    const user = new User({ name, email, passwordHash, university, year });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    university: req.user.university,
    year: req.user.year,
    profilePic: req.user.profilePic
  });
});


// Update profile (allowed fields only)
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const allowed = ['name','university','year','profilePic'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) req.user[field] = req.body[field];
    });

    await req.user.save();

    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      university: req.user.university,
      year: req.user.year,
      profilePic: req.user.profilePic
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Delete account
router.delete('/me', authMiddleware, async (req, res) => {
  try {
    await req.user.remove();
    // TODO: later remove references in matches, messages, groups
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error(err); res.status(500).send('Server error');
  }
});

module.exports = router;
