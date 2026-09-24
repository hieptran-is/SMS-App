import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerRequest } from '../services/api';
import { validatePhone } from '../utils/validatePhone';

export default function Register() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: '', phone: '', password: '', confirmPassword: '' });
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const submit = async (event) => {
		event.preventDefault();
		setError('');
		if (!form.name.trim()) return setError('Vui lòng nhập họ tên');
		if (!validatePhone(form.phone)) return setError('Số điện thoại chưa đúng định dạng');
		if (form.password.length < 6) return setError('Mật khẩu cần có ít nhất 6 ký tự');
		if (form.password !== form.confirmPassword) return setError('Mật khẩu xác nhận không khớp');
		setLoading(true);
		try {
			await registerRequest({ name: form.name, phone: form.phone, password: form.password });
			navigate('/login', { state: { message: 'Đăng ký thành công. Hãy đăng nhập để tiếp tục.' } });
		} catch (requestError) {
			setError(requestError.response?.data?.message || 'Không thể tạo tài khoản lúc này');
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-page auth-page-register">
			<section className="auth-art">
				<div className="brand-mark">✦</div>
				<p className="eyebrow">SMS CONNECT</p>
				<h1>Một tài khoản, mọi kết nối.</h1>
				<p className="art-copy">Tạo không gian nhắn tin riêng của bạn và bắt đầu kết nối ngay hôm nay.</p>
			</section>
			<section className="auth-panel">
				<div className="auth-form-wrap">
					<p className="eyebrow">BẮT ĐẦU KẾT NỐI</p>
					<h2>Tạo tài khoản</h2>
					<p className="muted">Thông tin của bạn được lưu an toàn trên hệ thống.</p>
					<form onSubmit={submit} className="auth-form">
						<label>Họ và tên<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Nguyễn Văn A" /></label>
						<label>Số điện thoại<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="090 123 4567" inputMode="tel" /></label>
						<label>Mật khẩu<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Tối thiểu 6 ký tự" /></label>
						<label>Nhập lại mật khẩu<input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Nhập lại mật khẩu" /></label>
						{error && <p className="form-error">{error}</p>}
						<button className="primary-button" disabled={loading}>{loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}</button>
					</form>
					<p className="auth-switch">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
				</div>
			</section>
		</main>
	);
}
