import { motion } from 'motion/react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppConfig } from '@/lib/app-config';
import { CpuArchitecture } from '@/components/ui/cpu-architecture';

/* ─── Animation helpers ─── */
const ease = [0.25, 1, 0.5, 1] as const;
const fadeUp = (delay: number) => ({
	initial: { opacity: 0, y: 20 } as const,
	animate: { opacity: 1, y: 0 } as const,
	transition: { duration: 0.6, delay, ease } as const,
});

/* ─────────────────────────── Hero terminal ─────────────────────────── */
const codeLines = [
	{ text: '$ torq run deploy-pipeline', color: 'text-white/70' },
	{ text: '', color: '' },
	{ text: '  ✓ Trigger           0.1s', color: 'text-primary/70' },
	{ text: '  ✓ Install deps      12.4s', color: 'text-primary/70' },
	{ text: '  ✓ Lint & check       8.1s', color: 'text-primary/70' },
	{ text: '  ✓ Test suite        24.3s', color: 'text-primary/70' },
	{ text: '  ● Build artifacts      …', color: 'text-amber-400/70' },
	{ text: '  ○ Deploy to prod', color: 'text-white/20' },
];

function HeroTerminal() {
	const [visibleLines, setVisibleLines] = React.useState(0);

	React.useEffect(() => {
		if (visibleLines >= codeLines.length) return;
		const delay = visibleLines === 0 ? 800 : visibleLines === 1 ? 200 : 300;
		const t = setTimeout(() => setVisibleLines((v) => v + 1), delay);
		return () => clearTimeout(t);
	}, [visibleLines]);

	return (
		<div className="relative w-full max-w-md">
			<div className="absolute -inset-6 rounded-3xl bg-primary/[0.05] blur-2xl" />
			<div className="relative rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.005_285)] overflow-hidden shadow-2xl shadow-black/40">
				<div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
					<div className="flex gap-1.5">
						<div className="size-2.5 rounded-full bg-white/10" />
						<div className="size-2.5 rounded-full bg-white/10" />
						<div className="size-2.5 rounded-full bg-white/10" />
					</div>
					<span className="flex-1 text-center text-[10px] text-white/20 font-medium">terminal</span>
				</div>
				<div className="px-4 py-3.5 font-mono text-[12px] leading-[1.7] min-h-[180px]">
					{codeLines.map((line, i) => (
						<div
							key={`line-${i}`}
							className={`transition-all duration-300 ${
								i < visibleLines
									? `${line.color} translate-y-0 opacity-100`
									: 'opacity-0 translate-y-1'
							}`}
							style={{ transitionDelay: `${i * 30}ms` }}
						>
							{line.text || '\u00A0'}
						</div>
					))}
					{visibleLines >= codeLines.length && (
						<span className="inline-block w-1.5 h-4 bg-primary/60 animate-pulse rounded-sm ml-0.5" />
					)}
				</div>
			</div>
		</div>
	);
}

/* ─────────────────────────── Feature bento grid ─────────────────────────── */
const features = [
	{
		title: 'Workflow Engine',
		desc: 'Define multi-step pipelines with DAG-based execution. Each step runs independently with retry, timeout, and conditional logic.',
		icon: (
			<svg className="size-5" viewBox="0 0 20 20" fill="none">
				<title>DAG Execution</title>
				<path
					d="M4 10h4m4 0h4M10 4v4m0 4v4"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
			</svg>
		),
		span: 'md:col-span-2',
	},
	{
		title: 'Live Logs',
		desc: 'Stream execution logs in real-time via WebSocket. Filter by step, search across runs.',
		icon: (
			<svg className="size-5" viewBox="0 0 20 20" fill="none">
				<title>Logs Stream</title>
				<path
					d="M3 5h14M3 10h10M3 15h6"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		),
		span: 'md:col-span-1',
	},
	{
		title: 'Run History',
		desc: 'Full audit trail of every execution with step-level duration, status, and retry details.',
		icon: (
			<svg className="size-5" viewBox="0 0 20 20" fill="none">
				<circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
				<path d="M10 6v4l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
			</svg>
		),
		span: 'md:col-span-1',
	},
	{
		title: 'Artifacts',
		desc: 'Download build outputs, test reports, and generated files linked to each run.',
		icon: (
			<svg className="size-5" viewBox="0 0 20 20" fill="none">
				<path
					d="M6 3h8l3 4v9a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h2z"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinejoin="round"
				/>
				<path
					d="M10 10v5M8 13l2 2 2-2"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</svg>
		),
		span: 'md:col-span-1',
	},
	{
		title: 'Self-Host or Cloud',
		desc: 'Run Torq Core on your own infra with the same dashboard, or use Torq Cloud with multi-tenant auth out of the box.',
		icon: (
			<svg className="size-5" viewBox="0 0 20 20" fill="none">
				<rect x="3" y="4" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
				<rect x="3" y="11" width="14" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
				<circle cx="6" cy="6.5" r="1" fill="currentColor" />
				<circle cx="6" cy="13.5" r="1" fill="currentColor" />
			</svg>
		),
		span: 'md:col-span-2',
	},
];

function FeatureGrid() {
	return (
		<section className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-24">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-80px' }}
				transition={{ duration: 0.6, ease }}
				className="text-center mb-14"
			>
				<h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
					Everything you need to ship
				</h2>
				<p className="mt-3 text-sm md:text-base text-white/30 max-w-md mx-auto">
					From workflow creation to production deploy — one tool, full control.
				</p>
			</motion.div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
				{features.map((f, i) => (
					<motion.div
						key={f.title}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: '-60px' }}
						transition={{ duration: 0.5, delay: i * 0.07, ease }}
						className={`group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.12] hover:bg-white/[0.03] ${f.span}`}
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="flex items-center justify-center size-9 rounded-lg bg-primary/[0.08] border border-primary/[0.15] text-primary transition-colors group-hover:bg-primary/[0.12]">
								{f.icon}
							</div>
							<h3 className="text-[15px] font-semibold text-white/80">{f.title}</h3>
						</div>
						<p className="text-[13px] text-white/30 leading-relaxed">{f.desc}</p>
					</motion.div>
				))}
			</div>
		</section>
	);
}

/* ─────────────────────────── Page ─────────────────────────── */
export function HomePage() {
	const { authEnabled } = useAppConfig();

	return (
		<div
			className="relative min-h-svh overflow-hidden"
			style={{ background: 'oklch(0.08 0.005 285)' }}
		>
			{/* Background glow */}
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

			{/* ── Nav ── */}
			<motion.nav
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease }}
				className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12"
			>
				{/* Logo — always white, always left */}
				<Link to="/" className="select-none">
					<span className="text-xl font-black tracking-tighter text-white">torq</span>
				</Link>

				{/* Right side — minimal: just login or profile */}
				{authEnabled && (
					<Link
						to="/login"
						className="text-[13px] font-medium text-white/40 hover:text-white transition-colors"
					>
						Log in
					</Link>
				)}
			</motion.nav>

			{/* ── Hero ── */}
			<section className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20 px-6 md:px-12 pt-20 md:pt-32 pb-16 max-w-6xl mx-auto">
				{/* Left — copy */}
				<div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left max-w-xl">
					<motion.div {...fadeUp(0.05)} className="mb-5">
						<div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5">
							<span className="relative flex size-1.5">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
								<span className="relative inline-flex size-1.5 rounded-full bg-primary" />
							</span>
							<span className="text-[11px] font-medium tracking-wide text-white/35 uppercase">
								Beta
							</span>
						</div>
					</motion.div>

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
						Design, trigger, and monitor CI/CD pipelines from a&nbsp;single dashboard. Self-host or
						use the cloud.
					</motion.p>

					<motion.div {...fadeUp(0.4)} className="mt-8 flex flex-wrap items-center gap-3">
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
									className="font-medium text-sm px-7 h-11 rounded-xl border-white/10 text-white/50 bg-transparent hover:text-white hover:bg-white/[0.04] hover:border-white/20"
								>
									Documentation
								</Button>
							</motion.div>
						</a>
					</motion.div>
				</div>

				{/* Right — terminal */}
				<motion.div {...fadeUp(0.3)} className="flex-shrink-0 w-full lg:w-auto">
					<HeroTerminal />
				</motion.div>
			</section>

			{/* ── Divider ── */}
			<div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
				<div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
			</div>

			{/* ── Features ── */}
			<FeatureGrid />

			{/* ── Divider ── */}
			<div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12">
				<div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
			</div>

			{/* ── Engine Architecture Section ── */}
			<section className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-24 flex flex-col items-center overflow-hidden">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.6, ease }}
					className="text-center mb-10"
				>
					<h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
						Powered by Torq Engine
					</h2>
					<p className="mt-3 text-sm md:text-base text-white/30 max-w-md mx-auto">
						Robust pipeline execution at the core.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true, margin: '-80px' }}
					transition={{ duration: 0.8, ease }}
					className="relative w-full max-w-3xl aspect-[2/1] flex items-center justify-center mt-4"
				>
					{/* Glow behind the Engine */}
					<div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full mix-blend-screen" />
					<CpuArchitecture
						className="w-full h-full text-primary/80 drop-shadow-[0_0_15px_oklch(0.60_0.13_163_/_0.5)] z-10"
						animateLines={true}
						animateMarkers={true}
						animateText={true}
						showCpuConnections={true}
						text="TORQ ENGINE"
					/>
				</motion.div>
			</section>

			{/* ── Footer ── */}
			<footer className="relative z-10 flex items-center justify-center pb-10 px-6">
				<p className="text-[11px] text-white/15 tracking-wide">
					&copy; {new Date().getFullYear()} Torq &middot; Workflow Execution Platform
				</p>
			</footer>
		</div>
	);
}
