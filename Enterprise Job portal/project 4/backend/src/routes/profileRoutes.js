import express from 'express';
import { getCompletionScore, updateBioSkills, updateVideoResume } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/completion', getCompletionScore);
router.patch('/update-minimal', updateBioSkills);
router.patch('/update-video', updateVideoResume);

export default router;
