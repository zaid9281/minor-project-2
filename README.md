# 🎓 SOET Resource Portal

<div align="center">

![KR Mangalam University](https://img.shields.io/badge/KR%20Mangalam%20University-SOET-003399?style=for-the-badge&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Storage-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**A secure, role-based academic resource management portal for the School of Engineering & Technology, KR Mangalam University.**

🌐 **Live:** https://minor-project-2-4jv7.onrender.com

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Database](#-database) · [API Routes](#-api-routes)

</div>

---

## 📌 About The Project

The **SOET Resource Portal** is a full-stack web application built for **KR Mangalam University's School of Engineering & Technology (SOET)**. It provides a single, authenticated, centralised platform where:

- **Students** access semester-wise study materials, previous year papers, syllabi, announcements, discussion forums, study groups, and AI-powered tools
- **Faculty** upload and manage academic resources, post announcements, view analytics, and interact with students
- **Admins** oversee all uploads, manage users, view portal analytics, and have full system visibility

Built with realistic dummy data — 1,200+ students, 17 faculty, 70+ subjects across 6 B.Tech specializations.

---

## 🚀 Live Deployment

| Component | Service | Status |
|---|---|---|
| App Hosting | Render (Free) | ✅ Live |
| Database | MongoDB Atlas M0 | ✅ Live |
| File Storage | Supabase Storage | ✅ Live |
| Authentication | Microsoft Azure AD | ✅ Live |
| Sleep Prevention | UptimeRobot | ✅ Active |
| Code Repository | GitHub | ✅ Connected |

**Total cost: ₹0**

---

## ✨ Features — Complete List

### 👨‍🎓 Student Features
- Microsoft Outlook Login via Azure AD OAuth2 (@krmu.edu.in only)
- Auto semester calculation from enrollment year
- Personalised dashboard with degree progress bar
- Interactive stat cards (Subjects scroll, Materials drawer, PYQs drawer, Credits modal, Bookmarks)
- Subject cards with 2-row button layout
- Unit-wise study materials with bookmark and star rating
- Previous year papers with filters
- Syllabus PDF viewer (inline browser)
- Bookmarks — save any material or PYQ
- Star ratings (1–5) with optional comment on materials
- Per-subject discussion forum (post, reply, upvote, resolve)
- Study groups — create, join via invite code, group chat
- Notification system — bell icon, dropdown, full page
- Announcement board — course and semester targeted
- Dark mode toggle
- PWA — installable on mobile

### 👨‍🏫 Faculty Features
- Manual login with bcrypt password
- Upload study materials (drag-drop, unit picker, Select2)
- Upload PYQs (exam type, year, semester type)
- Upload syllabus (one per subject, auto-replace)
- Bulk upload — up to 20 PDFs at once with progress bars
- Subject authorization via SubjectFacultyMap
- Post announcements (6 categories, 3 scope levels)
- Discussion forum access (replies auto-marked as Official Answer)
- Analytics dashboard (downloads, ratings, unit heatmap, forum activity)
- Change password with live strength checker
- Delete own uploads

### 🛡️ Admin Features
- All faculty powers
- Admin overview dashboard (stats, charts, top uploaders)
- Manage students (search, filter, activate/deactivate, paginated)
- Manage faculty (upload stats, last login, reset password)
- Add new faculty accounts
- Login audit logs (IP, user agent, timestamp)
- Portal usage analytics (daily active users, peak hours, page visits)
- View all uploads across all faculty

### 🔔 Notification System
- Bell icon with live unread count badge (auto-refreshes 30s)
- Dropdown with latest 5 notifications
- Full notifications page with filters (All/Unread/Materials/PYQs)
- Auto-triggered on material upload, PYQ upload, announcements
- Optional email via Nodemailer

### 📢 Announcement Board
- 6 categories: General, Exam, Holiday, Urgent, Assignment, Result
- 3 scopes: College-wide, Course-specific, Semester-specific
- Pinned announcements with gold border
- Expiry date support
- Dashboard banner for latest announcement
- Student notifications on post

### 📄 Syllabus Viewer
- Faculty upload one per subject (auto-replaces old)
- Students view inline in browser
- Green checkmark on subject card if available

### 🔖 Bookmarks
- One-click save on materials and PYQs
- Saved page grouped by subject
- Filter by type, remove individually or clear all

### ⭐ Ratings
- 5-star modal with hover effects and labels
- One rating per student per material (editable)
- Optional comment (300 chars)
- Average shown per material, faculty sees subject summary

### 💬 Discussion Forum
- Per-subject Q&A
- Faculty replies auto-marked as Official Answer
- Upvote posts and replies
- Mark resolved, pin, delete
- Filters: All / Open / Resolved / Pinned

### 📦 Bulk Upload
- Up to 20 PDFs at once, drag-drop
- Per-file progress bars, retry failed files
- Auto-notifies students per file

### 👥 Study Groups
- Create per-subject groups (max 10 members)
- Join via 6-character invite code
- Group chat with optional link sharing
- Creator can remove members, delete group

### 📊 Analytics
- Faculty: 7-day download chart, subject bars, top materials, ratings, unit heatmap
- Admin: daily active users, peak hours heatmap, page visits, role breakdown

### 🌙 Dark Mode
- Toggle in all navbars (moon/sun icon)
- Persists via localStorage

### 📱 PWA
- Installable on mobile (Add to Home Screen)
- Offline fallback page
- App shortcuts

### 🔒 Security
- JWT in httpOnly cookies
- bcrypt (10 salt rounds)
- Rate limiting (10 attempts/15 min on login)
- Helmet.js (CSP, HSTS, X-Frame-Options)
- xss-clean, express-mongo-sanitize
- File validation (PDF only, 20MB limit)
- Role-based route protection
- Secure logout (back button blocked)

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Runtime | Node.js 18+ | Server-side JavaScript |
| Framework | Express.js 4.x | Routing and middleware |
| Database | MongoDB + Mongoose | Data storage |
| Templates | EJS | Server-rendered HTML |
| Frontend | Bootstrap 5.3 + Bootstrap Icons | Responsive UI |
| Auth (Students) | Microsoft Azure AD OAuth2 | University Outlook login |
| Auth (Faculty) | JWT + bcrypt.js | Token sessions + password hashing |
| File Storage | Supabase Storage | PDF hosting |
| File Upload | Multer (memory storage) | PDF handling |
| Notifications | Nodemailer | Email alerts |
| Security | Helmet, xss-clean, mongo-sanitize, rate-limit | Multi-layer protection |
| UI Extras | Select2, Bootstrap Icons | Searchable dropdowns + icons |
| PWA | Service Worker + manifest.json | Mobile installable |
| Deployment | Render + MongoDB Atlas + Supabase | Full production stack |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Community Server
- Git

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/zaid9281/minor-project-2.git
cd minor-project-2
```

**2. Install dependencies**
```bash
npm install --legacy-peer-deps
```

**3. Set up environment variables**

Create `.env` in root:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/soet_portal
JWT_SECRET=soet_kr_mangalam_super_secret_2024_!@#
JWT_EXPIRES_IN=7d

# Microsoft Azure AD
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=common
AZURE_REDIRECT_URI=http://localhost:3000/auth/azure/callback

# Supabase Storage
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key

# Email (optional)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORTAL_URL=http://localhost:3000
```

**4. Start MongoDB**
```bash
mongod
```

**5. Seed the database**
```bash
npm run seed
```

**6. Start development server**
```bash
npm run dev
```

Open **http://localhost:3000**

---

## 🔑 Demo Credentials

### Faculty / Admin — Password: `Faculty@123`

| Name | Email | Role |
|---|---|---|
| Dr. Rajesh Sharma | dr.rajesh.sharma@krmu.edu.in | **Admin** |
| Dr. Priya Verma | dr.priya.verma@krmu.edu.in | Faculty |
| Dr. Anil Kumar | dr.anil.kumar@krmu.edu.in | Faculty |
| Dr. Kavita Singh | dr.kavita.singh@krmu.edu.in | Faculty |
| Ms. Ananya Mishra | ms.ananya.mishra@krmu.edu.in | Faculty |
| Mr. Vikram Chauhan | mr.vikram.chauhan@krmu.edu.in | Faculty |
| Ms. Divya Rao | ms.divya.rao@krmu.edu.in | Faculty |
| Dr. Meena Gupta | dr.meena.gupta@krmu.edu.in | Faculty |
| Mr. Arjun Nair | mr.arjun.nair@krmu.edu.in | Faculty |

### Student Login
Students use **Microsoft Outlook** with `@krmu.edu.in` account.

---

## 🏗 Project Structure

```
soet-portal/
├── config/
│   ├── db.js                    # MongoDB connection
│   └── supabase.js              # Supabase client
├── middleware/
│   ├── auth.js                  # JWT verify + no-cache
│   ├── roleCheck.js             # studentOnly/facultyOnly/adminOnly
│   └── trackUsage.js            # Usage analytics middleware
├── models/                      # 18 Mongoose models
│   ├── Student.js
│   ├── Faculty.js
│   ├── Course.js
│   ├── Subject.js
│   ├── SubjectFacultyMap.js
│   ├── StudyMaterial.js
│   ├── PYQ.js
│   ├── Syllabus.js
│   ├── Notification.js
│   ├── Announcement.js
│   ├── Bookmark.js
│   ├── Rating.js
│   ├── ForumPost.js
│   ├── ForumReply.js
│   ├── LoginLog.js
│   ├── DownloadLog.js
│   ├── UsageLog.js
│   ├── StudyGroup.js
│   └── GroupMessage.js
├── routes/                      # 12 route files
│   ├── auth.js
│   ├── student.js
│   ├── faculty.js
│   ├── notifications.js
│   ├── announcements.js
│   ├── bookmarks.js
│   ├── ratings.js
│   ├── forum.js
│   ├── bulk.js
│   ├── analytics.js
│   ├── admin.js
│   └── studygroups.js
├── views/                       # 35+ EJS templates
│   ├── partials/
│   │   ├── studentNavbar.ejs
│   │   ├── facultyNavbar.ejs
│   │   └── adminNavbar.ejs
│   ├── auth/
│   ├── student/
│   ├── faculty/
│   ├── notifications/
│   ├── announcements/
│   ├── forum/
│   ├── admin/
│   ├── 404.ejs
│   └── error.ejs
├── public/
│   ├── css/main.css
│   ├── js/main.js
│   ├── manifest.json
│   ├── service-worker.js
│   ├── offline.html
│   └── icons/
├── seeders/seed.js
├── utils/
│   ├── semesterHelper.js
│   ├── uploadHelper.js          # Multer + Supabase upload
│   └── notificationHelper.js
├── scripts/
│   └── make-public.js
├── app.js
├── .env
├── .gitignore
├── Procfile
└── package.json
```

---

## 🗄 Database — 18 Collections

| Collection | Purpose |
|---|---|
| students | 1,200+ profiles with roll numbers |
| faculty | 17 accounts with hashed passwords |
| courses | 6 B.Tech specializations |
| subjects | 70+ subjects across semesters 1-6 |
| subjectfacultymaps | Faculty-subject authorization |
| studymaterials | Uploaded material metadata |
| pyqs | Previous year paper metadata |
| syllabi | One per subject |
| notifications | Per-student inbox |
| announcements | Faculty/admin announcements |
| bookmarks | Student saved resources |
| ratings | Material ratings (1-5 stars) |
| forumposts | Discussion forum questions |
| forumreplies | Forum replies |
| loginlogs | Login audit trail |
| downloadlogs | Download tracking |
| usagelogs | Portal usage analytics |
| studygroups | Study groups with invite codes |
| groupmessages | Study group chat messages |

### Roll Number Format
```
2401730232
24   = Enrollment year 2024
0173 = Course code (CSE-AIML)
0232 = Sequential roll number 232
```

### Semester Calculation
```
Jan-Jun (even): semester = (currentYear - enrollmentYear) × 2
Jul-Nov (odd):  semester = (currentYear - enrollmentYear) × 2 + 1

Example: Enrolled 2024, Feb 2026 → semester = 2×2 = 4 ✓
```

---

## 🛣 API Routes — Complete List

### Auth (/auth)
| Method | Route | Description |
|---|---|---|
| GET | /auth/landing | Landing page |
| GET | /auth/faculty-login | Faculty login form |
| POST | /auth/login | Faculty login |
| GET | /auth/azure | Microsoft redirect |
| GET | /auth/azure/callback | OAuth callback |
| GET | /auth/logout | Clear session |

### Student (/student)
| Method | Route | Description |
|---|---|---|
| GET | /student/dashboard | Student dashboard |
| GET | /student/subjects/:code/materials | Materials page |
| GET | /student/subjects/:code/pyqs | PYQs page |
| GET | /student/subjects/:code/syllabus | Syllabus viewer |
| POST | /student/track-download | Log download |

### Faculty (/faculty)
| Method | Route | Description |
|---|---|---|
| GET | /faculty/dashboard | Faculty dashboard |
| GET/POST | /faculty/upload/material | Material upload |
| GET/POST | /faculty/upload/pyq | PYQ upload |
| GET/POST | /faculty/upload/syllabus | Syllabus upload |
| POST | /faculty/material/delete/:id | Delete material |
| POST | /faculty/pyq/delete/:id | Delete PYQ |
| POST | /faculty/syllabus/delete/:id | Delete syllabus |
| GET | /faculty/admin/all-uploads | Admin uploads view |
| GET/POST | /faculty/change-password | Change password |

### Notifications, Announcements, Bookmarks, Ratings, Forum, Bulk, Analytics, Admin, Groups
All routes follow RESTful patterns as documented in the codebase.

---

## 🔮 Planned Features (Next Phase)

| # | Feature | Status |
|---|---|---|
| 14 | AI Study Assistant (Gemini) | 🚧 In Progress |
| 15 | AI Mock Test Generator | ⏳ Planned |
| 16 | AI Smart Study Planner | ⏳ Planned |
| 17 | AI Auto-tag Uploads | ⏳ Planned |
| 18 | AI PYQ Answer Key Generator | ⏳ Planned |

**AI Stack:** Google Gemini 1.5 Flash (free — 15 req/min, 1M tokens/day, native PDF reading)

---

## 👥 Team

| Member | Role |
|---|---|
| Member 1 | Backend Lead & Database Architect |
| Member 2 | Authentication & Security |
| Member 3 | Student Portal Developer |
| Member 4 | Faculty Portal & Upload System |
| Member 5 | Features & Frontend |

**Institution:** KR Mangalam University, Gurugram  
**Department:** School of Engineering & Technology (SOET)  
**Course:** B.Tech CSE — AI & Machine Learning  
**Batch:** 2024–2028 | Semester IV | Academic Year 2025-26

---

## 📄 License

Built for academic purposes at KR Mangalam University. All rights reserved.

---

<div align="center">
Built with ❤️ for KR Mangalam University · SOET · 2026
</div>