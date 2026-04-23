// Application Routes

import express from 'express';
import Application from '../models/Application.js';
import { createApplication, deleteApplication, getApplications, updateApplication, updateApplicationStatusWise } from '../controllers/application.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router =  express.Router();


router.post('/', protect, createApplication);                    // Create new application
router.get('/', protect, getApplications);                       // Get all user's applications
router.put('/:id', protect, updateApplication);                  // Update application
router.patch('/:id/status', protect, updateApplicationStatusWise); // Update status only
router.delete('/:id', protect, deleteApplication);               // Delete application

export default router;