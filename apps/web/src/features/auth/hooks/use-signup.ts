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

		const { error: apiError } = await authClient.emailOtp.sendVerificationOtp({
			email: data.email,
			type: 'sign-in',
		});

		setIsPending(false);

		if (apiError) {
			setError(apiError.message ?? 'Failed to send OTP');
			toast.error(apiError.message ?? 'Failed to send OTP');
			return;
		}

		toast.success('Code sent! Check your email.');
		emailRef.current = data.email;
		setResendCooldown(60);
		setStep('otp');
	}, []);

	const verifyOtp = useCallback(
		async (otp: string) => {
			setError(null);
			setIsPending(true);

			const { error: apiError } = await authClient.signIn.emailOtp({
				email: emailRef.current,
				otp,
			});

			if (apiError) {
				setIsPending(false);
				setError(apiError.message ?? 'Invalid OTP');
				toast.error(apiError.message ?? 'Invalid OTP');
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

			setIsPending(false);
			toast.success('Successfully verified & signed in');
			navigate('/dashboard');
		},
		[navigate],
	);

	const resendOtp = useCallback(async () => {
		if (!emailRef.current || resendCooldown > 0) return;

		setError(null);
		setIsPending(true);

		const { error: apiError } = await authClient.emailOtp.sendVerificationOtp({
			email: emailRef.current,
			type: 'sign-in',
		});

		setIsPending(false);

		if (apiError) {
			setError(apiError.message ?? 'Failed to resend OTP');
			toast.error(apiError.message ?? 'Failed to resend OTP');
			return;
		}

		toast.success('Code resent');
		setResendCooldown(60);
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
