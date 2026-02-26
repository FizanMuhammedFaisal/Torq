import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth';
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

			await authClient.signIn.email(
				{
					email: data.email,
					password: data.password,
					callbackURL: '/dashboard',
				},
				{
					onRequest: () => setIsPending(true),
					onSuccess: () => {
						setIsPending(false);
						navigate('/dashboard');
					},
					onError: (ctx) => {
						setIsPending(false);
						setError(ctx.error.message);
					},
				},
			);
		},
		[navigate],
	);

	return { mutate, isPending, error };
}
