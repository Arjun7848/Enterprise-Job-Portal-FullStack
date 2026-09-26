import express from 'express';
import { createJob, getAllJobs, getJobById, getRecruiterJobs } from '../controllers/jobController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// IMPORTANT: /mine must come before /:id to avoid "mine" being treated as a param
router.get('/mine', authenticateToken, authorizeRole('recruiter'), getRecruiterJobs);
router.post('/', authenticateToken, authorizeRole('recruiter'), createJob);
router.get('/', getAllJobs);
router.get('/:id', getJobById);

export default router;
