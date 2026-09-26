import express from 'express';
import { getRecommendedJobs } from '../controllers/recommendationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getRecommendedJobs);

export default router;
