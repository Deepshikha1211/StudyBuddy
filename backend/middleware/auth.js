// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../model/User');

module.exports = async function (req, res, next) {
  try {
    const header = req.header('Authorization');
    const token = header && header.startsWith('Bearer ') ? header.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Attach user
    req.user = user;
    req.user.id = user._id.toString(); // normalize id for easier access

    next();
  } catch (err) {
    console.error('auth middleware error', err.message);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
