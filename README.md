# StudyBuddy Backend — Phase 1 (User & Authentication Module)

## 📌 Overview
This is the **backend for StudyBuddy** — a platform that matches students based on courses, schedules, and study goals.  
We’re starting with the **User & Authentication Module** for handling:
- Signup
- Login
- JWT authentication
- Basic profile info
- Profile editing
- Account deletion

Google OAuth, profile pictures, and advanced features will be added later.

---

## ✅ Features Completed (Phase 1)
- **User Registration** (`POST /auth/register`)
  - Fields: name, email, password, university, year, courses
  - Password hashing with bcrypt
  - Email uniqueness check
  - Returns JWT token on success

- **User Login** (`POST /auth/login`)
  - Validates credentials
  - Returns JWT token on success

- **Protected Route Middleware**
  - Validates JWT token (`Authorization: Bearer <token>`)
  - Loads current user into `req.user`

- **Get Profile** (`GET /auth/me`)
  - Returns logged-in user details (excluding password)

- **Update Profile** (`PUT /auth/me`)
  - Allowed fields: `name`, `university`, `year`, `courses`, `studyStyle`, `goals`, `availability`

- **Delete Account** (`DELETE /auth/me`)
  - Removes user from database (no cascade cleanup yet)

---

### Phase 2: Profile & Preferences Module

#### Profile CRUD Routes

- **Create Profile** (`POST /profile`)  
  Creates extended profile linked to user.  
  Fields:  
  - `subjectsEnrolled` (array of strings)  
  - `studyPreferences`: `timeOfDay` ("morning", "afternoon", "night"), `mode` ("online", "offline"), `groupSize` (number)  
  - `goals` (array of strings)  
  - `availability` (array of objects with `day`, `startTime`, `endTime`)  
  - `matchPreference` ("peer-to-peer", "mentor-mentee", "any")

- **Get Profile** (`GET /profile`)  
  Retrieves logged-in user’s profile data, populated with basic user info (`name`, `email`).

- **Update Profile** (`PUT /profile`)  
  Updates allowed profile fields (`subjectsEnrolled`, `studyPreferences`, `goals`, `availability`, `matchPreference`).

- **Delete Profile** (`DELETE /profile`)  
  Deletes user's profile document.

#### Skill Level Management

- **Add/Update Skill Level** (`PUT /profile/skill-level/:subject`)  
  Adds or updates skill level (1–5) for a given subject.

- **Remove Skill Level** (`DELETE /profile/skill-level/:subject`)  
  Removes skill level for a given subject.

#### Matching Module Integration

- Service method `getProfileDataForMatching(userId)` to export profile data formatted for matching algorithms.

- Placeholder in profile update route to trigger matching recalculations and suggestions refresh immediately.

---

## 🔧 API Summary

| Endpoint                         | Method | Description                                      | Auth Required |
|---------------------------------|--------|------------------------------------------------|---------------|
| `/auth/register`                 | POST   | Register a new user                             | No            |
| `/auth/login`                    | POST   | Login user                                     | No            |
| `/auth/me`                      | GET    | Get logged-in user details                      | Yes           |
| `/auth/me`                      | PUT    | Update logged-in user basic profile             | Yes           |
| `/auth/me`                      | DELETE | Delete logged-in user account                    | Yes           |
| `/profile`                      | POST   | Create extended profile                          | Yes           |
| `/profile`                      | GET    | Get extended profile                             | Yes           |
| `/profile`                      | PUT    | Update extended profile                          | Yes           |
| `/profile`                      | DELETE | Delete extended profile                          | Yes           |
| `/profile/skill-level/:subject` | PUT    | Add or update skill level for a subject         | Yes           |
| `/profile/skill-level/:subject` | DELETE | Remove skill level for a subject                  | Yes           |

---

