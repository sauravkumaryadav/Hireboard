# HireBoard Full-Stack Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack MERN Job Application Tracker with Kanban board, analytics dashboard, resume uploads, and follow-up reminders.

**Architecture:** Express.js REST API backend with MongoDB/Mongoose, serving a React 18 frontend with Vite. JWT auth protects all routes. Backend follows MVC pattern (routes -> controllers -> models). Frontend uses TanStack Query for server state, React Router for navigation, and Tailwind CSS for styling.

**Tech Stack:** Node.js, Express.js, MongoDB/Mongoose, JWT/bcryptjs, React 18, Vite, TanStack Query, @hello-pangea/dnd, Chart.js, Tailwind CSS, Multer, node-cron, Joi

---

## Pre-requisites

- **Node.js 18+** required (TanStack Query v5 needs it). Run `node --version`. If v16, upgrade via https://nodejs.org
- **MongoDB Atlas** account — create free cluster at https://cloud.mongodb.com
- **Git** — already installed

---

## File Structure

### Backend (`server/`)

```
server/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection via Mongoose
│   ├── models/
│   │   ├── User.js                  # User schema + password hashing hook
│   │   ├── Application.js           # Job application schema + indexes
│   │   ├── Note.js                  # Notes/activity log schema
│   │   └── Reminder.js              # Follow-up reminder schema
│   ├── routes/
│   │   ├── auth.routes.js           # /api/auth/* routes
│   │   ├── application.routes.js    # /api/applications/* routes
│   │   ├── note.routes.js           # /api/applications/:id/notes routes
│   │   ├── dashboard.routes.js      # /api/dashboard/* routes
│   │   └── reminder.routes.js       # /api/reminders/* routes
│   ├── controllers/
│   │   ├── auth.controller.js       # Signup, login, profile handlers
│   │   ├── application.controller.js# CRUD + status + reorder handlers
│   │   ├── note.controller.js       # Note CRUD + timeline handler
│   │   ├── dashboard.controller.js  # Aggregation query handlers
│   │   └── reminder.controller.js   # Reminder CRUD + cron handler
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT verification, attach req.user
│   │   ├── error.middleware.js       # Global error handler
│   │   └── validate.middleware.js    # Joi validation wrapper
│   ├── validations/
│   │   ├── auth.validation.js       # Signup/login/profile Joi schemas
│   │   └── application.validation.js# Create/update application Joi schemas
│   ├── utils/
│   │   ├── ApiError.js              # Custom error class with statusCode
│   │   └── ApiResponse.js           # Consistent { success, data, message }
│   ├── uploads/                     # Resume files (gitignored)
│   └── server.js                    # Express app entry point
├── .env                             # Environment variables (gitignored)
├── .gitignore
└── package.json
```

### Frontend (`client/`)

```
client/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.jsx          # Navigation sidebar
│   │   │   ├── Header.jsx           # Top header with user info
│   │   │   └── AppLayout.jsx        # Layout wrapper
│   │   ├── KanbanBoard/
│   │   │   ├── KanbanBoard.jsx      # Board with drag-drop columns
│   │   │   ├── KanbanColumn.jsx     # Single status column
│   │   │   └── ApplicationCard.jsx  # Card in column
│   │   ├── Charts/
│   │   │   ├── WeeklyTrendChart.jsx # Line chart
│   │   │   ├── StatusChart.jsx      # Donut chart
│   │   │   └── SourceChart.jsx      # Bar chart
│   │   └── common/
│   │       ├── Button.jsx           # Reusable button
│   │       ├── Modal.jsx            # Reusable modal
│   │       ├── Input.jsx            # Form input
│   │       ├── LoadingSpinner.jsx   # Loading state
│   │       ├── EmptyState.jsx       # Empty state display
│   │       └── Toast.jsx            # Notification toast
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Board.jsx
│   │   ├── ApplicationDetail.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── api.js                   # Axios instance + interceptors
│   │   ├── auth.service.js          # Auth API calls
│   │   ├── application.service.js   # Application API calls
│   │   ├── dashboard.service.js     # Dashboard API calls
│   │   └── reminder.service.js      # Reminder API calls
│   ├── context/
│   │   └── AuthContext.jsx          # Auth state + token management
│   ├── hooks/
│   │   ├── useApplications.js       # TanStack Query hooks for applications
│   │   ├── useDashboard.js          # TanStack Query hooks for dashboard
│   │   └── useReminders.js          # TanStack Query hooks for reminders
│   ├── App.jsx                      # Router + providers
│   ├── main.jsx                     # Vite entry point
│   └── index.css                    # Tailwind imports
├── index.html
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Chunk 1: Project Setup & Backend Foundation

### Task 1: Initialize Backend Project

**Files:**
- Create: `server/package.json`
- Create: `server/.gitignore`
- Create: `server/.env`
- Create: `server/src/server.js`

- [ ] **Step 1: Initialize server project**

```bash
cd server
npm init -y
npm install express dotenv cors morgan helmet express-rate-limit
npm install -D nodemon
```

- [ ] **Step 2: Create .gitignore**

```
node_modules/
.env
src/uploads/*
!src/uploads/.gitkeep
```

- [ ] **Step 3: Create .env file**

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hireboard
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

- [ ] **Step 4: Create server.js entry point**

```javascript
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

- [ ] **Step 5: Add scripts to package.json**

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

- [ ] **Step 6: Test health endpoint**

Run: `cd server && npm run dev`
Visit: `http://localhost:5000/api/health`
Expected: `{ "status": "ok", "timestamp": "..." }`

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: initialize Express server with health endpoint"
```

---

### Task 2: MongoDB Connection

**Files:**
- Create: `server/src/config/db.js`
- Modify: `server/src/server.js`
- Install: `mongoose`

- [ ] **Step 1: Install Mongoose**

```bash
cd server && npm install mongoose
```

- [ ] **Step 2: Create db.js**

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```

- [ ] **Step 3: Wire DB connection into server.js**

Add before `app.listen()`:

```javascript
const connectDB = require('./config/db');

// Connect to MongoDB then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
```

- [ ] **Step 4: Test connection**

Run: `npm run dev`
Expected: `MongoDB connected: <cluster-host>` then `Server running on port 5000`

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add MongoDB connection via Mongoose"
```

---

### Task 3: Utility Classes (ApiError + ApiResponse)

**Files:**
- Create: `server/src/utils/ApiError.js`
- Create: `server/src/utils/ApiResponse.js`

- [ ] **Step 1: Create ApiError class**

```javascript
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
```

- [ ] **Step 2: Create ApiResponse class**

```javascript
class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  static ok(data, message) {
    return new ApiResponse(200, data, message);
  }

  static created(data, message = 'Created successfully') {
    return new ApiResponse(201, data, message);
  }
}

module.exports = ApiResponse;
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add ApiError and ApiResponse utility classes"
```

---

### Task 4: Error Handling & Validation Middleware

**Files:**
- Create: `server/src/middleware/error.middleware.js`
- Create: `server/src/middleware/validate.middleware.js`
- Install: `joi`
- Modify: `server/src/server.js`

- [ ] **Step 1: Install Joi**

```bash
cd server && npm install joi
```

- [ ] **Step 2: Create error middleware**

```javascript
const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(e => e.message).join(', ');
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
```

- [ ] **Step 3: Create validation middleware**

```javascript
const ApiError = require('../utils/ApiError');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    return next(new ApiError(400, message));
  }
  next();
};

module.exports = validate;
```

- [ ] **Step 4: Wire error middleware into server.js**

Add at the end (after all routes):

```javascript
const errorHandler = require('./middleware/error.middleware');
app.use(errorHandler);
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add error handling and validation middleware"
```

---

### Task 5: Application Model

**Files:**
- Create: `server/src/models/Application.js`

- [ ] **Step 1: Create Application model**

```javascript
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected'],
      default: 'wishlist',
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    salary: {
      min: Number,
      max: Number,
      currency: { type: String, default: 'INR' },
    },
    location: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
    },
    source: {
      type: String,
      enum: ['linkedin', 'naukri', 'indeed', 'company_website', 'referral', 'other'],
    },
    appliedDate: {
      type: Date,
    },
    resumePath: {
      type: String,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common queries
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Application', applicationSchema);
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Application Mongoose model with indexes"
```

---

### Task 6: Application Validation Schemas

**Files:**
- Create: `server/src/validations/application.validation.js`

- [ ] **Step 1: Create Joi validation schemas**

```javascript
const Joi = require('joi');

const createApplication = Joi.object({
  company: Joi.string().trim().required(),
  role: Joi.string().trim().required(),
  status: Joi.string().valid('wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected'),
  jobUrl: Joi.string().uri().allow(''),
  salary: Joi.object({
    min: Joi.number().min(0),
    max: Joi.number().min(0),
    currency: Joi.string(),
  }),
  location: Joi.string().trim().allow(''),
  type: Joi.string().valid('remote', 'onsite', 'hybrid'),
  source: Joi.string().valid('linkedin', 'naukri', 'indeed', 'company_website', 'referral', 'other'),
  appliedDate: Joi.date(),
});

const updateApplication = Joi.object({
  company: Joi.string().trim(),
  role: Joi.string().trim(),
  status: Joi.string().valid('wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected'),
  jobUrl: Joi.string().uri().allow(''),
  salary: Joi.object({
    min: Joi.number().min(0),
    max: Joi.number().min(0),
    currency: Joi.string(),
  }),
  location: Joi.string().trim().allow(''),
  type: Joi.string().valid('remote', 'onsite', 'hybrid'),
  source: Joi.string().valid('linkedin', 'naukri', 'indeed', 'company_website', 'referral', 'other'),
  appliedDate: Joi.date(),
}).min(1);

const updateStatus = Joi.object({
  status: Joi.string()
    .valid('wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected')
    .required(),
});

const reorder = Joi.object({
  items: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      status: Joi.string().valid('wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected').required(),
      order: Joi.number().required(),
    })
  ).required(),
});

module.exports = { createApplication, updateApplication, updateStatus, reorder };
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add Joi validation schemas for applications"
```

---

### Task 7: Application Controller (CRUD + Query Features)

**Files:**
- Create: `server/src/controllers/application.controller.js`

- [ ] **Step 1: Create application controller**

```javascript
const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

// POST /api/applications
exports.create = async (req, res, next) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(ApiResponse.created(application));
  } catch (error) {
    next(error);
  }
};

// GET /api/applications?status=&search=&sort=&page=&limit=
exports.getAll = async (req, res, next) => {
  try {
    const { status, search, sort = '-createdAt', page = 1, limit = 20 } = req.query;

    const filter = { user: req.user._id };

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [applications, total] = await Promise.all([
      Application.find(filter).sort(sort).skip(skip).limit(Number(limit)),
      Application.countDocuments(filter),
    ]);

    res.json(ApiResponse.ok({
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    }));
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/:id
exports.getById = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    res.json(ApiResponse.ok(application));
  } catch (error) {
    next(error);
  }
};

// PUT /api/applications/:id
exports.update = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    res.json(ApiResponse.ok(application, 'Updated successfully'));
  } catch (error) {
    next(error);
  }
};

// DELETE /api/applications/:id
exports.remove = async (req, res, next) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    res.json(ApiResponse.ok(null, 'Deleted successfully'));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/status
exports.updateStatus = async (req, res, next) => {
  try {
    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    if (!application) {
      throw new ApiError(404, 'Application not found');
    }

    res.json(ApiResponse.ok(application, 'Status updated'));
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/reorder
exports.reorder = async (req, res, next) => {
  try {
    const ops = req.body.items.map(item => ({
      updateOne: {
        filter: { _id: item.id, user: req.user._id },
        update: { status: item.status, order: item.order },
      },
    }));

    await Application.bulkWrite(ops);
    res.json(ApiResponse.ok(null, 'Reordered successfully'));
  } catch (error) {
    next(error);
  }
};
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add application controller with CRUD, filters, and reorder"
```

---

### Task 8: Application Routes

**Files:**
- Create: `server/src/routes/application.routes.js`
- Modify: `server/src/server.js` (register routes)

- [ ] **Step 1: Create application routes**

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/application.controller');
const validate = require('../middleware/validate.middleware');
const { createApplication, updateApplication, updateStatus, reorder } = require('../validations/application.validation');

// Note: auth middleware will be added in Phase 2
// For now, we'll add a temporary req.user mock for testing

router.post('/', validate(createApplication), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', validate(updateApplication), controller.update);
router.delete('/:id', controller.remove);
router.patch('/:id/status', validate(updateStatus), controller.updateStatus);
router.patch('/reorder', validate(reorder), controller.reorder);

module.exports = router;
```

- [ ] **Step 2: Register routes in server.js**

Add before error handler:

```javascript
// Routes
app.use('/api/applications', require('./routes/application.routes'));
```

- [ ] **Step 3: Add temporary mock user middleware for testing (remove in Phase 2)**

In `server.js`, add before routes:

```javascript
// TEMPORARY: Mock user for testing (remove when auth is added)
app.use((req, res, next) => {
  req.user = { _id: '000000000000000000000000' };
  next();
});
```

- [ ] **Step 4: Test all endpoints with Postman/Thunder Client**

- POST `/api/applications` with `{ "company": "Google", "role": "SDE" }`
- GET `/api/applications`
- GET `/api/applications/:id`
- PUT `/api/applications/:id` with `{ "role": "SDE-2" }`
- PATCH `/api/applications/:id/status` with `{ "status": "applied" }`
- DELETE `/api/applications/:id`

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add application routes with validation"
```

---

## Chunk 2: Authentication System

### Task 9: User Model

**Files:**
- Create: `server/src/models/User.js`
- Install: `bcryptjs jsonwebtoken`

- [ ] **Step 1: Install auth dependencies**

```bash
cd server && npm install bcryptjs jsonwebtoken
```

- [ ] **Step 2: Create User model**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add User model with password hashing"
```

---

### Task 10: Auth Validation, Controller & Routes

**Files:**
- Create: `server/src/validations/auth.validation.js`
- Create: `server/src/controllers/auth.controller.js`
- Create: `server/src/routes/auth.routes.js`
- Create: `server/src/middleware/auth.middleware.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Create auth validation schemas**

```javascript
const Joi = require('joi');

const signup = Joi.object({
  name: Joi.string().trim().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const login = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const updateProfile = Joi.object({
  name: Joi.string().trim(),
  email: Joi.string().email(),
}).min(1);

const changePassword = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = { signup, login, updateProfile, changePassword };
```

- [ ] **Step 2: Create auth controller**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'Email already registered');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json(ApiResponse.created({
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    }));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken(user._id);

    res.json(ApiResponse.ok({
      user: { _id: user._id, name: user.name, email: user.email },
      token,
    }));
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(ApiResponse.ok(user));
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json(ApiResponse.ok(user, 'Profile updated'));
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    const { currentPassword, newPassword } = req.body;

    if (!(await user.comparePassword(currentPassword))) {
      throw new ApiError(400, 'Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json(ApiResponse.ok(null, 'Password changed successfully'));
  } catch (error) {
    next(error);
  }
};
```

- [ ] **Step 3: Create auth middleware**

```javascript
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new ApiError(401, 'Not authorized — no token');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new ApiError(401, 'Invalid token'));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    next(error);
  }
};

module.exports = protect;
```

- [ ] **Step 4: Create auth routes**

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const validate = require('../middleware/validate.middleware');
const { signup, login, updateProfile, changePassword } = require('../validations/auth.validation');
const protect = require('../middleware/auth.middleware');

router.post('/signup', validate(signup), controller.signup);
router.post('/login', validate(login), controller.login);
router.get('/me', protect, controller.getMe);
router.put('/profile', protect, validate(updateProfile), controller.updateProfile);
router.put('/change-password', protect, validate(changePassword), controller.changePassword);

module.exports = router;
```

- [ ] **Step 5: Update server.js — remove mock user, add auth routes, protect application routes**

```javascript
// Remove the TEMPORARY mock user middleware

// Routes
app.use('/api/auth', require('./routes/auth.routes'));

const protect = require('./middleware/auth.middleware');
app.use('/api/applications', protect, require('./routes/application.routes'));
```

- [ ] **Step 6: Test auth flow**

1. POST `/api/auth/signup` — `{ "name": "Test", "email": "test@test.com", "password": "123456" }`
2. POST `/api/auth/login` — `{ "email": "test@test.com", "password": "123456" }`
3. Copy token, add `Authorization: Bearer <token>` header
4. GET `/api/auth/me` — should return user
5. POST `/api/applications` with auth header — should work
6. POST `/api/applications` without header — should get 401

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add JWT authentication with signup, login, and protected routes"
```

---

## Chunk 3: Notes, File Upload & Dashboard APIs

### Task 11: Note Model, Controller & Routes

**Files:**
- Create: `server/src/models/Note.js`
- Create: `server/src/controllers/note.controller.js`
- Create: `server/src/routes/note.routes.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Create Note model**

```javascript
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: [true, 'Note content is required'],
  },
  type: {
    type: String,
    enum: ['note', 'status_change'],
    default: 'note',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

noteSchema.index({ application: 1, createdAt: -1 });

module.exports = mongoose.model('Note', noteSchema);
```

- [ ] **Step 2: Create note controller**

```javascript
const Note = require('../models/Note');
const Application = require('../models/Application');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.addNote = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!application) throw new ApiError(404, 'Application not found');

    const note = await Note.create({
      application: req.params.id,
      user: req.user._id,
      content: req.body.content,
    });

    res.status(201).json(ApiResponse.created(note));
  } catch (error) {
    next(error);
  }
};

exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ application: req.params.id })
      .sort('-createdAt');
    res.json(ApiResponse.ok(notes));
  } catch (error) {
    next(error);
  }
};

exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.noteId,
      user: req.user._id,
    });
    if (!note) throw new ApiError(404, 'Note not found');
    res.json(ApiResponse.ok(null, 'Note deleted'));
  } catch (error) {
    next(error);
  }
};

exports.getTimeline = async (req, res, next) => {
  try {
    const notes = await Note.find({ application: req.params.id })
      .sort('-createdAt');
    res.json(ApiResponse.ok(notes));
  } catch (error) {
    next(error);
  }
};
```

- [ ] **Step 3: Update application controller — auto-log status changes**

Add to the `updateStatus` function in `application.controller.js`, after the update:

```javascript
// Auto-log status change as a note
const Note = require('../models/Note');
// ... inside updateStatus, after finding the old application:
const oldStatus = (await Application.findById(req.params.id)).status;
// after update:
if (oldStatus !== application.status) {
  await Note.create({
    application: application._id,
    user: req.user._id,
    content: `Status changed from ${oldStatus} to ${application.status}`,
    type: 'status_change',
  });
}
```

- [ ] **Step 4: Create note routes**

```javascript
const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/note.controller');

router.post('/', controller.addNote);
router.get('/', controller.getNotes);
router.delete('/:noteId', controller.deleteNote);
router.get('/timeline', controller.getTimeline);

module.exports = router;
```

- [ ] **Step 5: Register in server.js**

```javascript
app.use('/api/applications/:id/notes', protect, require('./routes/note.routes'));
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: add notes system with auto status change logging"
```

---

### Task 12: Resume File Upload (Multer)

**Files:**
- Install: `multer`
- Create: `server/src/uploads/.gitkeep`
- Modify: `server/src/controllers/application.controller.js`
- Modify: `server/src/routes/application.routes.js`

- [ ] **Step 1: Install Multer**

```bash
cd server && npm install multer
```

- [ ] **Step 2: Create uploads directory**

```bash
mkdir -p server/src/uploads && touch server/src/uploads/.gitkeep
```

- [ ] **Step 3: Add upload endpoints to application controller**

Add to `application.controller.js`:

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.docx', '.doc'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Only PDF and DOCX files are allowed'), false);
  }
};

exports.upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file uploaded');

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { resumePath: req.file.filename },
      { new: true }
    );

    if (!application) {
      fs.unlinkSync(req.file.path);
      throw new ApiError(404, 'Application not found');
    }

    res.json(ApiResponse.ok(application, 'Resume uploaded'));
  } catch (error) {
    next(error);
  }
};

exports.downloadResume = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application || !application.resumePath) {
      throw new ApiError(404, 'Resume not found');
    }

    const filePath = path.join(__dirname, '../uploads', application.resumePath);
    res.download(filePath);
  } catch (error) {
    next(error);
  }
};

exports.deleteResume = async (req, res, next) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!application || !application.resumePath) {
      throw new ApiError(404, 'Resume not found');
    }

    const filePath = path.join(__dirname, '../uploads', application.resumePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    application.resumePath = undefined;
    await application.save();

    res.json(ApiResponse.ok(null, 'Resume deleted'));
  } catch (error) {
    next(error);
  }
};
```

- [ ] **Step 4: Add resume routes to application.routes.js**

```javascript
const { upload } = require('../controllers/application.controller');

router.post('/:id/resume', upload.single('resume'), controller.uploadResume);
router.get('/:id/resume', controller.downloadResume);
router.delete('/:id/resume', controller.deleteResume);
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add resume upload/download/delete with Multer"
```

---

### Task 13: Dashboard Analytics APIs

**Files:**
- Create: `server/src/controllers/dashboard.controller.js`
- Create: `server/src/routes/dashboard.routes.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Create dashboard controller**

```javascript
const mongoose = require('mongoose');
const Application = require('../models/Application');
const ApiResponse = require('../utils/ApiResponse');

exports.getStats = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const [total, byStatus, thisWeek] = await Promise.all([
      Application.countDocuments({ user: userId }),
      Application.aggregate([
        { $match: { user: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Application.countDocuments({
        user: userId,
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    const statusCounts = {};
    byStatus.forEach(s => { statusCounts[s._id] = s.count; });

    const responseRate = total > 0
      ? ((statusCounts.phone_screen || 0) + (statusCounts.interview || 0) + (statusCounts.offer || 0)) / total
      : 0;

    res.json(ApiResponse.ok({
      total,
      thisWeek,
      byStatus: statusCounts,
      responseRate: Math.round(responseRate * 100),
    }));
  } catch (error) {
    next(error);
  }
};

exports.weeklyTrend = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const eightWeeksAgo = new Date(Date.now() - 56 * 24 * 60 * 60 * 1000);

    const trend = await Application.aggregate([
      { $match: { user: userId, createdAt: { $gte: eightWeeksAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%U', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(ApiResponse.ok(trend));
  } catch (error) {
    next(error);
  }
};

exports.byStatus = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Application.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.json(ApiResponse.ok(data));
  } catch (error) {
    next(error);
  }
};

exports.bySource = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Application.aggregate([
      { $match: { user: userId, source: { $ne: null } } },
      { $group: { _id: '$source', count: { $sum: 1 } } },
    ]);

    res.json(ApiResponse.ok(data));
  } catch (error) {
    next(error);
  }
};

exports.responseTime = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const data = await Application.aggregate([
      {
        $match: {
          user: userId,
          status: { $in: ['phone_screen', 'interview', 'offer'] },
          appliedDate: { $ne: null },
        },
      },
      {
        $project: {
          daysDiff: {
            $divide: [
              { $subtract: ['$updatedAt', '$appliedDate'] },
              1000 * 60 * 60 * 24,
            ],
          },
        },
      },
      { $group: { _id: null, avgDays: { $avg: '$daysDiff' } } },
    ]);

    res.json(ApiResponse.ok({
      avgResponseDays: data.length ? Math.round(data[0].avgDays) : null,
    }));
  } catch (error) {
    next(error);
  }
};
```

- [ ] **Step 2: Create dashboard routes**

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/dashboard.controller');

router.get('/stats', controller.getStats);
router.get('/weekly-trend', controller.weeklyTrend);
router.get('/by-status', controller.byStatus);
router.get('/by-source', controller.bySource);
router.get('/response-time', controller.responseTime);

module.exports = router;
```

- [ ] **Step 3: Register in server.js**

```javascript
app.use('/api/dashboard', protect, require('./routes/dashboard.routes'));
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add dashboard analytics APIs with MongoDB aggregation"
```

---

### Task 14: Reminder Model, Controller, Routes & Cron

**Files:**
- Create: `server/src/models/Reminder.js`
- Create: `server/src/controllers/reminder.controller.js`
- Create: `server/src/routes/reminder.routes.js`
- Install: `node-cron`
- Modify: `server/src/server.js`

- [ ] **Step 1: Install node-cron**

```bash
cd server && npm install node-cron
```

- [ ] **Step 2: Create Reminder model**

```javascript
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: [true, 'Reminder message is required'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

reminderSchema.index({ user: 1, dueDate: 1 });

module.exports = mongoose.model('Reminder', reminderSchema);
```

- [ ] **Step 3: Create reminder controller**

```javascript
const Reminder = require('../models/Reminder');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.create = async (req, res, next) => {
  try {
    const reminder = await Reminder.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(ApiResponse.created(reminder));
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ user: req.user._id })
      .populate('application', 'company role')
      .sort('dueDate');
    res.json(ApiResponse.ok(reminders));
  } catch (error) {
    next(error);
  }
};

exports.markComplete = async (req, res, next) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isCompleted: true },
      { new: true }
    );
    if (!reminder) throw new ApiError(404, 'Reminder not found');
    res.json(ApiResponse.ok(reminder, 'Marked complete'));
  } catch (error) {
    next(error);
  }
};
```

- [ ] **Step 4: Create reminder routes**

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/reminder.controller');

router.post('/', controller.create);
router.get('/', controller.getAll);
router.patch('/:id/complete', controller.markComplete);

module.exports = router;
```

- [ ] **Step 5: Add cron job to server.js**

```javascript
const cron = require('node-cron');
const Reminder = require('./models/Reminder');

// Check for due reminders every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {
    const dueReminders = await Reminder.find({
      dueDate: { $lte: new Date() },
      isCompleted: false,
    }).populate('application', 'company role');

    dueReminders.forEach(r => {
      console.log(`[REMINDER] ${r.application.company} - ${r.application.role}: ${r.message}`);
    });
  } catch (error) {
    console.error('Cron error:', error);
  }
});
```

- [ ] **Step 6: Register in server.js**

```javascript
app.use('/api/reminders', protect, require('./routes/reminder.routes'));
```

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: add reminders with CRUD and daily cron job"
```

---

## Chunk 4: React Frontend Setup & Auth

### Task 15: Initialize React + Vite + Tailwind

**Files:**
- Create entire `client/` directory via Vite scaffold
- Configure: `tailwind.config.js`, `postcss.config.js`, `vite.config.js`

- [ ] **Step 1: Scaffold React app with Vite**

```bash
cd hireboard
npm create vite@latest client -- --template react
cd client
npm install
```

- [ ] **Step 2: Install frontend dependencies**

```bash
npm install axios react-router-dom @tanstack/react-query @hello-pangea/dnd chart.js react-chartjs-2 react-hot-toast
npm install -D tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Configure Tailwind via Vite plugin**

In `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
```

In `src/index.css`:

```css
@import "tailwindcss";
```

- [ ] **Step 4: Clean up default Vite files**

Remove `src/App.css`, default content from `App.jsx`. Set up basic App:

```jsx
function App() {
  return <h1 className="text-3xl font-bold text-center mt-10">HireBoard</h1>;
}
export default App;
```

- [ ] **Step 5: Verify it works**

Run: `npm run dev`
Visit: `http://localhost:3000`
Expected: "HireBoard" heading with Tailwind styling

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: initialize React frontend with Vite and Tailwind CSS"
```

---

### Task 16: Axios Instance & Auth Service

**Files:**
- Create: `client/src/services/api.js`
- Create: `client/src/services/auth.service.js`

- [ ] **Step 1: Create Axios instance with interceptors**

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
```

- [ ] **Step 2: Create auth service**

```javascript
import api from './api';

export const authService = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add Axios instance and auth service"
```

---

### Task 17: Auth Context & Protected Routes

**Files:**
- Create: `client/src/context/AuthContext.jsx`

- [ ] **Step 1: Create AuthContext**

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authService.getMe()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res;
  };

  const signup = async (data) => {
    const res = await authService.signup(data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add AuthContext with login, signup, logout"
```

---

### Task 18: Login & Signup Pages

**Files:**
- Create: `client/src/pages/Login.jsx`
- Create: `client/src/pages/Signup.jsx`

- [ ] **Step 1: Create Login page**

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Sign in to HireBoard</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Signup page**

```jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(form);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add Login and Signup pages"
```

---

### Task 19: App Layout (Sidebar + Header)

**Files:**
- Create: `client/src/components/Layout/Sidebar.jsx`
- Create: `client/src/components/Layout/Header.jsx`
- Create: `client/src/components/Layout/AppLayout.jsx`

- [ ] **Step 1: Create Sidebar**

```jsx
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/board', label: 'Board', icon: '📋' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen p-4">
      <h1 className="text-xl font-bold mb-8 px-2">HireBoard</h1>
      <nav className="space-y-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'
              }`
            }
          >
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
```

- [ ] **Step 2: Create Header**

```jsx
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-800">Job Application Tracker</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.name}</span>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create AppLayout**

```jsx
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add app layout with sidebar and header"
```

---

### Task 20: App Router Setup

**Files:**
- Modify: `client/src/App.jsx`
- Modify: `client/src/main.jsx`

- [ ] **Step 1: Set up App.jsx with router**

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Board from './pages/Board';
import ApplicationDetail from './pages/ApplicationDetail';
import Settings from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/board" element={<Board />} />
              <Route path="/applications/:id" element={<ApplicationDetail />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 2: Create placeholder pages**

Create `Dashboard.jsx`, `Board.jsx`, `ApplicationDetail.jsx`, `Settings.jsx` as simple placeholders:

```jsx
// Each page:
export default function PageName() {
  return <div><h1 className="text-2xl font-bold">Page Name</h1></div>;
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: set up React Router with all routes and placeholder pages"
```

---

## Chunk 5: Kanban Board (Core Feature)

### Task 21: Application Service & Hooks

**Files:**
- Create: `client/src/services/application.service.js`
- Create: `client/src/hooks/useApplications.js`

- [ ] **Step 1: Create application service**

```javascript
import api from './api';

export const applicationService = {
  getAll: (params) => api.get('/applications', { params }),
  getById: (id) => api.get(`/applications/${id}`),
  create: (data) => api.post('/applications', data),
  update: (id, data) => api.put(`/applications/${id}`, data),
  remove: (id) => api.delete(`/applications/${id}`),
  updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
  reorder: (items) => api.patch('/applications/reorder', { items }),
  getNotes: (id) => api.get(`/applications/${id}/notes`),
  addNote: (id, content) => api.post(`/applications/${id}/notes`, { content }),
  deleteNote: (id, noteId) => api.delete(`/applications/${id}/notes/${noteId}`),
  getTimeline: (id) => api.get(`/applications/${id}/notes/timeline`),
  uploadResume: (id, file) => {
    const formData = new FormData();
    formData.append('resume', file);
    return api.post(`/applications/${id}/resume`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  downloadResume: (id) => api.get(`/applications/${id}/resume`, { responseType: 'blob' }),
  deleteResume: (id) => api.delete(`/applications/${id}/resume`),
};
```

- [ ] **Step 2: Create TanStack Query hooks**

```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/application.service';

export function useApplications(params) {
  return useQuery({
    queryKey: ['applications', params],
    queryFn: () => applicationService.getAll(params),
  });
}

export function useApplication(id) {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationService.getById(id),
    enabled: !!id,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useUpdateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => applicationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application'] });
    },
  });
}

export function useDeleteApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => applicationService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}

export function useReorder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applicationService.reorder,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications'] }),
  });
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add application service and TanStack Query hooks"
```

---

### Task 22: Kanban Board Components

**Files:**
- Create: `client/src/components/KanbanBoard/ApplicationCard.jsx`
- Create: `client/src/components/KanbanBoard/KanbanColumn.jsx`
- Create: `client/src/components/KanbanBoard/KanbanBoard.jsx`

- [ ] **Step 1: Create ApplicationCard**

```jsx
import { Draggable } from '@hello-pangea/dnd';
import { useNavigate } from 'react-router-dom';

const sourceColors = {
  linkedin: 'bg-blue-100 text-blue-700',
  naukri: 'bg-purple-100 text-purple-700',
  indeed: 'bg-orange-100 text-orange-700',
  referral: 'bg-green-100 text-green-700',
  company_website: 'bg-gray-100 text-gray-700',
  other: 'bg-gray-100 text-gray-600',
};

export default function ApplicationCard({ application, index }) {
  const navigate = useNavigate();

  return (
    <Draggable draggableId={application._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={() => navigate(`/applications/${application._id}`)}
          className={`bg-white p-3 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow ${
            snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-300' : ''
          }`}
        >
          <h4 className="font-medium text-sm text-gray-900">{application.company}</h4>
          <p className="text-xs text-gray-500 mt-1">{application.role}</p>
          <div className="flex items-center gap-2 mt-2">
            {application.source && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${sourceColors[application.source] || sourceColors.other}`}>
                {application.source}
              </span>
            )}
            {application.salary?.max && (
              <span className="text-xs text-gray-500">
                {application.salary.currency || '₹'}{(application.salary.max / 100000).toFixed(0)}L
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
```

- [ ] **Step 2: Create KanbanColumn**

```jsx
import { Droppable } from '@hello-pangea/dnd';
import ApplicationCard from './ApplicationCard';

const statusLabels = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  phone_screen: 'Phone Screen',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const statusColors = {
  wishlist: 'bg-gray-200',
  applied: 'bg-blue-200',
  phone_screen: 'bg-yellow-200',
  interview: 'bg-purple-200',
  offer: 'bg-green-200',
  rejected: 'bg-red-200',
};

export default function KanbanColumn({ status, applications }) {
  return (
    <div className="flex-shrink-0 w-72">
      <div className={`rounded-t-lg px-3 py-2 ${statusColors[status]}`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{statusLabels[status]}</h3>
          <span className="text-xs bg-white/60 px-2 py-0.5 rounded-full">
            {applications.length}
          </span>
        </div>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-2 space-y-2 min-h-[200px] rounded-b-lg border border-t-0 border-gray-200 ${
              snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
            }`}
          >
            {applications
              .sort((a, b) => a.order - b.order)
              .map((app, index) => (
                <ApplicationCard key={app._id} application={app} index={index} />
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
```

- [ ] **Step 3: Create KanbanBoard**

```jsx
import { DragDropContext } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import { useUpdateStatus, useReorder } from '../../hooks/useApplications';

const STATUSES = ['wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'rejected'];

export default function KanbanBoard({ applications }) {
  const updateStatus = useUpdateStatus();
  const reorder = useReorder();

  const columns = STATUSES.reduce((acc, status) => {
    acc[status] = applications.filter(app => app.status === status);
    return acc;
  }, {});

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic: update status
    updateStatus.mutate({ id: draggableId, status: destination.droppableId });

    // Build reorder items for the destination column
    const destApps = [...columns[destination.droppableId]];
    const movedApp = applications.find(a => a._id === draggableId);

    if (source.droppableId !== destination.droppableId) {
      destApps.splice(destination.index, 0, movedApp);
    } else {
      destApps.splice(source.index, 1);
      destApps.splice(destination.index, 0, movedApp);
    }

    const items = destApps.map((app, idx) => ({
      id: app._id,
      status: destination.droppableId,
      order: idx,
    }));

    reorder.mutate(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STATUSES.map(status => (
          <KanbanColumn key={status} status={status} applications={columns[status]} />
        ))}
      </div>
    </DragDropContext>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Kanban board with drag-and-drop columns"
```

---

### Task 23: Board Page with Add Application Modal

**Files:**
- Create: `client/src/components/common/Modal.jsx`
- Modify: `client/src/pages/Board.jsx`

- [ ] **Step 1: Create reusable Modal component**

```jsx
import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build Board page with add application form**

```jsx
import { useState } from 'react';
import { useApplications, useCreateApplication } from '../hooks/useApplications';
import KanbanBoard from '../components/KanbanBoard/KanbanBoard';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const initialForm = {
  company: '', role: '', status: 'wishlist', jobUrl: '',
  source: '', location: '', type: '', appliedDate: '',
  salary: { min: '', max: '', currency: 'INR' },
};

export default function Board() {
  const { data, isLoading } = useApplications({ limit: 200 });
  const createApp = useCreateApplication();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');

  const applications = data?.data?.applications || [];
  const filtered = search
    ? applications.filter(a =>
        a.company.toLowerCase().includes(search.toLowerCase()) ||
        a.role.toLowerCase().includes(search.toLowerCase())
      )
    : applications;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (payload.salary.min) payload.salary.min = Number(payload.salary.min);
      if (payload.salary.max) payload.salary.max = Number(payload.salary.max);
      if (!payload.salary.min && !payload.salary.max) delete payload.salary;
      Object.keys(payload).forEach(k => { if (payload[k] === '') delete payload[k]; });

      await createApp.mutateAsync(payload);
      toast.success('Application added!');
      setForm(initialForm);
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to create');
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Application Board</h1>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + Add Application
          </button>
        </div>
      </div>

      <KanbanBoard applications={filtered} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Application">
        <form onSubmit={handleSubmit} className="space-y-3">
          <input required placeholder="Company *" value={form.company}
            onChange={e => setForm({...form, company: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input required placeholder="Role *" value={form.role}
            onChange={e => setForm({...form, role: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input placeholder="Job URL" value={form.jobUrl}
            onChange={e => setForm({...form, jobUrl: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
          <input placeholder="Location" value={form.location}
            onChange={e => setForm({...form, location: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.source}
              onChange={e => setForm({...form, source: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm">
              <option value="">Source</option>
              <option value="linkedin">LinkedIn</option>
              <option value="naukri">Naukri</option>
              <option value="indeed">Indeed</option>
              <option value="company_website">Company Website</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
            <select value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
              className="px-3 py-2 border rounded-lg text-sm">
              <option value="">Work Type</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="Min Salary" value={form.salary.min}
              onChange={e => setForm({...form, salary: {...form.salary, min: e.target.value}})}
              className="px-3 py-2 border rounded-lg text-sm" />
            <input type="number" placeholder="Max Salary" value={form.salary.max}
              onChange={e => setForm({...form, salary: {...form.salary, max: e.target.value}})}
              className="px-3 py-2 border rounded-lg text-sm" />
          </div>
          <button type="submit" disabled={createApp.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {createApp.isPending ? 'Adding...' : 'Add Application'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add Board page with Kanban view and add-application modal"
```

---

## Chunk 6: Application Detail, Dashboard & Settings Pages

### Task 24: Application Detail Page

**Files:**
- Modify: `client/src/pages/ApplicationDetail.jsx`

- [ ] **Step 1: Build full ApplicationDetail page**

Build with: application info display, inline editing, notes section (add/view/delete), activity timeline, resume upload/download/delete buttons. Uses `useApplication` hook and `applicationService` for notes/resume.

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add application detail page with notes, timeline, and resume"
```

---

### Task 25: Dashboard Page with Charts

**Files:**
- Create: `client/src/services/dashboard.service.js`
- Create: `client/src/hooks/useDashboard.js`
- Create: `client/src/components/Charts/WeeklyTrendChart.jsx`
- Create: `client/src/components/Charts/StatusChart.jsx`
- Create: `client/src/components/Charts/SourceChart.jsx`
- Modify: `client/src/pages/Dashboard.jsx`

- [ ] **Step 1: Create dashboard service**

```javascript
import api from './api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats'),
  getWeeklyTrend: () => api.get('/dashboard/weekly-trend'),
  getByStatus: () => api.get('/dashboard/by-status'),
  getBySource: () => api.get('/dashboard/by-source'),
  getResponseTime: () => api.get('/dashboard/response-time'),
};
```

- [ ] **Step 2: Create dashboard hooks**

```javascript
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export function useDashboardStats() {
  return useQuery({ queryKey: ['dashboard', 'stats'], queryFn: dashboardService.getStats });
}
export function useWeeklyTrend() {
  return useQuery({ queryKey: ['dashboard', 'weekly'], queryFn: dashboardService.getWeeklyTrend });
}
export function useByStatus() {
  return useQuery({ queryKey: ['dashboard', 'status'], queryFn: dashboardService.getByStatus });
}
export function useBySource() {
  return useQuery({ queryKey: ['dashboard', 'source'], queryFn: dashboardService.getBySource });
}
```

- [ ] **Step 3: Create Chart.js chart components**

Register Chart.js components, create `WeeklyTrendChart` (Line), `StatusChart` (Doughnut), `SourceChart` (Bar) using data from hooks.

- [ ] **Step 4: Build Dashboard page**

Stats cards (total, this week, response rate, offers) + 3 charts in a grid layout.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add dashboard page with stats cards and charts"
```

---

### Task 26: Settings Page

**Files:**
- Modify: `client/src/pages/Settings.jsx`

- [ ] **Step 1: Build Settings page**

Two sections: Update Profile (name, email) and Change Password form. Uses `authService.updateProfile` and `authService.changePassword`.

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add settings page with profile and password management"
```

---

### Task 27: Reminder Service & UI

**Files:**
- Create: `client/src/services/reminder.service.js`
- Create: `client/src/hooks/useReminders.js`
- Add reminders section to Dashboard or Sidebar

- [ ] **Step 1: Create reminder service and hooks**

- [ ] **Step 2: Add upcoming reminders panel to Dashboard page**

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: add reminders service and upcoming reminders panel"
```

---

## Chunk 7: Polish & Final Touches

### Task 28: Loading, Empty & Error States

**Files:**
- Create: `client/src/components/common/LoadingSpinner.jsx`
- Create: `client/src/components/common/EmptyState.jsx`
- Update all pages to use them

- [ ] **Step 1: Create reusable state components and apply throughout**

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add loading, empty, and error state components"
```

---

### Task 29: Responsive Design Pass

- [ ] **Step 1: Make sidebar collapsible on mobile**
- [ ] **Step 2: Make Kanban board horizontally scrollable on small screens**
- [ ] **Step 3: Stack dashboard charts vertically on mobile**
- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add responsive design for mobile screens"
```

---

### Task 30: Rate Limiting & Security Hardening

**Files:**
- Modify: `server/src/server.js`

- [ ] **Step 1: Add rate limiting**

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, try again later' },
});

app.use('/api/', limiter);
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add rate limiting and security hardening"
```

---

## Summary

| Chunk | Tasks | What It Delivers |
|-------|-------|------------------|
| 1: Backend Foundation | Tasks 1-8 | Express server, MongoDB, Application CRUD with validation |
| 2: Authentication | Tasks 9-10 | Signup, login, JWT, protected routes, ownership |
| 3: Notes + Upload + Dashboard | Tasks 11-14 | Notes, resume upload, dashboard analytics, reminders + cron |
| 4: Frontend Setup & Auth | Tasks 15-20 | React + Vite + Tailwind, auth flow, layout, routing |
| 5: Kanban Board | Tasks 21-23 | Drag-drop board, application service, add modal |
| 6: Detail + Dashboard + Settings | Tasks 24-27 | App detail page, charts, settings, reminders UI |
| 7: Polish | Tasks 28-30 | Loading states, responsive design, rate limiting |
