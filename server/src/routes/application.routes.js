import express from 'express';
import {
  createApplication,
  deleteApplication,
  getApplications,
  updateApplication,
  updateApplicationStatusWise,
  getApplicationById,
  uploadResume,
  downloadResume,
  deleteResume
} from '../controllers/application.controller.js';

import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.post('/', protect, createApplication);
router.get('/', protect, getApplications);

router.patch('/:id/status', protect, updateApplicationStatusWise);

router.get('/:id', protect, getApplicationById);
router.put('/:id', protect, updateApplication);
router.delete('/:id', protect, deleteApplication);

router.post('/:id/resume', protect, upload.single("resume"), uploadResume)
router.get('/:id/resume', protect, downloadResume)
router.delete('/:id/resume',protect, deleteResume)

export default router;