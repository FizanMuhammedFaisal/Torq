import { Navigate, useLocation } from 'react-router-dom';
import { useAppConfig } from '@/lib/app-config';
import { useAuthStore } from '@/store/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
	const { user, isLoading } = useAuthStore();
	const { authEnabled } = useAppConfig();
	const location = useLocation();

	if (!authEnabled) {
		return <>{children}</>;
	}
	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-black">
				<div className="flex flex-col items-center gap-6">
					<div className="relative flex items-center justify-center">
						{' '}
						<span className="text-2xl font-black tracking-tighter text-white/90">
							Torq
						</span>
					</div>
					<div className="flex items-center gap-2">
						<p className="text-xs font-medium text-primary uppercase tracking-[0.2em]  animate-pulse">
							Connecting to Engine
						</p>
					</div>
				</div>
			</div>
		);
	}
	// If finished loading and there's no user, move to login
	if (!user) {
		return <Navigate to="/login" state={{ from: location }} replace />;
	}
	return <>{children}</>;
}
