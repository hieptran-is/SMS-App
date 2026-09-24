import User from '../models/User.js';

export const searchUsers = async (request, response, next) => {
	try {
		const query = request.query.phone?.replace(/\D/g, '');
		if (!query) return response.json({ users: [] });

		const users = await User.find({
			_id: { $ne: request.user.id },
			phone: { $regex: query, $options: 'i' },
		}).select('name phone avatar isOnline lastSeen').limit(10);

		response.json({ users });
	} catch (error) {
		next(error);
	}
};
