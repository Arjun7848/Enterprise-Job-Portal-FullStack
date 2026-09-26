import express from 'express';
import { getAllCourses, getCourseById, enrollInCourse, getUserEnrollments, createCourse } from '../controllers/courseController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/enroll', authenticateToken, enrollInCourse);
router.get('/my/enrollments', authenticateToken, getUserEnrollments);
router.post('/', authenticateToken, authorizeRole('admin'), createCourse);

export default router;
