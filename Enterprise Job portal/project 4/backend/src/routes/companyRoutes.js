import express from 'express';
import { getAllCompanies, getCompanyById, createReview, createCompany } from '../controllers/companyController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllCompanies);
router.get('/:id', getCompanyById);
router.post('/reviews', authenticateToken, createReview);
router.post('/', authenticateToken, authorizeRole('recruiter'), createCompany);

export default router;
