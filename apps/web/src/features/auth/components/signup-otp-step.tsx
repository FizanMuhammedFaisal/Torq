import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type SignupOtpInput, signupOtpSchema } from '../schema';
import { fieldVariants } from './animations';

export function OtpStep({
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
							<p className="mt-1 text-xs text-destructive text-center">
								{errors.otp.message}
							</p>
						)}
					</Field>
				</motion.div>

				<motion.div
					variants={fieldVariants}
					initial="hidden"
					animate="visible"
					className="pt-1 flex flex-col gap-3"
				>
					<Field>
						<motion.div whileTap={{ scale: isPending ? 1 : 0.97 }}>
							<Button
								type="submit"
								className="w-full font-semibold"
								disabled={isPending}
							>
								{isPending ? 'Verifying…' : 'Verify & Continue'}
							</Button>
						</motion.div>
					</Field>

					<div className="text-center">
						<button
							type="button"
							onClick={onResend}
							disabled={resendCooldown > 0 || isPending}
							className="text-xs text-white/40 hover:text-white transition-colors disabled:opacity-50 disabled:hover:text-white/40"
						>
							{resendCooldown > 0
								? `Resend code in ${resendCooldown}s`
								: "Didn't receive a code? Resend"}
						</button>
					</div>
				</motion.div>
			</FieldGroup>
		</form>
	);
}
