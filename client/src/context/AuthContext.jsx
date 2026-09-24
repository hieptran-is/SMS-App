import { createContext, useContext, useEffect, useState } from 'react';
import { api, loginRequest, registerRequest, updatePresence } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('sms_user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const saveSession = ({ token, user: nextUser }) => {
		localStorage.setItem('sms_token', token);
		localStorage.setItem('sms_user', JSON.stringify(nextUser));
		setUser(nextUser);
	};

	const login = async (payload) => {
		const result = await loginRequest(payload);
		saveSession(result.data);
	};

	const register = async (payload) => {
		const result = await registerRequest(payload);
		saveSession(result.data);
	};

	const logout = async () => {
		try {
			if (user) await updatePresence(false);
		} catch (_error) {
		}
		localStorage.removeItem('sms_token');
		localStorage.removeItem('sms_user');
		delete api.defaults.headers.common.Authorization;
		setUser(null);
	};

	useEffect(() => {
		if (!user) return undefined;
		updatePresence(true).catch(() => {});
		return () => {};
	}, [user]);

	return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
