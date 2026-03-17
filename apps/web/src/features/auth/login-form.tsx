import { zodResolver } from '@hookform/resolvers/zod';
import { ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { fieldVariants } from './components/animations';
import { OrDivider } from './components/or-divider';
import { SocialAuth } from './components/social-auth';
import { useLogin } from './hooks';
import { type LoginInput, loginSchema } from './schema';

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'div'>) {
	const { mutate, isPending, error: serverError } = useLogin();
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: '', password: '' },
	});

	const onSubmit = handleSubmit((data) => mutate(data));

	return (
		<div className={cn('flex flex-col gap-5', className)} {...props}>
			<form onSubmit={onSubmit}>
				<FieldGroup className="gap-4">
					{/* Header */}
					<motion.div
						variants={fieldVariants}
						initial="hidden"
						animate="visible"
						className="flex flex-col gap-1.5 mb-2 text-center"
					>
						<h1 className="text-xl font-bold tracking-tight text-white">
							Welcome back
						</h1>
						<p className="text-sm text-white/35">
							Don&apos;t have an account?{' '}
							<Link
								to="/signup"
								className="text-primary font-medium hover:underline underline-offset-4 transition-colors"
							>
								Sign up
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
					<SocialAuth isPending={isPending} />

					<motion.div
						variants={fieldVariants}
						initial="hidden"
						animate="visible"
					>
						<OrDivider />
					</motion.div>

					{/* Email */}
					<motion.div
						variants={fieldVariants}
						initial="hidden"
						animate="visible"
					>
						<Field>
							<FieldLabel
								htmlFor="login-email"
								className="text-xs font-medium text-white/50"
							>
								Email
							</FieldLabel>
							<Input
								id="login-email"
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

					{/* Password */}
					<motion.div
						variants={fieldVariants}
						initial="hidden"
						animate="visible"
					>
						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel
									htmlFor="login-password"
									className="text-xs font-medium text-white/50"
								>
									Password
								</FieldLabel>
								<Link
									to="/forgot-password"
									className="text-xs text-white/25 hover:text-white/50 transition-colors"
								>
									Forgot?
								</Link>
							</div>
							<div className="relative">
								<Input
									id="login-password"
									type={showPassword ? 'text' : 'password'}
									placeholder="••••••••"
									disabled={isPending}
									aria-invalid={!!errors.password}
									className="pr-10"
									{...register('password')}
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
							{errors.password && (
								<p className="mt-1 text-xs text-destructive">
									{errors.password.message}
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
									{isPending ? 'Signing in…' : 'Sign in'}
								</Button>
							</motion.div>
						</Field>
					</motion.div>
				</FieldGroup>
			</form>

			{/* Legal */}
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
