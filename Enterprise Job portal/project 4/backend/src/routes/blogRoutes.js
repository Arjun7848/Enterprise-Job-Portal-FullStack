import express from 'express';
import { createBlog, getAllBlogs, getBlogById, deleteBlog } from '../controllers/blogController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Creation/Deletion requires login (and admin for general, or logic for author)
router.post('/', authenticateToken, authorizeRole('admin'), createBlog);
router.delete('/:id', authenticateToken, deleteBlog);

export default router;
