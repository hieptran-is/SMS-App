import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ active, onSelect }) {
	const { user, logout } = useAuth();
	const [profileOpen, setProfileOpen] = useState(false);
	return (
		<aside className="sidebar">
			<div className="sidebar-logo">✦</div>
			<nav>
				<button className={active === 'chat' ? 'side-button active' : 'side-button'} onClick={() => onSelect('chat')} title="Tin nhắn">▰<span>Tin nhắn</span></button>
				<button className="side-button" onClick={() => onSelect('contacts')} title="Danh bạ">♧<span>Danh bạ</span></button>
			</nav>
			<div className="sidebar-bottom">
				<button className="side-button" title="Cài đặt">⚙<span>Cài đặt</span></button>
				<div className="profile-wrap">
					<button className="profile-mini" onClick={() => setProfileOpen((open) => !open)} title="Tài khoản"><span>{user?.name?.charAt(0) || 'U'}</span></button>
					{profileOpen && <div className="profile-menu"><strong>{user?.name}</strong><small>{user?.phone}</small><button onClick={logout}>Đăng xuất</button></div>}
				</div>
			</div>
		</aside>
	);
}
