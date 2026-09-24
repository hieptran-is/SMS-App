import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000/api`;

export const api = axios.create({ baseURL: baseUrl });

api.interceptors.request.use((config) => {
	const token = localStorage.getItem('sms_token');
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

export const loginRequest = (payload) => api.post('/auth/login', payload);
export const registerRequest = (payload) => api.post('/auth/register', payload);
export const getConversations = () => api.get('/messages/conversations');
export const getMessages = (userId) => api.get(`/messages/${userId}`);
export const sendMessage = (userId, text) => api.post(`/messages/${userId}`, { text });
export const searchUsers = (phone) => api.get('/search/users', { params: { phone } });
export const updatePresence = (isOnline) => api.patch('/users/presence', { isOnline });
