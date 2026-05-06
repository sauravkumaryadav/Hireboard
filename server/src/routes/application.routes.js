import express from 'express';
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
  updateApplicationStatusWise,
  getApplicationById
} from '../controllers/application.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createApplication);
router.get('/', protect, getApplications);

router.patch('/:id/status', protect, updateApplicationStatusWise);

router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

export default router;