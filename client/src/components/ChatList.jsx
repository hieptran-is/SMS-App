import { formatListTime } from '../utils/formatTime';

export default function ChatList({ conversations, currentUserId, selectedUser, onSelect }) {
	return (
		<div className="chat-list">
			{conversations.length === 0 && <div className="empty-list"><span>✦</span><p>Chưa có cuộc trò chuyện</p><small>Tìm số điện thoại để bắt đầu nhắn tin.</small></div>}
			{conversations.map((conversation) => {
				const other = conversation.participants.find((participant) => participant._id !== currentUserId) || conversation.participants[0];
				const selected = other?._id === selectedUser?._id;
				return <button className={selected ? 'chat-row selected' : 'chat-row'} key={conversation._id} onClick={() => onSelect(other)}>
					<span className="avatar">{other?.name?.charAt(0) || '?'}</span>
					<span className="chat-row-content"><strong>{other?.name}</strong><small>{conversation.lastMessage?.text || 'Bắt đầu cuộc trò chuyện'}</small></span>
					<time>{formatListTime(conversation.updatedAt)}</time>
				</button>;
			})}
		</div>
	);
}
