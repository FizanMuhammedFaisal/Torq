import { useEffect } from 'react';
import { useAppConfig } from '@/lib/app-config';
import { authClient } from '@/lib/auth';
import { useAuthStore } from '@/store/auth';

export function useAppInit() {
	const { setAuth, clearAuth, setLoading } = useAuthStore();
	const config = useAppConfig();

	useEffect(() => {
		if (!config.authEnabled) {
			setLoading(false);
			return;
		}

		let isMounted = true;

		async function initAuth() {
			try {
				// Calling getSession() verifies the session cookie and fetches current user/session/jwt data.
				const result = await authClient.getSession();

				if (isMounted) {
					if (result.data?.session && result.data?.user) {
						// Hydrate global store
						setAuth(
							result.data.user,
							result.data.session,
							result.data.session.token || null, // Some auth clients pass the new JWT inside session.token
						);
					} else {
						// No active session found
						clearAuth();
					}
				}
			} catch (error) {
				if (isMounted) {
					console.error('App init failed:', error);
					clearAuth();
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		}

		initAuth();

		return () => {
			isMounted = false;
		};
	}, [setAuth, clearAuth, setLoading, config.authEnabled]);
}
