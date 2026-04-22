import { AnimatePresence, motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { useSignup } from '../hooks';
import { fieldVariants, stepVariants } from './animations';
import { EmailStep } from './signup-email-step';
import { OtpStep } from './signup-otp-step';

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
