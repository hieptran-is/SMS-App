import { Router } from 'express';
import { searchUsers } from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/users', protect, searchUsers);

export default router;
