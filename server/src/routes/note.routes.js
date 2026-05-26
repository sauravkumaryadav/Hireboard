// Note Routes (mergeParams: true for :id from parent)
// POST /, GET /, DELETE /:noteId, GET /timeline

import express from 'express';
import { addNote, deleteNote, getNotes, getTimeline} from '../controllers/note.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router({ mergeParams: true });

// POST /api/applications/:id/notes
router.post('/', protect, addNote);

// GET /api/applications/:id/notes
router.get('/', protect, getNotes);

// DELETE /api/applications/:id/notes/:noteId
router.delete('/:noteId', protect, deleteNote);

// GET /api/applications/:id/notes/timeline
router.get('/timeline', protect, getTimeline);
export default router;
 