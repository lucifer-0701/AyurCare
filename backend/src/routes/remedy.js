import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { generateRemedy } from '../controllers/remedyController.js';

const router = express.Router();

// POST /api/remedy/generate — Protected route
router.post('/generate', authenticate, generateRemedy);

export default router;
