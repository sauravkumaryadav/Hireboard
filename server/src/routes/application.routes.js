// Application Routes

import express from 'express';
import Application from '../models/Application.js';
import { createApplication, deleteApplication, getApplications, updateApplication, updateApplicationStatusWise } from '../controllers/application.controller.js';

const router =  express.Router();


router.post('/', createApplication);
router.get('/', getApplications);
router.put('/:id',updateApplication)
router.patch('/:id/status',updateApplicationStatusWise)
router.delete('/:id',deleteApplication)

export default router;