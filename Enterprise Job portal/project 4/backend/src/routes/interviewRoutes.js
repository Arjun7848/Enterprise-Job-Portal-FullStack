import express from 'express';
import { scheduleInterview, getSeekerInterviews, getRecruiterInterviews, updateInterviewStatus } from '../controllers/interviewController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRole('recruiter'), scheduleInterview);
router.get('/seeker', authenticateToken, authorizeRole('seeker'), getSeekerInterviews);
router.get('/recruiter', authenticateToken, authorizeRole('recruiter'), getRecruiterInterviews);
router.patch('/:id', authenticateToken, authorizeRole('recruiter'), updateInterviewStatus);

export default router;
