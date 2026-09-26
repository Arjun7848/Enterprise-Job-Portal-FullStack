import express from 'express';
import { getStats, getAllUsers, deleteUser, getAllJobs, deleteJob } from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes here require admin role
router.use(authenticateToken, authorizeRole('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/jobs', getAllJobs);
router.delete('/jobs/:id', deleteJob);

export default router;
