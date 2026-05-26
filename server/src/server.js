import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import applicationRoutes from './routes/application.routes.js';
import authRoutes from './routes/auth.routes.js';
import noteRoutes from './routes/note.routes.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Global Middlewares
app.use(helmet());          // security headers
app.use(cors());            // allow cross-origin
app.use(morgan('dev'));     // logging
app.use(express.json());    // parse JSON body

// Test Route
// ====================== ROUTES ======================

app.get('/api', (req, res) => {
    res.json({ 
        message: 'Welcome to Job Application Tracker API!', 
        status: 'ok',
        version: '1.0'
    });
});

// Auth Routes
app.use('/api/auth', authRoutes);           // ← All auth routes (signup, login, me, etc.)

// Application Routes (Protected later)
app.use('/api/applications', applicationRoutes);   // ← All job application routes
// Note Routes (Protected later)
app.use('/api/applications/:id/notes', noteRoutes);   // ← All job application routes

// ====================== 404 Handler ======================
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Test API: http://localhost:${PORT}/api`);
});