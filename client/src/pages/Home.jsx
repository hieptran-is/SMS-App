import { useEffect, useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import SearchBar from '../components/SearchBar';
import ChatList from '../components/ChatList';
import ChatWindow from '../components/ChatWindow';
import { useAuth } from '../context/AuthContext';
import { getConversations, getMessages, sendMessage } from '../services/api';
import { createSocket } from '../services/socket';

export default function Home() {
	const { user, logout } = useAuth();
	const [conversations, setConversations] = useState([]);
	const [selectedUser, setSelectedUser] = useState(null);
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [chatError, setChatError] = useState('');
	const selectedUserRef = useRef(null);
	const optimisticMessageId = useRef(0);
	const selectionRequestId = useRef(0);

	const loadConversations = async () => {
		const response = await getConversations();
		setConversations(Array.isArray(response.data.conversations) ? response.data.conversations : []);
	};

	useEffect(() => {
		loadConversations().catch(() => {});
		const socket = createSocket();
		socket.emit('join-user', user._id);
		socket.on('conversation-updated', loadConversations);
		socket.on('message-received', ({ message }) => {
			if (message.sender?._id === selectedUserRef.current?._id) {
				setMessages((current) => current.some((item) => item._id === message._id) ? current : [...current, message]);
			}
		});
		return () => socket.disconnect();
	}, [user._id]);

	const selectUser = async (nextUser) => {
		const requestId = ++selectionRequestId.current;
		selectedUserRef.current = nextUser;
		setSelectedUser(nextUser);
		setMessages([]);
		setChatError('');
		setLoading(true);
		try {
			const response = await getMessages(nextUser._id);
			if (requestId === selectionRequestId.current) {
				setMessages(Array.isArray(response.data.messages) ? response.data.messages : []);
			}
		} catch (error) {
			if (requestId === selectionRequestId.current) {
				setChatError(error.response?.data?.message || 'Không thể tải cuộc trò chuyện. Vui lòng thử lại.');
			}
		} finally {
			if (requestId === selectionRequestId.current) setLoading(false);
		}
	};

	const handleSend = async (text) => {
		const recipient = selectedUserRef.current;
		if (!recipient) return;
		const pendingId = `pending-${++optimisticMessageId.current}`;
		const pendingMessage = {
			_id: pendingId,
			sender: { _id: user._id },
			text,
			createdAt: new Date().toISOString(),
		};
		setMessages((current) => [...current, pendingMessage]);
		try {
			const response = await sendMessage(recipient._id, text);
			const newMessage = response.data.message;
			if (selectedUserRef.current?._id === recipient._id) {
				setMessages((current) => current.some((message) => message._id === newMessage._id)
					? current.filter((message) => message._id !== pendingId)
					: current.map((message) => message._id === pendingId ? newMessage : message));
			}
		} catch (error) {
			if (selectedUserRef.current?._id === recipient._id) {
				setMessages((current) => current.filter((message) => message._id !== pendingId));
			}
			throw error;
		}
		try {
			await loadConversations();
		} catch (_error) {
		}
	};

	return <div className="app-shell">
		<TopBar user={user} onLogout={logout} />
		<div className="workspace">
			<Sidebar active="chat" onSelect={() => {}} />
			<aside className="inbox-panel"><div className="inbox-heading"><div><p className="eyebrow">TIN NHẮN</p><h1>Trò chuyện</h1></div><span className="online-dot" /></div><SearchBar onSelectUser={selectUser} /><div className="list-tabs"><button className="active">Tất cả</button><button>Chưa đọc</button></div><ChatList conversations={conversations} currentUserId={user._id} selectedUser={selectedUser} onSelect={selectUser} /></aside>
			<ChatWindow user={selectedUser} currentUserId={user._id} messages={messages} loading={loading} error={chatError} onSend={handleSend} />
		</div>
	</div>;
}
