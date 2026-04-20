import { Alert02Icon, GearsIcon, GridIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface DashboardMetricsProps {
	isLoading: boolean;
	metrics: {
		total: number;
		running: number;
		failed: number;
	};
}

export function DashboardMetrics({ isLoading, metrics }: DashboardMetricsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{/* Total Workflows Metric */}
			<div className="rounded-xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/5 to-emerald-500/1 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(16,185,129,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[140px] group backdrop-blur-xl">
				<div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all duration-700 group-hover:bg-emerald-500/15 group-hover:blur-2xl"></div>

				<AnimatePresence>
					{!isLoading && (
						<motion.div
							className="absolute -right-2 -bottom-2 pointer-events-none text-emerald-500"
							initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.8 }}
							animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
							exit={{ opacity: 0, filter: 'blur(16px)', scale: 0.8 }}
							transition={{
								duration: 0.8,
								delay: 0.2,
								ease: [0.25, 1, 0.5, 1],
							}}
						>
							<motion.div
								className="opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-500"
								animate={{
									y: [0, -10, 0],
									scale: [1, 1.05, 1],
									rotate: [0, 2, 0],
								}}
								transition={{
									duration: 6,
									repeat: Infinity,
									ease: 'easeInOut',
								}}
							>
								<HugeiconsIcon
									icon={GridIcon}
									className="w-32 h-32 drop-shadow-md"
									strokeWidth={1}
								/>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<div>
					<h3 className="text-[13px] font-medium text-emerald-400/80 uppercase tracking-widest mb-1 relative z-10">
						Total Workflows
					</h3>
				</div>
				<div className="text-[48px] font-mono font-bold tracking-tight relative z-10 mt-1 flex items-center text-white/95 drop-shadow-sm h-[48px]">
					{isLoading ? (
						<span className="text-white/20 animate-pulse leading-none">--</span>
					) : (
						<AnimatedCounter className="h-full" value={metrics.total} />
					)}
				</div>
			</div>

			{/* Running Metric */}
			<div className="rounded-xl border border-blue-500/30 bg-linear-to-br from-blue-500/6 to-blue-500/2 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(59,130,246,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[140px] group backdrop-blur-xl">
				<div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all duration-700 group-hover:bg-blue-500/20 group-hover:blur-2xl"></div>

				<AnimatePresence>
					{!isLoading && (
						<motion.div
							className="absolute -right-4 -bottom-4 pointer-events-none text-blue-500"
							initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.8 }}
							animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
							exit={{ opacity: 0, filter: 'blur(16px)', scale: 0.8 }}
							transition={{
								duration: 0.8,
								delay: 0.35,
								ease: [0.25, 1, 0.5, 1],
							}}
						>
							<motion.div
								className="opacity-[0.06] group-hover:opacity-[0.14] transition-opacity duration-500"
								animate={{ rotate: 360, scale: [1, 1.03, 1] }}
								transition={{
									rotate: {
										duration: 20,
										repeat: Infinity,
										ease: 'linear',
									},
									scale: {
										duration: 4,
										repeat: Infinity,
										ease: 'easeInOut',
									},
								}}
							>
								<HugeiconsIcon
									icon={GearsIcon}
									className="w-36 h-36 drop-shadow-lg"
									strokeWidth={1}
								/>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<div>
					<h3 className="text-[13px] font-medium text-blue-400/90 uppercase tracking-widest mb-1 relative z-10">
						Running
					</h3>
				</div>
				<div className="text-[48px] font-mono font-bold tracking-tight relative z-10 mt-1 flex items-center text-white/95 drop-shadow-sm h-[48px]">
					{isLoading ? (
						<span className="text-white/20 animate-pulse leading-none">--</span>
					) : (
						<AnimatedCounter className="h-full" value={metrics.running} />
					)}
				</div>
			</div>

			{/* Failed Metric */}
			<div className="rounded-xl border border-red-500/30 bg-linear-to-br from-red-500/6 to-red-500/2 p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_24px_-8px_rgba(239,68,68,0.15)] relative overflow-hidden flex flex-col justify-between min-h-[140px] group backdrop-blur-xl">
				<div className="absolute top-0 right-0 w-40 h-40 bg-red-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all duration-700 group-hover:bg-red-500/20 group-hover:blur-2xl"></div>

				<AnimatePresence>
					{!isLoading && (
						<motion.div
							className="absolute -right-3 -bottom-3 pointer-events-none text-red-500"
							initial={{ opacity: 0, filter: 'blur(16px)', scale: 0.8 }}
							animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
							exit={{ opacity: 0, filter: 'blur(16px)', scale: 0.8 }}
							transition={{
								duration: 0.8,
								delay: 0.5,
								ease: [0.25, 1, 0.5, 1],
							}}
						>
							<motion.div
								className="opacity-[0.05] group-hover:opacity-[0.15] transition-all duration-500"
								animate={{
									scale: [1, 1.08, 1],
									filter: ['blur(0px)', 'blur(1px)', 'blur(0px)'],
								}}
								transition={{
									duration: 2.5,
									repeat: Infinity,
									ease: 'backInOut',
								}}
							>
								<HugeiconsIcon
									icon={Alert02Icon}
									className="w-32 h-32 group-hover:drop-shadow-[0_0_20px_rgba(239,68,68,0.6)]"
									strokeWidth={1.2}
								/>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>

				<div>
					<h3 className="text-[13px] font-medium text-red-400/90 uppercase tracking-widest mb-1 relative z-10">
						Recent Failures
					</h3>
				</div>
				<div className="text-[48px] font-mono font-bold tracking-tight relative z-10 mt-1 flex items-center text-white/95 drop-shadow-sm h-[48px]">
					{isLoading ? (
						<span className="text-white/20 animate-pulse leading-none">--</span>
					) : (
						<AnimatedCounter className="h-full" value={metrics.failed} />
					)}
				</div>
			</div>
		</div>
	);
}
