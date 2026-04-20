import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { FeatureBentoGrid } from '@/components/ui/bento-features';
import { Button } from '@/components/ui/button';
import { TorqEngine } from '@/components/ui/torq-engine';
import { useAppConfig } from '@/lib/app-config';

const ease = [0.25, 1, 0.5, 1] as const;
const fadeUp = (delay: number) => ({
	initial: { opacity: 0, y: 20 } as const,
	animate: { opacity: 1, y: 0 } as const,
	transition: { duration: 0.6, delay, ease } as const,
});

export function HomePage() {
	const { authEnabled } = useAppConfig();

	return (
		<div
			className="relative min-h-svh overflow-hidden"
			style={{ background: 'oklch(0.08 0.005 285)' }}
		>
			<div
				className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[15%]"
				style={{
					width: '110vw',
					maxWidth: 1200,
					height: '60vh',
					background:
						'radial-gradient(ellipse at center, oklch(0.60 0.13 163 / 0.08) 0%, transparent 65%)',
					filter: 'blur(50px)',
				}}
			/>

			<motion.nav
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease }}
				className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12"
			>
				<Link to="/" className="select-none">
					<span className="text-xl font-black tracking-tighter text-white">
						Torq
					</span>
				</Link>

				{authEnabled && (
					<Link
						to="/login"
						className="text-[13px] font-medium text-white/40 hover:text-white transition-colors"
					>
						Log in
					</Link>
				)}
			</motion.nav>

			<section className="relative z-10 flex flex-col items-center gap-12 px-6 md:px-12 pt-20 md:pt-32 pb-16 max-w-4xl mx-auto">
				{/* Center — copy */}
				<div className="flex-1 flex flex-col items-center text-center max-w-2xl">
					<motion.div {...fadeUp(0.05)} className="mb-5"></motion.div>

					<motion.h1
						{...fadeUp(0.15)}
						className="font-bold tracking-tight leading-[1.08]"
						style={{ fontSize: 'clamp(36px, 5.5vw, 60px)' }}
					>
						<span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
							Workflows that move{' '}
						</span>
						<br />
						<span className="bg-gradient-to-r from-primary via-emerald-400 to-teal-300 bg-clip-text text-transparent">
							at the speed of thought
						</span>
					</motion.h1>

					<motion.p
						{...fadeUp(0.28)}
						className="mt-5 text-[15px] md:text-base text-white/35 leading-relaxed max-w-md"
					>
						Design, trigger, and monitor CI/CD pipelines from a&nbsp;single
						dashboard. Self-host or use the cloud.
					</motion.p>

					<motion.div
						{...fadeUp(0.4)}
						className="mt-8 flex flex-wrap justify-center items-center gap-3"
					>
						<Link to={authEnabled ? '/signup' : '/dashboard'}>
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.97 }}
								transition={{ type: 'spring', stiffness: 400, damping: 25 }}
							>
								<Button
									size="lg"
									className="font-semibold text-sm px-7 h-11 rounded-xl shadow-[0_0_30px_-6px_oklch(0.60_0.13_163_/_0.5)]"
								>
									{authEnabled ? 'Start for free' : 'Open Dashboard'}
								</Button>
							</motion.div>
						</Link>
						<a href="https://github.com" target="_blank" rel="noreferrer">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.97 }}
								transition={{ type: 'spring', stiffness: 400, damping: 25 }}
							>
								<Button
									variant="outline"
									size="lg"
									className="font-medium text-sm px-7 h-11 rounded-xl border-white/10 text-white/50 bg-transparent hover:text-white hover:bg-white/4 hover:border-white/20"
								>
									Documentation
								</Button>
							</motion.div>
						</a>
					</motion.div>
				</div>
			</section>

			<div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
				<div className="h-px bg-linear-to-r from-transparent via-white/6 to-transparent" />
			</div>

			<FeatureBentoGrid />

			<div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
				<div className="h-px bg-linear-to-r from-transparent via-white/6 to-transparent" />
			</div>

			<section className="relative z-10 w-full py-24 flex flex-col items-center overflow-hidden">
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-50px' }}
					transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
					className="text-center mb-10 px-6"
				>
					<h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
						Powered by Torq Engine
					</h2>
					<p className="mt-3 text-sm md:text-base text-white/30 max-w-md mx-auto">
						Robust pipeline execution at the core.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					whileInView={{ opacity: 1 }}
					viewport={{ once: true, margin: '-50px' }}
					transition={{ duration: 0.7, ease: [0.25, 1, 0.5, 1] }}
					className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center mt-4"
				>
					<TorqEngine
						className="w-full h-full z-10"
						animateLines={true}
						animateMarkers={true}
						animateText={true}
						showCpuConnections={true}
					/>
				</motion.div>
			</section>

			{/* ── Footer ── */}
			<footer className="relative z-10 flex items-center justify-center pb-10 px-6">
				<p className="text-[11px] text-white/15 tracking-wide">
					&copy; {new Date().getFullYear()} Torq &middot; Workflow Execution
					Platform
				</p>
			</footer>
		</div>
	);
}
