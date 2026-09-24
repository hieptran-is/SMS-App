import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const createToken = (userId) => jwt.sign(
	{ userId },
	process.env.JWT_SECRET || 'development-secret',
	{ expiresIn: '7d' }
);

export const register = async (request, response, next) => {
	try {
		const { name, phone, password } = request.body;

		if (!name?.trim() || !phone?.trim() || !password) {
			return response.status(400).json({ message: 'Vui lòng nhập đủ họ tên, số điện thoại và mật khẩu' });
		}

		if (password.length < 6) {
			return response.status(400).json({ message: 'Mật khẩu cần có ít nhất 6 ký tự' });
		}

		const normalizedPhone = phone.trim();
		const existingUser = await User.findOne({ phone: normalizedPhone });
		if (existingUser) return response.status(409).json({ message: 'Số điện thoại đã được đăng ký' });

		const hashedPassword = await bcrypt.hash(password, 10);
		const user = await User.create({ name: name.trim(), phone: normalizedPhone, password: hashedPassword });

		response.status(201).json({ token: createToken(user.id), user });
	} catch (error) {
		next(error);
	}
};

export const login = async (request, response, next) => {
	try {
		const { phone, password } = request.body;
		const user = await User.findOne({ phone: phone?.trim() }).select('+password');
		const passwordMatches = user && await bcrypt.compare(password || '', user.password);
		const legacyPasswordMatches = user && user.password === password;

		if (!user || (!passwordMatches && !legacyPasswordMatches)) {
			return response.status(401).json({ message: 'Số điện thoại hoặc mật khẩu không đúng' });
		}

		if (legacyPasswordMatches) user.password = await bcrypt.hash(password, 10);

		user.isOnline = true;
		user.lastSeen = new Date();
		await user.save();

		response.json({ token: createToken(user.id), user });
	} catch (error) {
		next(error);
	}
};

export const me = (request, response) => response.json({ user: request.user });
