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


