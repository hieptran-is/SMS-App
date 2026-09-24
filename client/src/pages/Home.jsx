import { useEffect, useState } from 'react';
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

	const loadConversations = async () => {
		const response = await getConversations();
		setConversations(response.data.conversations);
	};

	useEffect(() => {
		loadConversations().catch(() => {});
		const socket = createSocket();
		socket.emit('join-user', user._id);
		socket.on('conversation-updated', loadConversations);
		socket.on('message-received', ({ message }) => {
			if (message.sender?._id === selectedUser?._id) setMessages((current) => [...current, message]);
		});
		return () => socket.disconnect();
	}, [user._id, selectedUser?._id]);

	const selectUser = async (nextUser) => {
		setSelectedUser(nextUser);
		setLoading(true);
		try {
			const response = await getMessages(nextUser._id);
			setMessages(response.data.messages);
		} finally {
			setLoading(false);
		}
	};

	const handleSend = async (text) => {
		if (!selectedUser) return;
		const response = await sendMessage(selectedUser._id, text);
		const newMessage = response.data.message;
		setMessages((current) => current.some((message) => message._id === newMessage._id) ? current : [...current, newMessage]);
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
			<ChatWindow user={selectedUser} messages={messages} loading={loading} onSend={handleSend} />
		</div>
	</div>;
}
