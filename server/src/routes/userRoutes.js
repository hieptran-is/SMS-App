import { Router } from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.patch('/presence', protect, async (request, response, next) => {
	try {
		request.user.isOnline = Boolean(request.body.isOnline);
		request.user.lastSeen = new Date();
		await request.user.save();
		response.json({ user: request.user });
	} catch (error) {
		next(error);
	}
});

export default router;
