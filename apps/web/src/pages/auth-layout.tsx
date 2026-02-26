import * as React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const taglines = [
	{ text: 'Automate any workflow in minutes, not months.', tag: 'Built for speed' },
	{ text: 'Visual pipelines that actually make sense.', tag: 'Clarity first' },
	{ text: 'Run, monitor, and iterate — all in one place.', tag: 'End-to-end control' },
];

function BrandPanel() {
	const [index, setIndex] = React.useState(0);

	React.useEffect(() => {
		const t = setInterval(() => setIndex((i) => (i + 1) % taglines.length), 4000);
		return () => clearInterval(t);
	}, []);

	return (
		<div
			className="relative hidden lg:flex lg:w-[45%] flex-col justify-center p-12 overflow-hidden"
			style={{ background: 'oklch(0.10 0.005 285)' }}
		>
			{/* Grid */}
			<div
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						'linear-gradient(to right,rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(to bottom,rgba(255,255,255,0.04) 1px,transparent 1px)',
					backgroundSize: '40px 40px',
				}}
			/>
			{/* Glow — per DESIGN.md: 20% opacity, blur-120 */}
			<div className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 size-[480px] rounded-full bg-primary opacity-[0.20] blur-[120px]" />

			<div className="relative z-10 flex flex-col gap-8 max-w-md">
				{/* Wordmark */}
				<div>
					<div className="flex items-end leading-none select-none">
						<span
							className="text-white font-black tracking-tight"
							style={{ fontSize: 'clamp(48px, 5.5vw, 72px)' }}
						>
							Tor
						</span>
						<span
							className="text-primary font-black tracking-tight"
							style={{ fontSize: 'clamp(48px, 5.5vw, 72px)' }}
						>
							q
						</span>
					</div>
					<p className="mt-1.5 text-xs font-medium tracking-[0.18em] text-white/30 uppercase">
						Workflow Execution Platform
					</p>
				</div>

				{/* Tagline carousel */}
				<div>
					<AnimatePresence mode="wait">
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
						>
							<blockquote className="text-lg font-medium text-white/70 leading-relaxed">
								&ldquo;{taglines[index].text}&rdquo;
							</blockquote>
							<p className="mt-2 text-xs font-semibold tracking-widest text-white/25 uppercase">
								{taglines[index].tag}
							</p>
						</motion.div>
					</AnimatePresence>
					<div className="mt-4 flex items-center gap-1.5">
						{taglines.map((tl) => (
							<button
								type="button"
								key={tl.tag}
								onClick={() => setIndex(taglines.indexOf(tl))}
								aria-label={tl.tag}
								className="h-1 rounded-full transition-all duration-300 focus-visible:outline-none"
								style={{
									width: taglines[index].tag === tl.tag ? 18 : 5,
									background:
										taglines[index].tag === tl.tag
											? 'var(--color-primary)'
											: 'rgba(255,255,255,0.15)',
								}}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export function AuthLayout() {
	const location = useLocation();

	return (
		<div className="flex min-h-svh">
			<BrandPanel />

			{/* Form panel — per DESIGN.md §5: bg-background */}
			<div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 bg-background">
				<AnimatePresence mode="wait">
					<motion.div
						key={location.pathname}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
						className="w-full max-w-[380px]"
					>
						<Outlet />
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
