import express from 'express';
import { checkAtsCompatibility } from '../controllers/atsController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/check', authenticateToken, checkAtsCompatibility);

export default router;
