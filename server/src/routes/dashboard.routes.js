// Dashboard Routes
// GET /stats, GET /weekly-trend, GET /by-status, GET /by-source, GET /response-time

import express from 'express';
import { getDashboardBySource,getDashboardWeeklyTrend,getDashboardByStatus,getDashboardStats } from '../controllers/dashboard.controller.js';
import { protect } from '../middleware/auth.middleware.js';


const router = express.Router();


// POST /api/applications/:id/notes
router.get('/by-status', protect, getDashboardByStatus);
router.get('/by-source', protect, getDashboardBySource);
router.get('/weekly-trend', protect, getDashboardWeeklyTrend);
router.get('/stats', protect, getDashboardStats);


export default router;