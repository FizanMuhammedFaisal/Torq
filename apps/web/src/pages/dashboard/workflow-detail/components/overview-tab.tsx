import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { File02Icon, GearsIcon, GridIcon, Alert02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { MOCK_WORKFLOW, MOCK_RUNS, statusMap } from '../mock-data';

function MetricCard({
	label,
	value,
	accent,
	icon: Icon,
	delay = 0,
}: {
	label: string;
	value: string | number;
	accent?: 'emerald' | 'blue' | 'red' | 'white';
	icon?: any;
	delay?: number;
}) {
	const gradients = {
		emerald:
			'from-emerald-500/[0.06] to-emerald-500/[0.01] border-emerald-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(16,185,129,0.15)]',
		blue: 'from-blue-500/[0.06] to-blue-500/[0.02] border-blue-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(59,130,246,0.15)]',
		red: 'from-red-500/[0.06] to-red-500/[0.02] border-red-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(239,68,68,0.15)]',
		white:
			'from-white/[0.06] to-white/[0.01] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(255,255,255,0.05)]',
	};

	const bgThemes = {
		emerald: 'bg-emerald-500',
		blue: 'bg-blue-500',
		red: 'bg-red-500',
		white: 'bg-white',
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay, ease: [0.25, 1, 0.5, 1] }}
			className={`rounded-xl border bg-gradient-to-br ${gradients[accent || 'white']} p-5 relative overflow-hidden flex flex-col justify-between min-h-[120px] group backdrop-blur-xl`}
		>
			<div
				className={`absolute top-0 right-0 w-32 h-32 ${bgThemes[accent || 'white']}/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all duration-700 group-hover:${bgThemes[accent || 'white']}/15 group-hover:blur-2xl`}
			></div>

			{Icon && (
				<AnimatePresence>
					<motion.div
						className={`absolute -right-2 -bottom-2 pointer-events-none text-${accent || 'white'}-500`}
						initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.8 }}
						animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
						transition={{ duration: 0.8, delay: delay + 0.2, ease: [0.25, 1, 0.5, 1] }}
					>
						<motion.div
							className="opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
							animate={{ y: [0, -5, 0], rotate: [0, 2, 0] }}
							transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
						>
							<HugeiconsIcon icon={Icon} className="w-24 h-24 drop-shadow-md" strokeWidth={1} />
						</motion.div>
					</motion.div>
				</AnimatePresence>
			)}

			<div>
				<h3
					className={`text-[12px] font-medium text-${accent === 'white' ? 'white/50' : `${accent}-400/80`} uppercase tracking-widest mb-1 relative z-10`}
				>
					{label}
				</h3>
			</div>
			<div className="text-[36px] font-mono font-bold tracking-tight relative z-10 mt-1 flex items-center text-white/95 drop-shadow-sm h-[36px]">
				<AnimatedCounter value={value} />
			</div>
		</motion.div>
	);
}

export function OverviewTab() {
	const wf = MOCK_WORKFLOW;

	return (
		<div className="space-y-8 pb-12">
			{/* Stats Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<MetricCard
					label="Total Runs"
					value={MOCK_WORKFLOW.totalRuns}
					accent="white"
					icon={File02Icon}
					delay={0.05}
				/>
				<MetricCard
					label="Avg Duration"
					value={MOCK_WORKFLOW.duration}
					accent="blue"
					icon={GearsIcon}
					delay={0.1}
				/>
				<MetricCard
					label="Last Run"
					value={MOCK_WORKFLOW.lastRun}
					accent="blue"
					icon={GridIcon}
					delay={0.15}
				/>
				<MetricCard
					label="Status"
					value="Valid"
					accent="emerald"
					delay={0.2}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
				{/* About Section */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.25 }}
					className="lg:col-span-1 rounded-3xl border border-white/4 bg-[#0c0c0c] p-6 sm:p-8 flex flex-col relative overflow-hidden"
					style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.02)' }}
				>
					<div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
					<div className="flex items-center gap-3 mb-6 relative z-10">
						<div className="size-10 rounded-full bg-white/3 border border-white/5 flex items-center justify-center text-white/50">
							<HugeiconsIcon icon={File02Icon} className="size-5" />
						</div>
						<h3 className="text-[16px] font-semibold text-white/90">About Workflow</h3>
					</div>
					<p className="text-[14px] text-white/50 leading-relaxed font-light mb-6 flex-1 relative z-10">
						{wf.description}
					</p>
				</motion.div>

				{/* Recent Runs Section */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="lg:col-span-2 rounded-3xl border border-white/4 bg-[#0c0c0c] p-6 sm:p-8"
					style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.02)' }}
				>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="text-[16px] font-semibold text-white/90">Latest Executions</h3>
							<p className="text-[13px] text-white/40 mt-1">Most recent activity for this YAML</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 text-[12px] text-white/40 hover:text-white/80 rounded-full"
						>
							View all
						</Button>
					</div>

					<div className="space-y-3">
						{MOCK_RUNS.slice(0, 4).map((run, i) => {
							const rc = statusMap[run.status];
							const isSuccess = run.status === 'success';
							return (
								<motion.div
									initial={{ opacity: 0, x: -10 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.4, delay: 0.35 + i * 0.05 }}
									key={run.id}
									className="group flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/3 bg-white/1 hover:bg-white/3 transition-colors p-4 gap-4 relative overflow-hidden"
								>
									{isSuccess ? null : (
										<div className="absolute inset-y-0 left-0 w-1 bg-red-500/50" />
									)}
									<div className="flex items-center gap-4">
										<div
											className={`size-10 rounded-full flex items-center justify-center border ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
										>
											<HugeiconsIcon icon={isSuccess ? GridIcon : Alert02Icon as any} className="size-5" />
										</div>
										<div>
											<div className="flex items-center gap-2 mb-1">
												<span className="text-[14px] font-semibold text-white/80">
													{run.trigger}
												</span>
												<span
													className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-bold ${isSuccess ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}
												>
													{rc.label}
												</span>
											</div>
											<div className="text-[12px] text-white/30 flex items-center gap-3">
												<span>
													ID: <span className="font-mono text-white/40">{run.id}</span>
												</span>
												<span className="size-1 rounded-full bg-white/10" />
												<span>{run.date}</span>
											</div>
										</div>
									</div>
									<div className="flex items-center gap-3 sm:pr-2">
										<div className="flex flex-col items-end">
											<span className="text-[14px] font-mono text-white/70">{run.duration}</span>
											<span className="text-[11px] text-white/30">Duration</span>
										</div>
										<div className="size-8 rounded-full ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 flex items-center justify-center bg-white/5">
											<svg className="size-4 -rotate-90" viewBox="0 0 16 16" fill="none">
												<title>View run</title>
												<path
													d="M10 12L6 8l4-4"
													stroke="currentColor"
													strokeWidth="1.5"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
										</div>
									</div>
								</motion.div>
							);
						})}
					</div>
				</motion.div>
			</div>
		</div>
	);
}
