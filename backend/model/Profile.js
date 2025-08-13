const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subjectsEnrolled: [String],           // array of subject names or IDs
  studyPreferences: {
    timeOfDay: { type: String },        // "morning" / "afternoon" / "night"
    mode: { type: String },             // "online" / "offline"
    groupSize: { type: Number }
  },
  goals: [String],                      // exam prep, peer teaching, etc.
  skillLevels: {
    type: Map,
    of: Number,
    validate: {
      validator: function(map) {
        return [...map.values()].every(v => v >= 1 && v <= 5);
      },
      message: 'Skill levels must be between 1 and 5'
    },
    default: {}
  },
  availability: [{
    day: String,
    startTime: String,
    endTime: String
  }],
  matchPreference: { type: String, enum: ['peer-to-peer', 'mentor-mentee', 'any'] }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
