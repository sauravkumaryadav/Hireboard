# HireBoard — Full-Stack MERN Project

> A Job Application Tracker with Kanban board, analytics dashboard, resume uploads, and follow-up reminders. Built to learn full-stack development and showcase in interviews.

> "I built the tool I used to land this job." — That's your interview story.

---

## Why This Project?

- **Learn by building** — Every backend concept (REST APIs, auth, DB, file uploads, cron jobs) learned through real features
- **Interview story** — "I built a job tracker to manage my own applications" is memorable and relatable
- **Not a tutorial clone** — Not a todo app, not an e-commerce store. Unique enough to stand out
- **Covers everything** — Auth, CRUD, file upload, drag-drop, dashboards, charts, reminders, deployment

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TanStack Query, React Beautiful DnD, Chart.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Auth** | JWT + bcryptjs |
| **File Upload** | Multer |
| **Scheduling** | node-cron (for follow-up reminders) |
| **Deployment** | Vercel (frontend) + Render (backend) + MongoDB Atlas |
| **Stretch** | TypeScript migration |

---

## Project Structure

```
hireboard/
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/             # DB connection, env config
│   │   │   └── db.js
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Application.js
│   │   │   ├── Note.js
│   │   │   └── Reminder.js
│   │   ├── routes/             # Express route files
│   │   │   ├── auth.routes.js
│   │   │   ├── application.routes.js
│   │   │   ├── note.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── reminder.routes.js
│   │   ├── controllers/        # Route handler logic
│   │   │   ├── auth.controller.js
│   │   │   ├── application.controller.js
│   │   │   ├── note.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   └── reminder.controller.js
│   │   ├── middleware/         # Auth, error handling, validation
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── validations/        # Joi schemas
│   │   │   ├── auth.validation.js
│   │   │   └── application.validation.js
│   │   ├── utils/              # Helper functions
│   │   │   ├── ApiError.js
│   │   │   └── ApiResponse.js
│   │   ├── uploads/            # Resume files (gitignored)
│   │   └── server.js           # Entry point
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
├── client/                     # Frontend (React)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/
│   │   │   ├── KanbanBoard/
│   │   │   ├── ApplicationCard/
│   │   │   ├── Charts/
│   │   │   └── common/         # Button, Modal, Input, etc.
│   │   ├── pages/              # Page-level components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Board.jsx
│   │   │   ├── ApplicationDetail.jsx
│   │   │   └── Settings.jsx
│   │   ├── services/           # API call functions (axios)
│   │   │   ├── api.js          # Axios instance with interceptors
│   │   │   ├── auth.service.js
│   │   │   └── application.service.js
│   │   ├── context/            # Auth context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom hooks (TanStack Query)
│   │   │   ├── useApplications.js
│   │   │   └── useDashboard.js
│   │   └── App.jsx
│   └── package.json
│
├── PROJECT_SCOPE.md            # This file
└── README.md                   # GitHub readme (add at the end)
```

---

## Features — Phased Approach

### Phase 1: Backend Foundation (Week 1-3)
> Goal: Working Express server with MongoDB CRUD for applications

**Week 1 — Express + First Routes**
- [ ] Project setup — `npm init`, install Express, dotenv, cors, morgan
- [ ] Create `server.js` — basic Express server running on port 5000
- [ ] Folder structure — config, routes, controllers, middleware, models
- [ ] First route — `GET /api/health` returns `{ status: "ok" }`
- [ ] Install & connect MongoDB via Mongoose (`config/db.js`)
- [ ] Create `Application` model (schema with validation)
- [ ] Build `POST /api/applications` — create a job application
- [ ] Build `GET /api/applications` — list all applications

**Week 2 — Full CRUD + Query Features**
- [ ] Build `GET /api/applications/:id` — get single application
- [ ] Build `PUT /api/applications/:id` — update application
- [ ] Build `DELETE /api/applications/:id` — delete application
- [ ] Build `PATCH /api/applications/:id/status` — update status only (for drag-drop)
- [ ] Build `PATCH /api/applications/reorder` — save board column order (for drag-drop)
- [ ] Add query features — `?status=interview&search=google&sort=-appliedDate`
- [ ] Pagination — `?page=1&limit=10`, return total count in response

**Week 3 — Error Handling + Validation**
- [ ] Create `ApiError` class — custom error with statusCode + message
- [ ] Create `ApiResponse` class — consistent `{ success, data, message }` format
- [ ] Global error handling middleware
- [ ] Input validation with Joi — validate create/update payloads
- [ ] Validation middleware — reusable for any route
- [ ] Test all routes with Postman/Thunder Client

---

### Phase 2: Authentication (Week 4-5)
> Goal: Signup, login, protected routes — only see YOUR applications

**Week 4 — Auth System**
- [ ] Create `User` model — name, email, password, createdAt
- [ ] Install bcryptjs — hash password on signup
- [ ] Build `POST /api/auth/signup` — create user, return JWT
- [ ] Build `POST /api/auth/login` — verify credentials, return JWT
- [ ] Build `GET /api/auth/me` — return current user from token
- [ ] Create `auth.middleware.js` — verify JWT, attach `req.user`
- [ ] Protect all `/api/applications` routes with auth middleware

**Week 5 — Ownership + Profile**
- [ ] Add `user` field to Application model (ref to User)
- [ ] Filter applications by `req.user._id` — users only see their own data
- [ ] Ownership check on update/delete — can't modify other users' applications
- [ ] Build `PUT /api/auth/profile` — update name, email
- [ ] Build `PUT /api/auth/change-password` — verify old password, set new one
- [ ] Joi validation for all auth routes

---

### Phase 3: Notes + File Upload + Activity Timeline (Week 6-7)
> Goal: Rich application details — notes, resume, activity history

**Week 6 — Notes System**
- [ ] Create `Note` model — application ref, content, createdAt
- [ ] Build `POST /api/applications/:id/notes` — add a note
- [ ] Build `GET /api/applications/:id/notes` — list notes for an application
- [ ] Build `DELETE /api/applications/:id/notes/:noteId` — delete a note
- [ ] Activity timeline — auto-log status changes (e.g., "Moved to Interview on Apr 15")
- [ ] Build `GET /api/applications/:id/timeline` — combined notes + status changes, sorted by date

**Week 7 — Resume Upload**
- [ ] Install Multer — configure for file uploads
- [ ] Build `POST /api/applications/:id/resume` — upload PDF/DOCX (max 5MB)
- [ ] Build `GET /api/applications/:id/resume` — download/serve the file
- [ ] Build `DELETE /api/applications/:id/resume` — remove file from disk + DB
- [ ] File validation — only allow PDF/DOCX, check file size
- [ ] Store file path in Application model

---

### Phase 4: Dashboard & Analytics APIs (Week 8)
> Goal: Aggregation queries for charts and stats

- [ ] `GET /api/dashboard/stats` — total applications, by status count, this week's count, response rate
- [ ] `GET /api/dashboard/weekly-trend` — applications per week (last 8 weeks) for line chart
- [ ] `GET /api/dashboard/by-status` — count per status for pie/donut chart
- [ ] `GET /api/dashboard/by-source` — count per source (LinkedIn, Naukri, direct, referral)
- [ ] `GET /api/dashboard/response-time` — avg days between "Applied" and first status change
- [ ] All dashboard routes use MongoDB aggregation pipeline (`$group`, `$match`, `$sort`, `$project`)

---

### Phase 5: React Frontend (Week 9-12)
> Goal: Connect your React skills to YOUR backend

**Week 9 — Auth + Layout**
- [ ] Set up React app (Vite), install Tailwind CSS, TanStack Query, React Router
- [ ] AuthContext — login, signup, logout, token storage, protected routes
- [ ] Login page + Signup page — forms connected to your auth API
- [ ] App layout — sidebar navigation, header with user info, logout

**Week 10 — Kanban Board (Core Feature)**
- [ ] Install `@hello-pangea/dnd` (maintained fork of react-beautiful-dnd)
- [ ] Kanban board with 5 columns: Wishlist, Applied, Phone Screen, Interview, Offer, Rejected
- [ ] Application cards — company name, role, date, salary badge
- [ ] Drag & drop between columns — calls `PATCH /status` API on drop
- [ ] Add application modal/form — company, role, url, salary, source, notes
- [ ] Click card to open detail view

**Week 11 — Application Detail + Notes**
- [ ] Application detail page — all fields, edit inline
- [ ] Notes section — add/view/delete notes
- [ ] Activity timeline — visual timeline of status changes + notes
- [ ] Resume upload/download/delete UI
- [ ] Search bar + filter dropdown on board page

**Week 12 — Dashboard + Polish**
- [ ] Dashboard page — stats cards (total, this week, response rate, offers)
- [ ] Line chart — weekly application trend
- [ ] Donut chart — distribution by status
- [ ] Bar chart — applications by source
- [ ] Responsive design — works on mobile
- [ ] Loading states, error states, empty states
- [ ] Toast notifications for actions

---

### Phase 6: Reminders + Deploy (Week 13-14)
> Goal: Follow-up reminders + live deployment

**Week 13 — Reminders**
- [ ] `Reminder` model — application ref, date, message, isCompleted
- [ ] Build `POST /api/reminders` — create reminder
- [ ] Build `GET /api/reminders` — list upcoming reminders
- [ ] Build `PATCH /api/reminders/:id/complete` — mark done
- [ ] Cron job with `node-cron` — check for due reminders daily (log for now, email later)
- [ ] Reminders section in frontend — upcoming follow-ups

**Week 14 — Deployment**
- [ ] Backend deployed on Render (free tier)
- [ ] MongoDB Atlas production cluster
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS configured for production domain
- [ ] Seed script — populate DB with 20+ demo applications across all statuses
- [ ] README.md — screenshots, tech stack, features, setup instructions, live demo link

---

### Phase 7: TypeScript Migration (Week 15-16) — Stretch
> Goal: Convert both frontend and backend to TypeScript

- [ ] Backend — type all models, controllers, middleware, routes
- [ ] Frontend — type API responses, props, hooks, context
- [ ] Shared types/interfaces between frontend and backend

---

## Database Models

### User
```
{
  name: String (required)
  email: String (required, unique, lowercase)
  password: String (required, hashed, min 6 chars)
  createdAt: Date (default: now)
}
```

### Application
```
{
  user: ObjectId (ref: User, required)
  company: String (required)
  role: String (required)
  status: String (enum: wishlist, applied, phone_screen, interview, offer, rejected — default: wishlist)
  jobUrl: String
  salary: { min: Number, max: Number, currency: String }
  location: String
  type: String (enum: remote, onsite, hybrid)
  source: String (enum: linkedin, naukri, indeed, company_website, referral, other)
  appliedDate: Date
  resumePath: String
  order: Number (for drag-drop position within a column)
  createdAt: Date
  updatedAt: Date
}
```

### Note
```
{
  application: ObjectId (ref: Application, required)
  user: ObjectId (ref: User, required)
  content: String (required)
  type: String (enum: note, status_change — default: note)
  createdAt: Date
}
```

### Reminder
```
{
  application: ObjectId (ref: Application, required)
  user: ObjectId (ref: User, required)
  message: String (required)
  dueDate: Date (required)
  isCompleted: Boolean (default: false)
  createdAt: Date
}
```

---

## API Reference (20+ endpoints)

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Create application |
| GET | `/api/applications` | List with filters, sort, pagination |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| PATCH | `/api/applications/:id/status` | Update status (drag-drop) |
| PATCH | `/api/applications/reorder` | Save column order |

### Notes & Timeline
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/:id/notes` | Add note |
| GET | `/api/applications/:id/notes` | List notes |
| DELETE | `/api/applications/:id/notes/:noteId` | Delete note |
| GET | `/api/applications/:id/timeline` | Activity timeline |

### File Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/:id/resume` | Upload resume |
| GET | `/api/applications/:id/resume` | Download resume |
| DELETE | `/api/applications/:id/resume` | Delete resume |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Overview stats |
| GET | `/api/dashboard/weekly-trend` | Weekly applications chart |
| GET | `/api/dashboard/by-status` | Status distribution |
| GET | `/api/dashboard/by-source` | Source distribution |
| GET | `/api/dashboard/response-time` | Avg response time |

### Reminders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reminders` | Create reminder |
| GET | `/api/reminders` | List reminders |
| PATCH | `/api/reminders/:id/complete` | Mark complete |

---

## Backend Concepts Covered

```
Express.js
├── Routing (GET, POST, PUT, PATCH, DELETE)
├── Middleware (auth, error, validation, CORS, morgan)
├── File uploads (Multer)
├── Request validation (Joi)
├── Environment config (dotenv)
└── Project structure (MVC pattern)

MongoDB + Mongoose
├── Schema design & validation
├── CRUD operations
├── References & Population
├── Aggregation pipeline ($group, $match, $sort, $project)
├── Indexes
├── Query helpers (filter, sort, paginate)
└── Pre/post hooks

Authentication & Security
├── Password hashing (bcryptjs)
├── JWT creation & verification
├── Protected routes
├── Ownership-based access control
├── Helmet (security headers)
├── Rate limiting
└── CORS configuration

Production Patterns
├── Custom error classes
├── Consistent API response format
├── Centralized error handling
├── Request logging
├── File management
├── Cron jobs (node-cron)
└── Deployment & environment management
```

---

## Learning Milestones

| Phase | What You Learn |
|-------|---------------|
| 1 | Express, REST API design, MongoDB, Mongoose, CRUD, validation, error handling |
| 2 | Authentication, JWT, bcrypt, middleware chain, ownership-based access |
| 3 | Sub-resources (notes), file upload/download, activity logging patterns |
| 4 | MongoDB aggregation pipeline, analytics queries, reporting |
| 5 | Full-stack integration, auth flow, drag-drop, charts, React + your own API |
| 6 | Cron jobs, deployment, production config, seeding, documentation |
| 7 | TypeScript in Node.js + React |

---

## How We'll Work

- **1 hour daily (weekdays)** — focused coding sessions
- **Weekend sessions (3-4 hrs)** — build features, refactor, test
- **Learn by doing** — build first, research when stuck, no tutorial hell
- **Git discipline** — commit daily, meaningful messages, push to GitHub
- **Each phase = working state** — app is functional at every checkpoint
- **Ask Claude** — paste errors, ask "why", get explanations while building

---

## Getting Started

Phase 1, Day 1:
1. `cd server && npm init -y`
2. `npm install express dotenv cors morgan`
3. Create `src/server.js`
4. Build `GET /api/health` endpoint
5. Run with `node src/server.js` — see `{ status: "ok" }` in browser
6. Git init, first commit, push to GitHub

Let's build.
