import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth';
import { useAuthStore } from '@/store/auth';
import type { LoginInput } from '../schema';

interface UseLoginReturn {
	/** Call with validated form data */
	mutate: (data: LoginInput) => Promise<void>;
	/** Whether the request is in flight */
	isPending: boolean;
	/** Server-level error (e.g. invalid credentials) */
	error: string | null;
}

export function useLogin(): UseLoginReturn {
	const navigate = useNavigate();
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const mutate = useCallback(
		async (data: LoginInput) => {
			setError(null);
			setIsPending(true);

			try {
				const { error: apiError } = await authClient.signIn.email({
					email: data.email,
					password: data.password,
				});

				if (apiError) {
					setError(apiError.message || 'Invalid email or password');
					toast.error(apiError.message || 'Invalid email or password');
					return;
				}

				const result = await authClient.getSession();
				if (result.data?.session && result.data?.user) {
					useAuthStore
						.getState()
						.setAuth(
							result.data.user,
							result.data.session,
							result.data.session.token || null,
						);
				}
				toast.success('Successfully signed in');
				navigate('/dashboard');
			} catch (err: unknown) {
				const msg =
					err instanceof Error
						? err.message
						: 'An internal error occurred. Please try again.';
				setError(msg);
				toast.error(msg);
			} finally {
				setIsPending(false);
			}
		},
		[navigate],
	);

	return { mutate, isPending, error };
}
