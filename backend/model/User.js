// models/User.js
const mongoose = require('mongoose');

const AvailabilitySchema = new mongoose.Schema({
  day: String,         // "Mon"
  startTime: String,   // "14:00"
  endTime: String      // "16:00"
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String }, // null for OAuth users (not used now)
  university: { type: String },
  year: { type: String },         // "2" or "2nd"
  // courses: [{ type: String }],
  // studyStyle: { type: String },
  // goals: [{ type: String }],
  // availability: [AvailabilitySchema],
  profilePic: {
    url: String,
    public_id: String
  },
  provider: { type: String, default: 'local' }, // 'local' for now
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
