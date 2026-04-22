import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion, type Variants } from 'motion/react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth';
import { cn } from '@/lib/utils';

const fieldVariants: Variants = {
	hidden: { opacity: 0, y: 6 },
	visible: (custom: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.16,
			delay: 0.08 * custom,
			ease: [0.25, 1, 0.5, 1],
		},
	}),
};

export function ForgotPasswordForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const navigate = useNavigate();

	const [step, setStep] = useState<1 | 2>(1);
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const [isPending, setIsPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSendOtp = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return setError('Email is required');
		setError(null);
		setIsPending(true);

		const { error: reqError } = await authClient.emailOtp.sendVerificationOtp({
			email,
			type: 'forget-password',
		});

		setIsPending(false);
		if (reqError) {
			setError(reqError.message || 'Failed to send OTP');
			return;
		}

		setStep(2);
	};

	const handleResetPassword = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!otp || !newPassword)
			return setError('OTP and New Password are required');
		if (newPassword.length < 8)
			return setError('Password must be at least 8 characters');
		setError(null);
		setIsPending(true);

		const { error: reqError } = await authClient.emailOtp.resetPassword({
			email,
			otp,
			password: newPassword,
		});

		setIsPending(false);
		if (reqError) {
			setError(reqError.message || 'Failed to reset password');
			return;
		}

		// Success
		navigate('/login', { replace: true });
	};

	return (
		<div className={cn('flex flex-col gap-5', className)} {...props}>
			{step === 1 ? (
				<form onSubmit={handleSendOtp}>
					<FieldGroup className="gap-4">
						{/* Header */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={0}
							className="flex flex-col gap-1.5 mb-2 text-center"
						>
							<h1 className="text-xl font-bold tracking-tight text-white">
								Reset Password
							</h1>
							<p className="text-sm text-white/35">
								Enter your email to receive a reset code.
							</p>
						</motion.div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive"
							>
								{error}
							</motion.div>
						)}

						{/* Email Input */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={1}
						>
							<Field>
								<FieldLabel
									htmlFor="reset-email"
									className="text-xs font-medium text-white/50"
								>
									Email
								</FieldLabel>
								<Input
									id="reset-email"
									type="email"
									placeholder="john.black@example.com"
									disabled={isPending}
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</Field>
						</motion.div>

						{/* Submit */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={2}
							className="pt-1"
						>
							<Field>
								<motion.div whileTap={{ scale: isPending ? 1 : 0.97 }}>
									<Button
										type="submit"
										className="w-full font-semibold"
										disabled={isPending}
									>
										{isPending ? 'Sending...' : 'Send Reset Link'}
									</Button>
								</motion.div>
							</Field>
						</motion.div>

						{/* Back to Login */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={3}
							className="pt-2 text-center"
						>
							<Link
								to="/login"
								className="text-xs text-white/40 hover:text-white transition-colors"
							>
								Wait, I remember my password
							</Link>
						</motion.div>
					</FieldGroup>
				</form>
			) : (
				<form onSubmit={handleResetPassword}>
					<FieldGroup className="gap-4">
						{/* Header */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={0}
							className="flex flex-col gap-1.5 mb-2 text-center"
						>
							<h1 className="text-xl font-bold tracking-tight text-white">
								Enter Code
							</h1>
							<p className="text-sm text-white/35">
								We sent a code to <span className="text-white/70">{email}</span>
							</p>
						</motion.div>

						{error && (
							<motion.div
								initial={{ opacity: 0, y: -4 }}
								animate={{ opacity: 1, y: 0 }}
								className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive"
							>
								{error}
							</motion.div>
						)}

						{/* OTP Input */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={1}
						>
							<Field>
								<FieldLabel
									htmlFor="reset-otp"
									className="text-xs font-medium text-white/50"
								>
									Verification Code
								</FieldLabel>
								<Input
									id="reset-otp"
									type="text"
									placeholder="e.g. 123456"
									disabled={isPending}
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									autoComplete="one-time-code"
								/>
							</Field>
						</motion.div>

						{/* New Password Input */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={2}
						>
							<Field>
								<FieldLabel
									htmlFor="reset-password-new"
									className="text-xs font-medium text-white/50"
								>
									New Password
								</FieldLabel>
								<div className="relative">
									<Input
										id="reset-password-new"
										type={showPassword ? 'text' : 'password'}
										placeholder="••••••••"
										disabled={isPending}
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										className="pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowPassword((prev) => !prev)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
										tabIndex={-1}
									>
										<HugeiconsIcon
											icon={showPassword ? ViewOffIcon : ViewIcon}
											className="size-4"
											strokeWidth={2}
										/>
									</button>
								</div>
							</Field>
						</motion.div>

						{/* Submit */}
						<motion.div
							variants={fieldVariants}
							initial="hidden"
							animate="visible"
							custom={3}
							className="pt-1"
						>
							<Field>
								<motion.div whileTap={{ scale: isPending ? 1 : 0.97 }}>
									<Button
										type="submit"
										className="w-full font-semibold"
										disabled={isPending}
									>
										{isPending ? 'Resetting...' : 'Reset Password'}
									</Button>
								</motion.div>
							</Field>
						</motion.div>
					</FieldGroup>
				</form>
			)}
		</div>
	);
}
