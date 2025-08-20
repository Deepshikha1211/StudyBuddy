// routes/matchingRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const matchingService = require('../services/matchingService');
const Profile = require('../model/Profile');


class MatchingService {
  static areCompatible(profile1, profile2) {
    if (!profile1 || !profile2) return false;

    const subjectOverlap = profile1.subjectsEnrolled.some(sub =>
      profile2.subjectsEnrolled.includes(sub)
    );
    if (!subjectOverlap) return false;

    const goalsOverlap = profile1.goals.some(goal =>
      profile2.goals.includes(goal)
    );
    if (!goalsOverlap) return false;

    if (
      profile1.matchPreference !== 'any' &&
      profile2.matchPreference !== 'any' &&
      profile1.matchPreference !== profile2.matchPreference
    ) return false;

    const availOverlap = profile1.availability.some(a1 =>
      profile2.availability.some(
        a2 => a1.day === a2.day && a1.startTime === a2.startTime
      )
    );
    if (!availOverlap) return false;

    return true;
  }

  static async getCompatibleUsers(userId) {
    const userProfile = await Profile.findOne({ userId });
    if (!userProfile) throw new Error('Profile not found');

    const otherProfiles = await Profile.find({ userId: { $ne: userId } });

    const compatible = otherProfiles.filter(p =>
      this.areCompatible(userProfile, p)
    );

    return compatible.map(p => ({
      userId: p.userId,
      subjectsEnrolled: p.subjectsEnrolled,
      goals: p.goals,
      matchPreference: p.matchPreference,
      availability: p.availability
    }));
  }
}

// --- New endpoint ---
router.get('/suggestions', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const compatibleUsers = await MatchingService.getCompatibleUsers(userId);
    res.json(compatibleUsers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Send a match request
router.post('/request/:targetUserId', auth, async (req, res) => {
  try {
    const requesterId = req.user.id; // normalized by auth middleware
    const { targetUserId } = req.params;

    const matchRequest = await matchingService.sendMatchRequest(requesterId, targetUserId);
    res.json(matchRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Accept a match request
router.post('/accept/:requestId', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const match = await matchingService.acceptMatchRequest(req.params.requestId, userId);
    res.json(match);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Reject a match request
router.post('/reject/:requestId', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    await matchingService.rejectMatchRequest(req.params.requestId, userId);
    res.json({ message: 'Match request rejected' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all matches for logged-in user
router.get('/matches', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const matches = await matchingService.getMatches(userId);
    res.json(matches);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all pending match requests for logged-in user
router.get('/requests', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    const requests = await matchingService.getPendingRequests(userId);
    res.json(requests);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



module.exports = router;
