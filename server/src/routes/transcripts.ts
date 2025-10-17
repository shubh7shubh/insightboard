import { Router } from 'express';
import {
  createTranscript,
  getTranscripts,
  getTranscriptById,
  deleteTranscript
} from '../controllers/transcriptController.js';

const router = Router();

// POST /api/transcripts - Submit transcript and generate tasks
router.post('/', createTranscript);

// GET /api/transcripts - Get all transcripts with their tasks
router.get('/', getTranscripts);

// GET /api/transcripts/:id - Get specific transcript with its tasks
router.get('/:id', getTranscriptById);

// DELETE /api/transcripts/:id - Delete transcript and associated tasks
router.delete('/:id', deleteTranscript);

export default router;