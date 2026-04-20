import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth';
import { useAuthStore } from '@/store/auth';

export function LoginPage() {
	const { user, isLoading } = useAuthStore();

	if (!isLoading && user) {
		return <Navigate to="/dashboard" replace />;
	}

	return <LoginForm />;
}
