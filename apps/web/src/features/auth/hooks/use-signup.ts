import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth';
import { useAuthStore } from '@/store/use-auth-store';
import type { SignupEmailInput } from '../schema';

type Step = 'email' | 'otp';

interface UseSignupReturn {
	/** Current step of the OTP flow */
	step: Step;
	/** Send OTP to the provided email */
	sendOtp: (data: SignupEmailInput) => Promise<void>;
	/** Verify the OTP and sign in */
	verifyOtp: (otp: string) => Promise<void>;
	/** Resend the OTP to the same email */
	resendOtp: () => Promise<void>;
	/** Seconds remaining before resend is allowed (0 = ready) */
	resendCooldown: number;
	/** Whether a request is in flight */
	isPending: boolean;
	/** Server-level error */
	error: string | null;
}

export function useSignup(): UseSignupReturn {
	const navigate = useNavigate();
	const [step, setStep] = useState<Step>('email');
	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [resendCooldown, setResendCooldown] = useState(0);

	// Keep email across steps without re-renders
	const emailRef = useRef('');

	// Countdown timer for resend cooldown
	useEffect(() => {
		if (resendCooldown <= 0) return;
		const timer = setInterval(() => {
			setResendCooldown((prev) => (prev <= 1 ? 0 : prev - 1));
		}, 1000);
		return () => clearInterval(timer);
	}, [resendCooldown]);

	const sendOtp = useCallback(async (data: SignupEmailInput) => {
		setError(null);
		setIsPending(true);

		try {
			const { error: apiError } = await authClient.emailOtp.sendVerificationOtp(
				{
					email: data.email,
					type: 'sign-in',
				},
			);

			if (apiError) {
				const msg = apiError.message || 'Failed to send OTP';
				setError(msg);
				toast.error(msg);
				return;
			}

			toast.success('Code sent! Check your email.');
			emailRef.current = data.email;
			setResendCooldown(60);
			setStep('otp');
		} catch (err: any) {
			const msg =
				err?.message || 'An internal error occurred. Please try again.';
			setError(msg);
			toast.error(msg);
		} finally {
			setIsPending(false);
		}
	}, []);

	const verifyOtp = useCallback(
		async (otp: string) => {
			setError(null);
			setIsPending(true);

			try {
				const { error: apiError } = await authClient.signIn.emailOtp({
					email: emailRef.current,
					otp,
				});

				if (apiError) {
					const msg = apiError.message || 'Invalid OTP';
					setError(msg);
					toast.error(msg);
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

				toast.success('Successfully verified & signed in');
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

	const resendOtp = useCallback(async () => {
		if (!emailRef.current || resendCooldown > 0) return;

		setError(null);
		setIsPending(true);

		try {
			const { error: apiError } = await authClient.emailOtp.sendVerificationOtp(
				{
					email: emailRef.current,
					type: 'sign-in',
				},
			);

			if (apiError) {
				const msg = apiError.message || 'Failed to resend OTP';
				setError(msg);
				toast.error(msg);
				return;
			}

			toast.success('Code resent');
			setResendCooldown(60);
		} catch (err: any) {
			const msg =
				err?.message || 'An internal error occurred. Please try again.';
			setError(msg);
			toast.error(msg);
		} finally {
			setIsPending(false);
		}
	}, [resendCooldown]);

	return {
		step,
		sendOtp,
		verifyOtp,
		resendOtp,
		resendCooldown,
		isPending,
		error,
	};
}
