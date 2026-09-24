import { useEffect, useRef, useState } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ user, messages, loading, onSend }) {
	const [text, setText] = useState('');
	const [sendError, setSendError] = useState('');
	const endRef = useRef(null);

	useEffect(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

	const submit = async (event) => {
		event.preventDefault();
		if (!text.trim()) return;
		const nextText = text;
		setText('');
		setSendError('');
		try {
			await onSend(nextText);
		} catch (error) {
			setText(nextText);
			setSendError(error.response?.data?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.');
		}
	};

	if (!user) return <section className="chat-empty"><div className="empty-symbol">✦</div><h2>Chọn một cuộc trò chuyện</h2><p>Tìm số điện thoại hoặc chọn từ danh sách để bắt đầu.</p></section>;

	return <section className="chat-window">
		<header className="conversation-header"><span className="avatar">{user.name.charAt(0)}</span><div><h2>{user.name}</h2><p>{user.isOnline ? 'Đang hoạt động' : 'Ngoại tuyến'}</p></div><button className="icon-button" title="Thông tin">ⓘ</button></header>
		<div className="messages-area">
			{loading ? <p className="center-note">Đang tải tin nhắn...</p> : messages.length === 0 ? <p className="center-note">Hãy gửi lời chào đầu tiên.</p> : messages.map((message) => <MessageBubble key={message._id} message={message} isMine={message.sender?._id !== user._id} />)}
			<div ref={endRef} />
		</div>
		{sendError && <p className="send-error" role="alert">{sendError}</p>}
		<form className="composer" onSubmit={submit}><button type="button" className="icon-button" title="Đính kèm">＋</button><input value={text} onChange={(event) => setText(event.target.value)} placeholder="Nhập tin nhắn..." /><button className="send-button" disabled={!text.trim()} title="Gửi">➤</button></form>
	</section>;
}
