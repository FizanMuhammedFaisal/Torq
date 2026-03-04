import axios from 'axios';
import { useAuthStore } from '@/store/use-auth-store';
import { authClient } from '@/lib/auth';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
	withCredentials: true, // Crucial for sending the httpOnly refresh cookie
	headers: {
		'Content-Type': 'application/json',
	},
});

// Request Interceptor: Inject the JWT if it exists in our Zustand store
apiClient.interceptors.request.use(
	(config) => {
		const { jwt } = useAuthStore.getState();
		if (jwt) {
			config.headers.Authorization = `Bearer ${jwt}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response Interceptor: Handle 401s and attempt to refresh the JWT
apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// If auth is globally disabled, do not attempt to intercept or refresh auth state
		if (import.meta.env.VITE_AUTH_ENABLED !== 'true') {
			return Promise.reject(error);
		}

		// If error is 401 and we haven't already retried this exact request
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const sessionRes = await authClient.getSession();

				if (sessionRes.data?.session && sessionRes.data?.user) {
					useAuthStore
						.getState()
						.setAuth(
							sessionRes.data.user,
							sessionRes.data.session,
							sessionRes.data.session.token || null,
						);
					// Replay original request
					return apiClient(originalRequest);
				}
				throw new Error('No valid session returned');
			} catch (refreshError) {
				// Refresh failed (e.g., refresh cookie expired). Clear local state and kick to login.
				useAuthStore.getState().clearAuth();
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);

export { apiClient };
