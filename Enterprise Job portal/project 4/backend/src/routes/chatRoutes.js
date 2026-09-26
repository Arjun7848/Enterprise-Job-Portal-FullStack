import express from 'express';
import { getMessages, getConversations, sendMessage } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/conversations', getConversations);
router.get('/:otherUserId', getMessages);
router.post('/', sendMessage);

export default router;
