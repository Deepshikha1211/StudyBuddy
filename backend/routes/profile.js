const express = require('express');
const { body, param, validationResult } = require('express-validator'); // Added param here
const authMiddleware = require('../middleware/auth');
const profileService = require('../services/profileService');

const router = express.Router();

// Validation middleware helper for create/update profile
const profileValidationRules = [
  body('subjectsEnrolled').optional().isArray().withMessage('subjectsEnrolled must be an array'),
  body('studyPreferences').optional().isObject(),
  body('studyPreferences.timeOfDay').optional().isIn(['morning', 'afternoon', 'night']),
  body('studyPreferences.mode').optional().isIn(['online', 'offline']),
  body('studyPreferences.groupSize').optional().isInt({ min: 1 }),
  body('goals').optional().isArray(),
  body('skillLevels').optional().isObject(),
  body('availability').optional().isArray(),
  body('availability.*.day').optional().isString(),
  body('availability.*.startTime').optional().isString(),
  body('availability.*.endTime').optional().isString(),
  body('matchPreference').optional().isIn(['peer-to-peer', 'mentor-mentee', 'any'])
];

// Helper to check validation result
function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}

// Create profile (only once)
router.post(
  '/',
  authMiddleware,
  profileValidationRules,
  checkValidation,
  async (req, res) => {
    try {
      const data = { userId: req.user._id, ...req.body };
      const profile = await profileService.createProfile(data);
      res.status(201).json(profile);
    } catch (err) {
      if (err.message === 'Profile already exists') {
        return res.status(400).json({ message: err.message });
      }
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// Get logged-in user's profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const profile = await profileService.getProfileByUserId(req.user._id);
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update profile
// Update profile (general + skill levels)
router.put(
  '/',
  authMiddleware,
  profileValidationRules,
  checkValidation,
  async (req, res) => {
    try {
      let updatedProfile;

      // If skill-level update (subject + level passed)
      if (req.body.subject && req.body.level) {
        updatedProfile = await profileService.updateSkillLevel(
          req.user._id,
          req.body.subject,
          req.body.level
        );
      } else {
        // General profile update
        updatedProfile = await profileService.updateProfile(req.user._id, req.body);
      }

      res.json(updatedProfile);
    } catch (err) {
      if (err.message === 'Profile not found') {
        return res.status(404).json({ message: err.message });
      }
      if (err.message === 'Skill level must be between 1 and 5') {
        return res.status(400).json({ message: err.message });
      }
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);


// Delete profile
router.delete('/', authMiddleware, async (req, res) => {
  try {
    const deleted = await profileService.deleteProfile(req.user._id);
    if (!deleted) return res.status(404).json({ message: 'Profile not found' });
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// === Skill Level Routes ===


// Remove skill level for a subject
router.delete(
  '/skill-level/:subject',
  authMiddleware,
  [
    param('subject').isString().withMessage('Subject is required'),
  ],
  checkValidation,
  async (req, res) => {
    try {
      const { subject } = req.params;
      const profile = await profileService.removeSkillLevel(req.user._id, subject);
      res.json(profile);
    } catch (err) {
      if (err.message === 'Profile not found') {
        return res.status(404).json({ message: err.message });
      }
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);



router.get('/matching-data', authMiddleware, async (req, res) => {
  try {
    const data = await profileService.getProfileDataForMatching(req.user._id);
    res.json(data);
  } catch (err) {
    if (err.message === 'Profile not found') {
      return res.status(404).json({ message: err.message });
    }
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.put(
  '/',
  authMiddleware,
  profileValidationRules,
  checkValidation,
  async (req, res) => {
    try {
      const updatedProfile = await profileService.updateProfile(req.user._id, req.body);
      
      // Call matching update service here (pseudo code)
      // await matchingService.updateMatchesForUser(req.user._id);

      res.json(updatedProfile);
    } catch (err) {
      if (err.message === 'Profile not found') {
        return res.status(404).json({ message: err.message });
      }
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
