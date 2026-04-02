import { AnimatePresence, motion } from 'motion/react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const ease = [0.25, 1, 0.5, 1] as const;

export function AuthLayout() {
	const location = useLocation();

	return (
		<div
			className="relative flex min-h-svh flex-col items-center"
			style={{ background: 'oklch(0.08 0.005 285)' }}
		>
			<div
				className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[10%]"
				style={{
					width: '90vw',
					maxWidth: 900,
					height: '50vh',
					background:
						'radial-gradient(ellipse at center, oklch(0.60 0.13 163 / 0.06) 0%, transparent 60%)',
					filter: 'blur(60px)',
				}}
			/>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.4, delay: 0.1 }}
				className="relative z-10 w-full px-6 pt-6 md:px-10 md:pt-8"
			>
				<Link
					to="/"
					className="inline-flex items-center gap-1.5 text-[13px] text-white/30 hover:text-white/60 transition-colors"
				>
					<svg className="size-4" viewBox="0 0 16 16" fill="none">
						<path
							d="M10 12L6 8l4-4"
							stroke="currentColor"
							strokeWidth="1.5"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
					Home
				</Link>
			</motion.div>

			<div className="relative z-10 flex flex-1 flex-col items-center justify-center w-full px-6 py-12">
				<motion.div
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease }}
					className="mb-10"
				>
					<Link to="/" className="select-none">
						<span className="text-3xl font-black tracking-tight text-white">
							Torq
						</span>
					</Link>
				</motion.div>

				<AnimatePresence mode="wait">
					<motion.div
						key={location.pathname}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -8 }}
						transition={{ duration: 0.3, ease }}
						className="w-full max-w-[380px] auth-forms"
					>
						<Outlet />
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
