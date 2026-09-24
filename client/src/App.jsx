import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

const ProtectedRoute = ({ children }) => {
	const { user } = useAuth();
	return user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
	const { user } = useAuth();
	return user ? <Navigate to="/" replace /> : children;
};

export default function App() {
	return (
		<Routes>
			<Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
			<Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
			<Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
}
