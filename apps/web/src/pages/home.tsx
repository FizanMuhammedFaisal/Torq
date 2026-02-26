import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';

/* ─── Constants ─── */
const ease = [0.25, 1, 0.5, 1] as const;
const fadeUp = (delay: number) => ({
	initial: { opacity: 0, y: 20 } as const,
	animate: { opacity: 1, y: 0 } as const,
	transition: { duration: 0.6, delay, ease } as const,
});

/* ─────────────────────────── Hero code snippet ─────────────────────────── */
/* A compact, live-feeling terminal showing a Torq workflow being triggered */
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
			{/* Soft glow behind */}
			<div className="absolute -inset-6 rounded-3xl bg-primary/[0.05] blur-2xl" />

			<div className="relative rounded-xl border border-white/[0.07] bg-[oklch(0.10_0.005_285)] overflow-hidden shadow-2xl shadow-black/40">
				{/* Title bar */}
				<div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
					<div className="flex gap-1.5">
						<div className="size-2.5 rounded-full bg-white/[0.08]" />
						<div className="size-2.5 rounded-full bg-white/[0.08]" />
						<div className="size-2.5 rounded-full bg-white/[0.08]" />
					</div>
					<span className="flex-1 text-center text-[10px] text-white/20 font-medium">terminal</span>
				</div>

				{/* Code body */}
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
					{/* Blinking cursor */}
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
				<path
					d="M4 10h4m4 0h4M10 4v4m0 4v4"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
				<circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
			</svg>
		),
		span: 'col-span-2',
	},
	{
		title: 'Live Logs',
		desc: 'Stream execution logs in real-time via WebSocket. Filter by step, search across runs.',
		icon: (
			<svg className="size-5" viewBox="0 0 20 20" fill="none">
				<path
					d="M3 5h14M3 10h10M3 15h6"
					stroke="currentColor"
					strokeWidth="1.5"
					strokeLinecap="round"
				/>
			</svg>
		),
		span: 'col-span-1',
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
		span: 'col-span-1',
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
		span: 'col-span-1',
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
		span: 'col-span-2',
	},
];

function FeatureGrid() {
	return (
		<section className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-16 py-24">
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
						className={`group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-colors hover:border-white/[0.12] hover:bg-white/[0.03] md:${f.span}`}
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
				initial={{ opacity: 0, y: -12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease }}
				className="relative z-20 flex items-center justify-between px-6 py-5 md:px-16"
			>
				<Link to="/" className="flex items-baseline select-none group">
					<span className="font-black tracking-tighter text-white text-[22px]">Tor</span>
					<span className="font-black tracking-tighter text-primary text-[22px]">q</span>
				</Link>

				<div className="flex items-center gap-2">
					<Link to="/login">
						<Button
							variant="ghost"
							size="sm"
							className="text-white/50 hover:text-white hover:bg-white/[0.06] text-[13px] font-medium rounded-lg"
						>
							Log in
						</Button>
					</Link>
					<Link to="/signup">
						<motion.div whileTap={{ scale: 0.97 }}>
							<Button
								size="sm"
								className="text-[13px] font-semibold rounded-lg shadow-[0_0_20px_-4px_oklch(0.60_0.13_163_/_0.4)]"
							>
								Get Started
							</Button>
						</motion.div>
					</Link>
				</div>
			</motion.nav>

			{/* ── Hero: text left + terminal right ── */}
			<section className="relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 px-6 md:px-16 pt-16 md:pt-28 pb-12 max-w-6xl mx-auto">
				{/* Left — text */}
				<div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left">
					<motion.div {...fadeUp(0.05)} className="mb-6">
						<div className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1.5">
							<span className="relative flex size-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-primary" />
							</span>
							<span className="text-[11px] font-medium tracking-wide text-white/40 uppercase">
								Now in Beta
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
						Design, trigger, and monitor CI/CD pipelines from a single dashboard. Self-host with
						Torq Core, or use Torq Cloud.
					</motion.p>

					<motion.div {...fadeUp(0.4)} className="mt-8 flex flex-wrap items-center gap-3">
						<Link to="/signup">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.97 }}
								transition={{ type: 'spring', stiffness: 400, damping: 25 }}
							>
								<Button
									size="lg"
									className="font-semibold text-sm px-7 h-11 rounded-xl shadow-[0_0_30px_-6px_oklch(0.60_0.13_163_/_0.5)]"
								>
									Start building — free
								</Button>
							</motion.div>
						</Link>
						<Link to="/login">
							<motion.div
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.97 }}
								transition={{ type: 'spring', stiffness: 400, damping: 25 }}
							>
								<Button
									variant="outline"
									size="lg"
									className="font-medium text-sm px-7 h-11 rounded-xl border-white/[0.08] text-white/60 bg-white/[0.03] hover:text-white hover:bg-white/[0.06] hover:border-white/[0.15]"
								>
									Documentation
								</Button>
							</motion.div>
						</Link>
					</motion.div>
				</div>

				{/* Right — live terminal */}
				<motion.div {...fadeUp(0.3)} className="flex-shrink-0 w-full lg:w-auto">
					<HeroTerminal />
				</motion.div>
			</section>

			{/* ── Divider line ── */}
			<div className="relative z-10 max-w-5xl mx-auto px-6 md:px-16">
				<div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
			</div>

			{/* ── Feature grid ── */}
			<FeatureGrid />

			{/* ── Footer ── */}
			<footer className="relative z-10 flex items-center justify-center pb-10 px-6">
				<p className="text-[11px] text-white/15 tracking-wide">
					&copy; {new Date().getFullYear()} Torq &middot; Workflow Execution Platform
				</p>
			</footer>
		</div>
	);
}
