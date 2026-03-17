import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { type SignupEmailInput, signupEmailSchema } from '../schema';
import { fieldVariants } from './animations';
import { OrDivider } from './or-divider';
import { SocialAuth } from './social-auth';

export function EmailStep({
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

				<SocialAuth isPending={isPending} />

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
