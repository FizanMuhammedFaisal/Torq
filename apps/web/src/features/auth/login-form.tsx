import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, type Variants } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useLogin } from './hooks';
import { loginSchema, type LoginInput } from './schema';

const fieldVariants: Variants = {
	hidden: { opacity: 0, y: 6 },
	visible: () => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.16,
			delay: 0.08,
			ease: [0.25, 1, 0.5, 1],
		},
	}),
};

function OrDivider() {
	return (
		<div className="flex items-center gap-3 text-xs text-muted-foreground/40">
			<div className="h-px flex-1 bg-border" />
			<span className="text-muted-foreground/50">or</span>
			<div className="h-px flex-1 bg-border" />
		</div>
	);
}

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const { mutate, isPending, error: serverError } = useLogin();

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
		<div className={cn('flex flex-col gap-4', className)} {...props}>
			<form onSubmit={onSubmit}>
				<FieldGroup className="gap-4">
					<motion.div
						variants={fieldVariants}
						initial="hidden"
						animate="visible"
						className="flex flex-col gap-1 mb-1"
					>
						<h1 className="text-xl font-bold tracking-tight text-foreground">Welcome back</h1>
						<FieldDescription className="text-sm text-muted-foreground">
							Don&apos;t have an account?{' '}
							<Link
								to="/signup"
								className="text-primary font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
							>
								Sign up
							</Link>
						</FieldDescription>
					</motion.div>

					{serverError && (
						<motion.div
							initial={{ opacity: 0, y: -4 }}
							animate={{ opacity: 1, y: 0 }}
							className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-sm text-destructive"
						>
							{serverError}
						</motion.div>
					)}

					<motion.div variants={fieldVariants} initial="hidden" animate="visible">
						<Field>
							<FieldLabel htmlFor="login-email" className="text-xs font-medium">
								Email
							</FieldLabel>
							<Input
								id="login-email"
								type="email"
								placeholder="you@company.com"
								disabled={isPending}
								aria-invalid={!!errors.email}
								{...register('email')}
							/>
							{errors.email && (
								<p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
							)}
						</Field>
					</motion.div>

					<motion.div variants={fieldVariants} initial="hidden" animate="visible">
						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor="login-password" className="text-xs font-medium">
									Password
								</FieldLabel>
								<a
									href="/forgot-password"
									className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
								>
									Forgot?
								</a>
							</div>
							<Input
								id="login-password"
								type="password"
								placeholder="••••••••"
								disabled={isPending}
								aria-invalid={!!errors.password}
								{...register('password')}
							/>
							{errors.password && (
								<p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
							)}
						</Field>
					</motion.div>

					<motion.div variants={fieldVariants} initial="hidden" animate="visible" className="pt-1">
						<Field>
							<motion.div whileTap={{ scale: isPending ? 1 : 0.97 }}>
								<Button type="submit" className="w-full font-medium" disabled={isPending}>
									{isPending ? 'Signing in…' : 'Sign in'}
								</Button>
							</motion.div>
						</Field>
					</motion.div>

					<motion.div variants={fieldVariants} initial="hidden" animate="visible">
						<OrDivider />
					</motion.div>

					<motion.div variants={fieldVariants} initial="hidden" animate="visible">
						<Field>
							<motion.div whileTap={{ scale: 0.97 }}>
								<Button variant="outline" type="button" className="w-full" disabled={isPending}>
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
									Continue with Google
								</Button>
							</motion.div>
						</Field>
					</motion.div>
				</FieldGroup>
			</form>

			<motion.div variants={fieldVariants} initial="hidden" animate="visible">
				<p className="text-center text-xs text-muted-foreground/50 leading-relaxed">
					By continuing, you agree to our{' '}
					<a
						href="/terms"
						className="underline underline-offset-4 hover:text-muted-foreground transition-colors"
					>
						Terms
					</a>{' '}
					and{' '}
					<a
						href="/privacy"
						className="underline underline-offset-4 hover:text-muted-foreground transition-colors"
					>
						Privacy Policy
					</a>
					.
				</p>
			</motion.div>
		</div>
	);
}
