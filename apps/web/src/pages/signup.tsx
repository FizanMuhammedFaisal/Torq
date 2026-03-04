import { Navigate } from 'react-router-dom';
import { SignupForm } from '@/features/auth';
import { useAuthStore } from '@/store/use-auth-store';

export function SignupPage() {
	const { user, isLoading } = useAuthStore();

	if (!isLoading && user) {
		return <Navigate to="/dashboard" replace />;
	}

	return <SignupForm />;
}
