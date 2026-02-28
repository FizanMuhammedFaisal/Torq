import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion, type Variants } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useSignup } from './hooks';
import {
	type SignupEmailInput,
	type SignupOtpInput,
	signupEmailSchema,
	signupOtpSchema,
} from './schema';

const fieldVariants: Variants = {
	hidden: { opacity: 0 },
	visible: () => ({
		opacity: 1,
		transition: {
			duration: 0.16,
			delay: 0.08,
			ease: [0.25, 1, 0.5, 1],
		},
	}),
};

const stepVariants: Variants = {
	enter: { opacity: 0 },
	center: {
		opacity: 1,
		transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
	},
	exit: { opacity: 0, transition: { duration: 0.15 } },
};

function OrDivider() {
	return (
		<div className="flex items-center gap-3 my-1">
			<div className="h-px flex-1 bg-white-[0.06]" />
			<span className="text-[11px] text-white/20 uppercase tracking-wider">
				or
			</span>
			<div className="h-px flex-1 bg-white-[0.06]" />
		</div>
	);
}

function EmailStep({
	isPending,
	serverError,
	onSubmit,
}: {
	isPending: boolean;
	serverError: string | null;
	onSubmit: (data: SignupEmailInput) => void;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupEmailInput>({
		resolver: zodResolver(signupEmailSchema),
		defaultValues: { name: '', email: '' },
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<FieldGroup className="gap-4">
				{/* Header */}
				<motion.div
					variants={fieldVariants}
					initial="hidden"
					animate="visible"
					className="flex flex-col gap-1.5 mb-2 text-center"
				>
					<h1 className="text-xl font-bold tracking-tight text-white">
						Create an account
					</h1>
					<p className="text-sm text-white/35">
						Already have an account?{' '}
						<Link
							to="/login"
							className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
						>
							Log in
						</Link>
					</p>
				</motion.div>

				{serverError && (
					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive"
					>
						{serverError}
					</motion.div>
				)}

				{/* Social auth — side by side */}
				<motion.div variants={fieldVariants} initial="hidden" animate="visible">
					<div className="grid grid-cols-2 gap-2.5">
						<motion.div whileTap={{ scale: 0.97 }}>
							<Button
								variant="outline"
								type="button"
								className="w-full gap-2 text-white/60 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:text-white"
								disabled={isPending}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									aria-hidden="true"
									className="size-4 shrink-0"
								>
									<title>Google</title>
									<path
										d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
										fill="currentColor"
									/>
								</svg>
								Google
							</Button>
						</motion.div>
						<motion.div whileTap={{ scale: 0.97 }}>
							<Button
								variant="outline"
								type="button"
								className="w-full gap-2 text-white/60 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:text-white"
								disabled={isPending}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									aria-hidden="true"
									className="size-4 shrink-0"
								>
									<title>GitHub</title>
									<path
										d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
										fill="currentColor"
									/>
								</svg>
								GitHub
							</Button>
						</motion.div>
					</div>
				</motion.div>

				<motion.div variants={fieldVariants} initial="hidden" animate="visible">
					<OrDivider />
				</motion.div>

				{/* Name */}
				<motion.div variants={fieldVariants} initial="hidden" animate="visible">
					<Field>
						<FieldLabel
							htmlFor="signup-name"
							className="text-xs font-medium text-white/50"
						>
							Full name
						</FieldLabel>
						<Input
							id="signup-name"
							type="text"
							placeholder="John Black"
							disabled={isPending}
							aria-invalid={!!errors.name}
							{...register('name')}
						/>
						{errors.name && (
							<p className="mt-1 text-xs text-destructive">
								{errors.name.message}
							</p>
						)}
					</Field>
				</motion.div>

				{/* Email */}
				<motion.div variants={fieldVariants} initial="hidden" animate="visible">
					<Field>
						<FieldLabel
							htmlFor="signup-email"
							className="text-xs font-medium text-white/50"
						>
							Email
						</FieldLabel>
						<Input
							id="signup-email"
							type="email"
							placeholder="john.black@example.com"
							disabled={isPending}
							aria-invalid={!!errors.email}
							{...register('email')}
						/>
						{errors.email && (
							<p className="mt-1 text-xs text-destructive">
								{errors.email.message}
							</p>
						)}
					</Field>
				</motion.div>

				{/* Submit */}
				<motion.div
					variants={fieldVariants}
					initial="hidden"
					animate="visible"
					className="pt-1"
				>
					<Field>
						<motion.div whileTap={{ scale: isPending ? 1 : 0.97 }}>
							<Button
								type="submit"
								className="w-full font-semibold"
								disabled={isPending}
							>
								{isPending ? 'Sending code…' : 'Continue'}
							</Button>
						</motion.div>
					</Field>
				</motion.div>
			</FieldGroup>
		</form>
	);
}

function OtpStep({
	isPending,
	serverError,
	onSubmit,
	onResend,
	resendCooldown,
}: {
	isPending: boolean;
	serverError: string | null;
	onSubmit: (otp: string) => void;
	onResend: () => void;
	resendCooldown: number;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupOtpInput>({
		resolver: zodResolver(signupOtpSchema),
		defaultValues: { otp: '' },
	});

	return (
		<form onSubmit={handleSubmit((data) => onSubmit(data.otp))}>
			<FieldGroup className="gap-4">
				<motion.div
					variants={fieldVariants}
					initial="hidden"
					animate="visible"
					className="flex flex-col gap-1.5 mb-2 text-center"
				>
					<h1 className="text-xl font-bold tracking-tight text-white">
						Check your email
					</h1>
					<p className="text-sm text-white/35">
						We sent a 6-digit code to your email. Enter it below to continue.
					</p>
				</motion.div>

				{serverError && (
					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						className="rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive"
					>
						{serverError}
					</motion.div>
				)}

				<motion.div variants={fieldVariants} initial="hidden" animate="visible">
					<Field>
						<FieldLabel
							htmlFor="signup-otp"
							className="text-xs font-medium text-white/50"
						>
							Verification code
						</FieldLabel>
						<Input
							id="signup-otp"
							type="text"
							inputMode="numeric"
							autoComplete="one-time-code"
							placeholder="000000"
							maxLength={6}
							disabled={isPending}
							aria-invalid={!!errors.otp}
							className="text-center text-lg tracking-[0.3em] font-mono"
							{...register('otp')}
						/>
						{errors.otp && (
							<p className="mt-1 text-xs text-destructive">
								{errors.otp.message}
							</p>
						)}
					</Field>
				</motion.div>

				<motion.div
					variants={fieldVariants}
					initial="hidden"
					animate="visible"
					className="pt-1"
				>
					<Field>
						<motion.div whileTap={{ scale: isPending ? 1 : 0.97 }}>
							<Button
								type="submit"
								className="w-full font-semibold"
								disabled={isPending}
							>
								{isPending ? 'Verifying…' : 'Verify & sign in'}
							</Button>
						</motion.div>
					</Field>
				</motion.div>

				<motion.div variants={fieldVariants} initial="hidden" animate="visible">
					<p className="text-center text-xs text-white/30">
						Didn&apos;t get the code?{' '}
						<button
							type="button"
							onClick={onResend}
							disabled={isPending || resendCooldown > 0}
							className="text-primary font-medium hover:underline underline-offset-4 transition-colors disabled:opacity-50"
						>
							{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend'}
						</button>
					</p>
				</motion.div>
			</FieldGroup>
		</form>
	);
}

export function SignupForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const {
		step,
		sendOtp,
		verifyOtp,
		resendOtp,
		resendCooldown,
		isPending,
		error: serverError,
	} = useSignup();

	return (
		<div className={cn('flex flex-col gap-5', className)} {...props}>
			<AnimatePresence mode="wait">
				{step === 'email' ? (
					<motion.div
						key="email-step"
						variants={stepVariants}
						initial="enter"
						animate="center"
						exit="exit"
					>
						<EmailStep
							isPending={isPending}
							serverError={serverError}
							onSubmit={sendOtp}
						/>
					</motion.div>
				) : (
					<motion.div
						key="otp-step"
						variants={stepVariants}
						initial="enter"
						animate="center"
						exit="exit"
					>
						<OtpStep
							isPending={isPending}
							serverError={serverError}
							onSubmit={verifyOtp}
							onResend={resendOtp}
							resendCooldown={resendCooldown}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.div variants={fieldVariants} initial="hidden" animate="visible">
				<p className="text-center text-[11px] text-white/20 leading-relaxed">
					By continuing, you agree to our{' '}
					<a
						href="/terms"
						className="underline underline-offset-4 hover:text-white/40 transition-colors"
					>
						Terms
					</a>{' '}
					and{' '}
					<a
						href="/privacy"
						className="underline underline-offset-4 hover:text-white/40 transition-colors"
					>
						Privacy Policy
					</a>
					.
				</p>
			</motion.div>
		</div>
	);
}
