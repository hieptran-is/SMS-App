import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (request, response, next) => {
	try {
		const header = request.headers.authorization;
		const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

		if (!token) return response.status(401).json({ message: 'Vui lòng đăng nhập' });

		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret');
		const user = await User.findById(decoded.userId);

		if (!user) return response.status(401).json({ message: 'Tài khoản không tồn tại' });

		request.user = user;
		next();
	} catch (_error) {
		return response.status(401).json({ message: 'Phiên đăng nhập không hợp lệ' });
	}
};
