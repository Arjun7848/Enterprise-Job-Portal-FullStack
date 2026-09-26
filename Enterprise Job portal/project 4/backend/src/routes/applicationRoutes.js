import express from 'express';
import {
  applyToJob,
  getSeekerApplications,
  getRecruiterApplications,
  updateApplicationStatus
} from '../controllers/applicationController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Seeker: apply for a job
router.post('/', authenticateToken, authorizeRole('seeker'), applyToJob);

// Seeker: view their own applications
router.get('/seeker', authenticateToken, authorizeRole('seeker'), getSeekerApplications);

// Recruiter: view all applications for their jobs
router.get('/recruiter', authenticateToken, authorizeRole('recruiter'), getRecruiterApplications);

// Recruiter: update status of an application (shortlist / reject)
router.patch('/:id/status', authenticateToken, authorizeRole('recruiter'), updateApplicationStatus);

export default router;
