import { formatTime } from '../utils/formatTime';

export default function MessageBubble({ message, isMine }) {
	return <div className={isMine ? 'message-line mine' : 'message-line'}>
		<div className={isMine ? 'message-bubble mine' : 'message-bubble'}>
			<p>{message.text}</p>
			<time>{formatTime(message.createdAt)}</time>
		</div>
	</div>;
}
