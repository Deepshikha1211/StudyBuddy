const Profile = require('../model/Profile');

// Create profile
async function createProfile(data) {
  const existing = await Profile.findOne({ userId: data.userId });
  if (existing) throw new Error('Profile already exists');

  const profile = new Profile(data);
  await profile.save();
  return profile;
}

// Get profile by userId

async function getProfileByUserId(userId) {
  return await Profile.findOne({ userId }).populate('userId', 'name email');
}

// Update profile by userId
async function updateProfile(userId, updates) {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error('Profile not found');

  Object.keys(updates).forEach(key => {
    profile[key] = updates[key];
  });

  await profile.save();
  return profile;
}

// Delete profile by userId
async function deleteProfile(userId) {
  const result = await Profile.deleteOne({ userId });
  return result.deletedCount === 1;
}
// Update or add skill level for a single subject
async function updateSkillLevel(userId, subject, level) {
  if (level < 1 || level > 5) throw new Error('Skill level must be between 1 and 5');
  
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error('Profile not found');

  profile.skillLevels.set(subject, level);
  await profile.save();
  return profile;
}

// Remove skill level for a subject
async function removeSkillLevel(userId, subject) {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error('Profile not found');

  profile.skillLevels.delete(subject);
  await profile.save();
  return profile;
}


async function getProfileDataForMatching(userId) {
  const profile = await Profile.findOne({ userId });
  if (!profile) throw new Error('Profile not found');

  // Return only relevant fields needed by Matching Module
  return {
    userId: profile.userId,
    subjectsEnrolled: profile.subjectsEnrolled,
    studyPreferences: profile.studyPreferences,
    goals: profile.goals,
    skillLevels: Object.fromEntries(profile.skillLevels || []),
    availability: profile.availability,
    matchPreference: profile.matchPreference
  };
}
module.exports = {
    updateSkillLevel,
  removeSkillLevel,
    getProfileDataForMatching,
  createProfile,
  getProfileByUserId,
  updateProfile,
  deleteProfile
};
