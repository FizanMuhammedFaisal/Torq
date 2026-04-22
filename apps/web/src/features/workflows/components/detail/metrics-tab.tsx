import { useMemo } from 'react';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { GearsIcon, File02Icon } from '@hugeicons/core-free-icons';
import { AnimatedCounter } from '@/components/ui/animated-counter';



import { useWorkflowDetail } from './workflow-context';

export function MetricsTab() {
	const { workflow, runs } = useWorkflowDetail();
	const workflowId = workflow.id;
	const successRate = runs.length > 0 ? Math.round((runs.filter(r => r.status === 'SUCCESS').length / runs.length) * 100) : 0;
	const totalRuns = runs.length;

	// Generate mock historical run data for the histogram
	const history = useMemo(() => {
		return Array.from({ length: 42 })
			.map((_, i) => {
				const isSuccess = Math.random() > (100 - successRate) / 100;
				const baseSec = 150; // 2m 30s base
				const durationSec = isSuccess
					? baseSec + (Math.random() * 60 - 30)
					: Math.random() * 45 + 10;
				return {
					id: `hist-${i}`,
					status: isSuccess ? 'SUCCESS' : 'FAILED',
					durationSec,
					label: `Run #${128 - i}`,
				};
			})
			.reverse();
	}, [successRate]);

	const maxDuration = Math.max(...history.map((h) => h.durationSec));

	return (
		<div className="space-y-12 pb-12">
			{/* Widget 1: Total Compute / "Screen Time" style */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="flex flex-col items-center justify-center text-center pt-4"
			>
				<h3 className="text-[13px] font-semibold tracking-widest uppercase text-white/40 mb-3 flex items-center gap-2">
					<HugeiconsIcon icon={GearsIcon} className="size-4 text-blue-400" />
					Total Compute Time
				</h3>
				<div className="flex items-baseline justify-center gap-2">
					<span className="text-6xl sm:text-7xl font-light tracking-tighter text-white">48</span>
					<span className="text-2xl sm:text-3xl font-medium text-white/40 mb-1">h</span>
					<span className="text-6xl sm:text-7xl font-light tracking-tighter text-white ml-2">
						12
					</span>
					<span className="text-2xl sm:text-3xl font-medium text-white/40 mb-1">m</span>
				</div>
				<p className="text-[14px] text-white/30 mt-4 max-w-sm">
					Aggregated duration across <AnimatedCounter value={totalRuns} /> total
					executions since creation.
				</p>
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Widget 2: Execution History Histogram (Battery/Usage Style) */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="lg:col-span-2 rounded-3xl border border-white/4 bg-neutral-950 p-6 sm:p-8 flex flex-col"
					style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.02)' }}
				>
					<div className="flex items-center justify-between mb-8">
						<div>
							<h3 className="text-[16px] font-semibold text-white/90">Execution History</h3>
							<p className="text-[13px] text-white/40 mt-1">Duration of the last 42 runs</p>
						</div>
						<div className="flex items-center gap-3 text-[12px] font-medium text-white/40">
							<div className="flex items-center gap-1.5">
								<span className="size-2.5 rounded-sm bg-emerald-500/80" /> Passed
							</div>
							<div className="flex items-center gap-1.5">
								<span className="size-2.5 rounded-sm bg-red-500/80" /> Failed
							</div>
						</div>
					</div>

					<div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-2 h-[180px] w-full pt-4 border-b border-white/5 pb-2">
						{history.map((run, i) => {
							const heightPct = Math.max((run.durationSec / maxDuration) * 100, 4); // min 4% height
							const isSuccess = run.status === 'SUCCESS';
							return (
								<div
									key={run.id}
									className="group relative flex-1 flex justify-center h-full items-end"
								>
									{/* Tooltip */}
									<div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-zinc-900 border border-white/10 text-white text-[11px] rounded-md px-2.5 py-1.5 pointer-events-none whitespace-nowrap z-10 shadow-xl">
										<div className="font-semibold">{run.label}</div>
										<div className={`text-${isSuccess ? 'emerald' : 'red'}-400`}>
											{Math.round(run.durationSec)}s
										</div>
									</div>
									<motion.div
										initial={{ height: 0 }}
										animate={{ height: `${heightPct}%` }}
										transition={{ duration: 0.7, delay: i * 0.01 + 0.2, ease: 'easeOut' }}
										className={`w-full rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-crosshair ${isSuccess
											? 'bg-gradient-to-t from-emerald-600/60 to-emerald-400'
											: 'bg-gradient-to-t from-red-600/80 to-red-400'
											}`}
									/>
								</div>
							);
						})}
					</div>
					<div className="flex justify-between text-[11px] text-white/30 pt-3 font-mono">
						<span>Older</span>
						<span>Recent</span>
					</div>
				</motion.div>

				{/* Widget 3: Quality & Reliability Donut */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="rounded-3xl border border-white/4 bg-neutral-950 p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden"
					style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.02)' }}
				>
					<h3 className="text-[16px] font-semibold text-white/90 self-start w-full relative z-10">
						Reliability
					</h3>
					<p className="text-[13px] text-white/40 self-start w-full mt-1 relative z-10">
						Success vs Failure ratio
					</p>

					<div className="relative size-48 mt-6 flex items-center justify-center">
						<svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
							<title>Reliability Activity Ring</title>
							{/* Background Track */}
							<circle
								cx="50"
								cy="50"
								r="40"
								stroke="rgba(255,255,255,0.05)"
								strokeWidth="12"
								fill="none"
							/>

							{/* Success Value (Emerald) */}
							<motion.circle
								cx="50"
								cy="50"
								r="40"
								stroke="url(#successGradient)"
								strokeWidth="12"
								fill="none"
								strokeLinecap="round"
								strokeDasharray="251.2" // 2 * pi * 40
								initial={{ strokeDashoffset: 251.2 }}
								animate={{ strokeDashoffset: 251.2 - (251.2 * successRate) / 100 }}
								transition={{ type: 'spring', stiffness: 40, damping: 15, delay: 0.5 }}
							/>

							<defs>
								<linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
									<stop offset="0%" stopColor="#34d399" />
									<stop offset="100%" stopColor="#059669" />
								</linearGradient>
							</defs>
						</svg>
						<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
							<span className="text-3xl font-bold tracking-tight text-white mb-0.5">
								<AnimatedCounter value={successRate} />%
							</span>
							<span className="text-[11px] font-medium text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded-full">
								Pass
							</span>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Widget 4: YAML Version History / App Updates */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.3 }}
				className="rounded-3xl border border-white/4 bg-neutral-950 p-6 sm:p-8"
				style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.02)' }}
			>
				<h3 className="text-[16px] font-semibold text-white/90 mb-1">Configuration History</h3>
				<p className="text-[13px] text-white/40 mb-6">
					Recent revisions of this workflow's YAML specification.
				</p>

				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white/2 border border-emerald-500/20 relative overflow-hidden">
						<div className="absolute -right-10 -bottom-10 size-32 bg-emerald-500/10 rounded-full blur-[40px] pointer-events-none" />
						<div className="size-10 shrink-0 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30 text-emerald-400">
							<HugeiconsIcon icon={File02Icon} className="size-5" />
						</div>
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-1">
								<h4 className="text-[15px] font-bold text-white">Version 3.0 (Active)</h4>
								<span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
									Current
								</span>
							</div>
							<p className="text-[13px] text-white/50 mb-3">
								Added parallel step execution for unit-tests and type-check to improve baseline
								duration.
							</p>
							<div className="flex items-center gap-4 text-[12px] font-medium">
								<span className="text-white/30">Modified 3 days ago</span>
								<span className="text-white/40 border-l border-white/10 pl-4">24 Runs</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white/1 border border-white/3">
						<div className="size-10 shrink-0 rounded-full bg-white/3 flex items-center justify-center border border-white/5 text-white/40">
							<span className="font-mono text-[12px] font-bold">V2</span>
						</div>
						<div className="flex-1">
							<h4 className="text-[15px] font-semibold text-white/80 mb-1">Version 2.0</h4>
							<p className="text-[13px] text-white/40 mb-3">
								Implemented retry policy on npm install. Moved secrets to secure dynamic context.
							</p>
							<div className="flex items-center gap-4 text-[12px] font-medium">
								<span className="text-white/30">Modified 2 weeks ago</span>
								<span className="text-white/40 border-l border-white/10 pl-4">81 Runs</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white/1 border border-white/3">
						<div className="size-10 shrink-0 rounded-full bg-white/3 flex items-center justify-center border border-white/5 text-white/40">
							<span className="font-mono text-[12px] font-bold">V1</span>
						</div>
						<div className="flex-1">
							<h4 className="text-[15px] font-semibold text-white/60 mb-1">Version 1.0</h4>
							<p className="text-[13px] text-white/30 mb-3">
								Initial generic boilerplate generated by Torq CLI.
							</p>
							<div className="flex items-center gap-4 text-[12px] font-medium">
								<span className="text-white/30">Created 2 months ago</span>
								<span className="text-white/40 border-l border-white/10 pl-4">12 Runs</span>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
