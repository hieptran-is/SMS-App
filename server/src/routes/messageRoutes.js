import { Router } from 'express';
import { getMessages, listConversations, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/conversations', listConversations);
router.get('/:userId', getMessages);
router.post('/:userId', sendMessage);

export default router;
