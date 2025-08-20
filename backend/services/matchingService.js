// services/matchingService.js
const Match = require('../model/Match');
const MatchRequest = require('../model/MatchRequest');
const Profile = require('../model/Profile');
const User = require('../model/User');

class MatchingService {

  // Send a match request
  static async sendMatchRequest(senderId, receiverId) {
    if (senderId === receiverId) throw new Error("Cannot send request to yourself");

    const existing = await MatchRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending'
    });
    if (existing) throw new Error("Match request already sent");

    const request = new MatchRequest({ sender: senderId, receiver: receiverId });
    return await request.save();
  }

  // Accept a match request
  static async acceptMatchRequest(requestId, userId) {
    const req = await MatchRequest.findById(requestId);
    if (!req) throw new Error("Request not found");
    if (req.receiver.toString() !== userId) throw new Error("Not authorized");

    req.status = 'accepted';
    req.respondedAt = new Date();
    await req.save();

    // Create a match between sender and receiver
    const match = await Match.findOne({
      users: { $all: [req.sender, req.receiver] }
    });

    if (!match) {
      const senderProfile = await Profile.findOne({ userId: req.sender });
      const receiverProfile = await Profile.findOne({ userId: req.receiver });

      const compatible = MatchingService.areCompatible(senderProfile, receiverProfile);
      if (!compatible) throw new Error("Users are not compatible");

      const newMatch = new Match({
        users: [req.sender, req.receiver],
        compatibilityScore: 100, // or calculate dynamically
        commonSubjects: senderProfile.subjectsEnrolled.filter(sub =>
          receiverProfile.subjectsEnrolled.includes(sub)
        ),
        commonGoals: senderProfile.goals.filter(goal =>
          receiverProfile.goals.includes(goal)
        ),
        studyPreferenceMatch: senderProfile.studyPreferences.timeOfDay === receiverProfile.studyPreferences.timeOfDay
      });

      await newMatch.save();
    }

    return req;
  }

  // Reject a match request
  static async rejectMatchRequest(requestId, userId) {
    const req = await MatchRequest.findById(requestId);
    if (!req) throw new Error("Request not found");
    if (req.receiver.toString() !== userId) throw new Error("Not authorized");

    req.status = 'rejected';
    req.respondedAt = new Date();
    return await req.save();
  }

  // Get all matches for a user
  static async getMatches(userId) {
    const matches = await Match.find({ users: userId }).populate('users', 'name email');
    return matches;
  }

  // Get all pending requests for a user
  static async getPendingRequests(userId) {
    const requests = await MatchRequest.find({ receiver: userId, status: 'pending' })
      .populate('sender', 'name email');
    return requests;
  }

  // Compatibility check reused from before
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
}

module.exports = MatchingService;
