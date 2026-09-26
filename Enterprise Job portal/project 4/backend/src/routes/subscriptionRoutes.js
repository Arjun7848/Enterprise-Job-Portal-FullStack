import express from 'express';
import { createOrder, verifyPayment, getSubscription } from '../controllers/subscriptionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/order', createOrder);
router.post('/verify', verifyPayment);
router.get('/status', getSubscription);

export default router;
