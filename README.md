# 🎓 SOET Resource Portal

<div align="center">

![KR Mangalam University](https://img.shields.io/badge/KR%20Mangalam%20University-SOET-003399?style=for-the-badge&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

**A secure, role-based academic resource management portal for the School of Engineering & Technology, KR Mangalam University.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [Database](#-database) · [API Routes](#-api-routes) · [Team](#-team)

</div>

---

## 📌 About The Project

The **SOET Resource Portal** is a full-stack web application built for **KR Mangalam University's School of Engineering & Technology (SOET)**. It provides a single, authenticated, centralised platform where:

- **Students** access semester-wise study materials, previous year papers, syllabi, announcements, and discussion forums
- **Faculty** upload and manage academic resources, post announcements, and interact with students via the forum
- **Admins** oversee all uploads, manage content, post college-wide announcements, and have full system visibility

Built as a prototype using comprehensive dummy data — 1,200+ students, 17 faculty, 70+ subjects across 6 B.Tech specializations — since official university database access was not available.

---

## ✨ Features

### 👨‍🎓 Student Features
- **Microsoft Outlook Login** via Azure AD OAuth2 — only `@krmu.edu.in` accounts allowed
- **Auto Semester Calculation** — current semester computed from enrollment year and current date
- **Personalised Dashboard** — profile card, degree progress bar, interactive stat cards
- **Interactive Stat Cards** — Subjects (scroll), Materials (slide-in drawer), PYQs (slide-in drawer), Credits (modal popup), Bookmarks (quick access)
- **Subject Cards** — faculty name, credits bar, material count, PYQ count, syllabus availability
- **2-Row Button Layout** — Syllabus, Materials, PYQs in row 1 · Discussion Forum full-width in row 2
- **Study Materials** — unit-wise organised PDFs (Unit 1–6) per subject with bookmark and rating buttons
- **Previous Year Papers** — filterable by year, semester type, exam type with bookmark support
- **Syllabus Viewer** — PDF rendered inline in browser using iframe, no download required
- **Bookmarks** — save any material or PYQ, view all saved resources grouped by subject
- **Star Ratings** — rate study materials 1–5 stars with optional comment, edit anytime
- **Discussion Forum** — per-subject Q&A, post questions, reply, upvote, mark resolved
- **Announcements** — view college-wide and course/semester-specific announcements
- **Notification System** — bell icon with unread count, dropdown with latest 5, full notifications page
- **Subject Search** — real-time search/filter on dashboard
- **Attendance placeholder** — ready for ERP integration
- **Exam Schedule placeholder** — Mid-Term and End-Term slots

### 👨‍🏫 Faculty Features
- **Manual Login** with email and bcrypt-hashed password
- **Upload Study Materials** — drag-and-drop PDF, unit picker (1–6), title, description, Select2 subject search
- **Upload PYQs** — exam type (Mid-Term/End-Term), year, semester type, duplicate prevention
- **Upload Syllabus** — one per subject, replaces old, shows existing uploads list
- **Bulk Upload** — upload up to 20 PDFs at once, per-file progress bars, retry failed files
- **Subject Authorization** — faculty can only upload for their mapped subjects
- **Recent Uploads** — clickable PDFs with timestamp, ratings shown for materials
- **Delete Own Uploads** — with file removal from storage
- **Post Announcements** — 6 categories, college-wide or course/semester-specific targeting, pin, expiry date
- **Discussion Forum Access** — reply to student questions (auto-marked as Official Answer), pin posts, mark official answers

### 🛡️ Admin Features
- All faculty powers plus full system oversight
- **ADMIN badge** in navbar and dashboard
- **Admin Panel** — table of ALL uploads across ALL subjects and ALL faculty with filter
- **View ALL subjects** across all courses (not just own)
- **Delete any upload** regardless of who uploaded it
- **Total Students** stat card
- **Password Change** — secure form with live strength checker

### 🔔 Notification System
- Bell icon in student navbar with live unread count badge (auto-refreshes every 30 seconds)
- Dropdown showing latest 5 notifications with subject code, time-ago format
- Full notifications page with filters (All / Unread / Materials / PYQs)
- Mark as read individually or mark all as read
- Auto-triggered when faculty uploads material or PYQ
- Auto-triggered when announcements are posted
- Optional email notifications via Nodemailer (Gmail)

### 📢 Announcement Board
- Faculty/admin post announcements with 6 categories (General, Exam, Holiday, Urgent, Assignment, Result)
- Scope targeting: College-wide / Course-specific / Semester-specific
- Students only see announcements relevant to their branch and semester
- Pinned announcements stay at top with gold border
- Expiry date support — auto-hides expired announcements
- Dashboard banner showing latest urgent/pinned announcement
- View counter per announcement
- Students notified via notification system for each announcement

### 📄 Syllabus Viewer
- Faculty upload one syllabus PDF per subject (replaces old on re-upload)
- Students view syllabus directly in browser (no download needed)
- Subject card shows green checkmark if syllabus available, grey if not
- Upload time, academic year, faculty name shown on viewer page
- Download button also available

### 🔖 Bookmarks
- One-click bookmark on any material or PYQ page
- Filled icon = bookmarked, outline = not bookmarked
- Page remembers bookmark state on load
- Saved page groups all bookmarks by subject
- Filter by Materials / PYQs
- Remove individual bookmarks with fade-out animation
- Clear all bookmarks at once
- Bookmark count on dashboard stat card

### ⭐ Ratings
- Students rate study materials 1–5 stars with hover effects
- Star labels: Poor / Fair / Good / Very Good / Excellent
- Optional comment up to 300 characters
- One rating per student per material — update anytime
- Average rating and total count shown per material
- "You rated X★" green badge shown to student
- Faculty see ratings on their recent uploads in dashboard

### 💬 Discussion Forum
- Per-subject forum accessible from every subject card
- Students post questions (title required, content optional)
- Anyone can reply — faculty replies auto-marked as Official Answer (green banner)
- Upvote questions and replies
- Mark question as Resolved (author or faculty)
- Pin important posts (faculty only)
- Delete posts and all replies (author or admin)
- Filter: All / Open / Resolved / Pinned
- View counter per post

### 📦 Bulk Upload
- Upload up to 20 PDFs at once
- Material bulk: select subject + unit → all files assigned to that unit
- PYQ bulk: select subject + exam type + year + semester type
- Drag-and-drop multiple files at once
- Per-file progress bar animation
- Status per file: Waiting / Uploading / Done / Failed
- Retry only failed files (successful ones kept)
- PDF-only validation, 20MB per file limit
- Auto-notifies students for each uploaded file

### 🔒 Security Features
- **Rate Limiting** — 10 login attempts per 15 minutes (express-rate-limit)
- **JWT in httpOnly Cookie** — JavaScript cannot read it, 7-day expiry
- **XSS Protection** — xss-clean sanitizes all inputs
- **NoSQL Injection Protection** — express-mongo-sanitize
- **Security Headers** — Helmet.js (CSP, HSTS, X-Frame-Options, etc.)
- **Secure Logout** — Cookie cleared + no-cache headers (back button blocked)
- **File Validation** — PDF MIME type + extension check + 20MB limit
- **Password Strength** — enforced on change (uppercase + lowercase + number + special char)
- **Domain Check** — only @krmu.edu.in for student login
- **Role Authorization** — faculty upload only for mapped subjects

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | Node.js 18+ | Server-side JavaScript |
| Framework | Express.js 4.x | Routing and middleware |
| Database | MongoDB + Mongoose | Data storage and schema modeling |
| Templating | EJS | Server-rendered dynamic HTML |
| Frontend | Bootstrap 5.3 | Responsive UI |
| Auth (Students) | Microsoft Azure AD OAuth2 | Outlook login via Microsoft Graph API |
| Auth (Faculty) | JWT + bcrypt.js | Token-based sessions + password hashing |
| File Upload | Multer | PDF handling with validation |
| Notifications | Nodemailer | Email alerts for uploads |
| Security | Helmet, xss-clean, express-mongo-sanitize, express-rate-limit | Multi-layer protection |
| UI Extras | Select2, Bootstrap Icons | Searchable dropdowns + icons |
| Utilities | uuid, compression, morgan | File naming, gzip, logging |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/try/download/community) Community Server
- [Git](https://git-scm.com/)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/YourUsername/soet-portal.git
cd soet-portal
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create `.env` in root:
```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/soet_portal
JWT_SECRET=soet_kr_mangalam_super_secret_2024_!@#
JWT_EXPIRES_IN=7d

# Microsoft Azure AD (student Outlook login)
AZURE_CLIENT_ID=your_azure_client_id
AZURE_CLIENT_SECRET=your_azure_client_secret
AZURE_TENANT_ID=your_azure_tenant_id
AZURE_REDIRECT_URI=http://localhost:3000/auth/azure/callback

# Email notifications (optional)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
PORTAL_URL=http://localhost:3000
```

**4. Start MongoDB**
```powershell
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

## 🔑 Demo Login Credentials

### Faculty / Admin — Password: `Faculty@123`

| Name | Email | Role |
|------|-------|------|
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
Students must use **Microsoft Outlook** (`@krmu.edu.in`).
Your seeded student: roll `2401730232` → email `2401730232@krmu.edu.in`

---

## 🏗 Project Structure

```
soet-portal/
│
├── config/
│   └── db.js                      # MongoDB connection
│
├── middleware/
│   ├── auth.js                    # JWT verify + no-cache headers
│   └── roleCheck.js               # studentOnly / facultyOnly / adminOnly
│
├── models/
│   ├── Student.js                 # Student schema
│   ├── Faculty.js                 # Faculty schema
│   ├── Course.js                  # Course/branch schema
│   ├── Subject.js                 # Subject schema
│   ├── SubjectFacultyMap.js       # Faculty-subject mapping
│   ├── StudyMaterial.js           # Uploaded material metadata
│   ├── PYQ.js                     # Previous year paper metadata
│   ├── Syllabus.js                # Syllabus metadata (one per subject)
│   ├── Notification.js            # Notification schema
│   ├── Announcement.js            # Announcement schema
│   ├── Bookmark.js                # Student bookmarks
│   ├── Rating.js                  # Material ratings
│   ├── ForumPost.js               # Discussion forum posts
│   └── ForumReply.js              # Forum replies
│
├── routes/
│   ├── auth.js                    # /auth/* — landing, login, Azure, logout
│   ├── student.js                 # /student/* — dashboard, materials, pyqs, syllabus
│   ├── faculty.js                 # /faculty/* — dashboard, uploads, admin, password
│   ├── notifications.js           # /notifications/*
│   ├── announcements.js           # /announcements/*
│   ├── bookmarks.js               # /bookmarks/*
│   ├── ratings.js                 # /ratings/*
│   ├── forum.js                   # /forum/*
│   └── bulk.js                    # /bulk/upload
│
├── views/
│   ├── partials/
│   │   ├── studentNavbar.ejs      # Student navbar with bell icon
│   │   └── facultyNavbar.ejs      # Faculty navbar
│   ├── auth/
│   │   ├── landing.ejs            # Login selection page
│   │   └── faculty-login.ejs      # Faculty manual login
│   ├── student/
│   │   ├── dashboard.ejs          # Student dashboard
│   │   ├── materials.ejs          # Unit-wise materials + ratings + bookmarks
│   │   ├── pyqs.ejs               # PYQ filter + bookmarks
│   │   ├── syllabus.ejs           # Syllabus PDF viewer
│   │   └── bookmarks.ejs          # Saved resources page
│   ├── faculty/
│   │   ├── dashboard.ejs          # Faculty/admin dashboard
│   │   ├── upload-material.ejs    # Material upload form
│   │   ├── upload-pyq.ejs         # PYQ upload form
│   │   ├── upload-syllabus.ejs    # Syllabus upload form
│   │   ├── bulk-upload.ejs        # Bulk upload page
│   │   ├── subjects.ejs           # Faculty subject list
│   │   ├── admin-uploads.ejs      # Admin panel
│   │   └── change-password.ejs    # Password change
│   ├── notifications/
│   │   └── index.ejs              # Full notifications page
│   ├── announcements/
│   │   ├── index.ejs              # Announcements list
│   │   ├── new.ejs                # Post announcement form
│   │   └── _card.ejs              # Announcement card partial
│   ├── forum/
│   │   ├── index.ejs              # Forum subject page
│   │   └── post.ejs               # Single post + replies
│   ├── 404.ejs                    # Custom 404 page
│   └── error.ejs                  # Custom error page
│
├── public/
│   ├── css/
│   │   └── main.css               # Global styles, toasts, spinner, ratings
│   └── js/
│       └── main.js                # Toast, loader, session, ratings, notifications
│
├── uploads/
│   ├── materials/                 # Study material PDFs
│   ├── pyqs/                      # PYQ PDFs
│   └── syllabus/                  # Syllabus PDFs
│
├── seeders/
│   └── seed.js                    # Seeds 1200+ students, 17 faculty, 70+ subjects
│
├── utils/
│   ├── semesterHelper.js          # Semester calculation logic
│   ├── uploadHelper.js            # Multer config for all upload types
│   └── notificationHelper.js      # Bulk notification + email helper
│
├── app.js                         # Main Express app entry point
├── .env                           # Environment variables (not in git)
├── .gitignore
├── Procfile                       # Railway deployment
└── package.json
```

---

## 🗄 Database

### Collections

| Collection | Documents | Description |
|-----------|-----------|-------------|
| `students` | 1,200+ | Student profiles with roll numbers |
| `faculty` | 17 | Faculty with hashed passwords |
| `courses` | 6 | B.Tech specializations |
| `subjects` | 70+ | Subjects per course per semester |
| `subjectfacultymaps` | 200+ | Faculty-subject assignments |
| `studymaterials` | dynamic | Uploaded material metadata |
| `pyqs` | dynamic | PYQ metadata |
| `syllabi` | dynamic | One per subject |
| `notifications` | dynamic | Per-student notifications |
| `announcements` | dynamic | Faculty announcements |
| `bookmarks` | dynamic | Student saved resources |
| `ratings` | dynamic | Material ratings |
| `forumposts` | dynamic | Discussion forum questions |
| `forumreplies` | dynamic | Replies to forum posts |

### Courses & Course Codes

| Course | Code | Students/batch |
|--------|------|----------------|
| CSE Core | 0171 | 180 |
| CSE — AI & Machine Learning | 0173 | 120 |
| CSE — Data Science | 0175 | 90 |
| CSE — Full Stack Development | 0177 | 90 |
| CSE — Cloud Computing | 0179 | 60 |
| CSE — UI/UX | 0181 | 60 |

### Roll Number Format
```
2401730232
│├┤├──┤├──┤
│  │    └── 0232  → Roll number 232
│  └──────  0173  → Course code (CSE-AIML)
└─────────  24    → Enrollment year 2024
```

### Semester Calculation
```
Jan–Jun  →  Even semester (2, 4, 6, 8)
Jul–Nov  →  Odd semester  (1, 3, 5, 7)

yearsDiff = currentYear - enrollmentYear
Even half: semester = yearsDiff × 2
Odd half:  semester = yearsDiff × 2 + 1

Example: Enrolled 2024, Feb 2026
→ yearsDiff=2, even → semester = 4 ✓
```

---

## 🛣 API Routes

### Auth (`/auth`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/landing` | Login page |
| GET | `/auth/faculty-login` | Faculty login form |
| POST | `/auth/login` | Faculty manual login |
| GET | `/auth/azure` | Redirect to Microsoft |
| GET | `/auth/azure/callback` | Azure OAuth2 callback |
| GET | `/auth/logout` | Clear session |

### Student (`/student`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/student/dashboard` | Student dashboard |
| GET | `/student/subjects/:code/materials` | Unit-wise materials |
| GET | `/student/subjects/:code/pyqs` | PYQs with filters |
| GET | `/student/subjects/:code/syllabus` | Syllabus viewer |

### Faculty (`/faculty`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/faculty/dashboard` | Faculty dashboard |
| GET/POST | `/faculty/upload/material` | Material upload |
| GET/POST | `/faculty/upload/pyq` | PYQ upload |
| GET/POST | `/faculty/upload/syllabus` | Syllabus upload |
| POST | `/faculty/material/delete/:id` | Delete material |
| POST | `/faculty/pyq/delete/:id` | Delete PYQ |
| POST | `/faculty/syllabus/delete/:id` | Delete syllabus |
| GET | `/faculty/admin/all-uploads` | Admin panel |
| GET/POST | `/faculty/change-password` | Change password |

### Notifications (`/notifications`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/notifications` | Full notifications page |
| GET | `/notifications/unread-count` | Badge count (JSON) |
| GET | `/notifications/dropdown` | Latest 5 (JSON) |
| POST | `/notifications/:id/read` | Mark one read |
| POST | `/notifications/read-all` | Mark all read |

### Announcements (`/announcements`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/announcements` | List page |
| GET | `/announcements/new` | Post form |
| POST | `/announcements` | Create |
| GET | `/announcements/latest-banner` | Dashboard banner (JSON) |
| POST | `/announcements/:id/pin` | Toggle pin |
| POST | `/announcements/:id/delete` | Delete |

### Bookmarks (`/bookmarks`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/bookmarks` | Saved resources page |
| POST | `/bookmarks/toggle` | Add or remove |
| GET | `/bookmarks/ids` | All bookmarked IDs (JSON) |
| POST | `/bookmarks/remove-all` | Clear all |

### Ratings (`/ratings`)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/ratings/submit` | Submit/update rating |
| GET | `/ratings/my/:subjectCode` | Student's own ratings |
| GET | `/ratings/stats/:subjectCode` | Avg ratings for subject |

### Forum (`/forum`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/forum/:subjectCode` | Forum home |
| GET | `/forum/:subjectCode/post/:id` | Single post |
| POST | `/forum/:subjectCode/new` | Create post |
| POST | `/forum/:subjectCode/post/:id/reply` | Post reply |
| POST | `/forum/post/:id/upvote` | Upvote post |
| POST | `/forum/reply/:id/upvote` | Upvote reply |
| POST | `/forum/post/:id/resolve` | Toggle resolve |
| POST | `/forum/post/:id/pin` | Toggle pin |
| POST | `/forum/post/:id/delete` | Delete post |
| POST | `/forum/reply/:id/official` | Toggle official |

### Bulk Upload (`/bulk`)
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/bulk/upload` | Bulk upload page |
| POST | `/bulk/upload/single` | Upload one file (called per file) |

---

## 🔮 Remaining Features (Planned)

| # | Feature | Status |
|---|---------|--------|
| 8 | Admin User Management Panel | ⏳ Next |
| 9 | Faculty Analytics Dashboard | ⏳ |
| 10 | Portal Usage Analytics (Admin) | ⏳ |
| 11 | Dark Mode | ⏳ |
| 12 | Study Group Creator | ⏳ |
| 13 | PWA — Installable on Mobile | ⏳ |
| 14 | AI Study Assistant (Gemini) | ⏳ Last |
| 15 | AI Mock Test Generator | ⏳ Last |
| 16 | AI Smart Study Planner | ⏳ Last |
| 17 | Deployment (Railway + Atlas + Cloudinary) | ⏳ After features |

---

## 👥 Team

| Member | Role |
|--------|------|
| [Member 1] | Backend Lead & Database Architect |
| [Member 2] | Authentication & Security Engineer |
| [Member 3] | Student Portal Developer |
| [Member 4] | Faculty Portal & Upload System |
| [Member 5] | Frontend & UX Designer |

**Institution:** KR Mangalam University, Gurugram, Haryana  
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