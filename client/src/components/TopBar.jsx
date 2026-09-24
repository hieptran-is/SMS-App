export default function TopBar({ user, onLogout }) {
	return (
		<header className="topbar">
			<div className="topbar-brand"><span className="brand-dot">✦</span><strong>SMS Connect</strong></div>
			<div className="topbar-user"><span>{user?.name}</span><button onClick={onLogout}>Đăng xuất</button></div>
		</header>
	);
}
