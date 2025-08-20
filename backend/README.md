Matching Module – Requirements
1. Purpose

To suggest and connect users with compatible study partners / groups based on their profile data (not on raw user data, since we separated User and Profile modules).

2. Inputs

Profile data (from Profile model):

Subjects enrolled

Skill level per subject

Study preferences (time, mode: online/offline, group size)

Goals (exam prep, notes exchange, project work, peer teaching, etc.)

User identity (from User model, only _id, username, maybe location/email for contact but not logic-related)

3. Outputs

A list of matching profiles ranked by compatibility score.

Each match should include:

Basic user info (username, maybe profile picture if you add later).

Matching subjects & skill overlap.

Compatibility score (percentage or points).

Shared goals/preferences summary.

4. Core Features

Find Matches

Compare a user’s profile against others in the database.

Calculate a compatibility score based on:

Subject overlap (common subjects).

Skill complementarity (similar or slightly different levels).

Goals overlap (exam prep, notes exchange, etc.).

Study preferences (time slot, mode, group size).

Ranking & Filtering

Order matches by score.

Allow filters:

Subject-specific matches (e.g., only Math).

Minimum compatibility threshold.

Group size preference.

Match Request Flow (later stage)

Send a match request → other user accepts/declines.

Store confirmed matches (could be used in chat module later).

5. Constraints

Users should not be matched with themselves.

Should avoid duplicate matches (A-B = B-A).

Must handle missing profile fields gracefully.

Efficient queries → consider indexing subjectsEnrolled and goals in MongoDB.

6. Services Needed

matchingService.findMatches(userId, filters?)

matchingService.calculateScore(profileA, profileB)

matchingService.sendMatchRequest(userId, targetId)

matchingService.acceptMatchRequest(requestId)

7. APIs Needed

GET /matching → get top matches for logged-in user.

POST /matching/request/:targetId → send request.

POST /matching/accept/:requestId → accept request.

(Optional) GET /matching/requests → see pending requests.