import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validatePhone } from '../utils/validatePhone';

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuth();
	const [form, setForm] = useState({ phone: '', password: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		setError('');
		if (!validatePhone(form.phone)) return setError('Số điện thoại chưa đúng định dạng');
		setLoading(true);
		try {
			await login(form);
			navigate('/');
		} catch (requestError) {
			setError(requestError.response?.data?.message || 'Không thể đăng nhập lúc này');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-page">
			<section className="auth-art">
				<div className="brand-mark">✦</div>
				<p className="eyebrow">SMS CONNECT</p>
				<h1>Giữ những cuộc trò chuyện ở thật gần.</h1>
				<p className="art-copy">Nhắn tin nhanh, riêng tư và dễ dàng tìm thấy người bạn cần liên lạc.</p>
				<div className="art-orbit"><span>♡</span><span>•••</span><span>↗</span></div>
			</section>
			<section className="auth-panel">
				<div className="auth-form-wrap">
					<p className="eyebrow">CHÀO MỪNG TRỞ LẠI</p>
					<h2>Đăng nhập</h2>
					<p className="muted">Đăng nhập để tiếp tục cuộc trò chuyện của bạn.</p>
					{location.state?.message && <p className="form-success">{location.state.message}</p>}
					<form onSubmit={submit} className="auth-form">
						<label>Số điện thoại<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="090 123 4567" inputMode="tel" /></label>
						<label>Mật khẩu<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Nhập mật khẩu" /></label>
						{error && <p className="form-error">{error}</p>}
						<button className="primary-button" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
					</form>
					<p className="auth-switch">Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
				</div>
			</section>
		</main>
	);
}
