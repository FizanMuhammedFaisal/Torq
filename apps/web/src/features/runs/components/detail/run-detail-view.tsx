import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	CheckmarkCircle02Icon,
	Cancel01Icon,
	Loading03Icon,
	RefreshIcon,
	MoreHorizontalCircle01Icon,
	Alert02Icon,
	Calendar03Icon,
	UserIcon,
	Clock04FreeIcons,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { statusConfig as statusMap } from '@/features/workflows/config';
import { useRuns } from '@/features/runs/hooks/use-runs';
import { StepLogs } from '../step-logs';

export function RunDetailView() {
	const { runId, id: workflowId } = useParams<{ runId: string; id: string }>();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const { runs } = useRuns();
	const run = runs.find(r => r.id === runId);

	const selectedStep = searchParams.get('job');

	if (!run) {
		return (
			<div className="flex flex-col items-center justify-center h-[400px] text-center">
				<HugeiconsIcon icon={Alert02Icon} className="size-10 text-white/10 mb-4" />
				<h3 className="text-lg font-semibold text-white/90">Run not found</h3>
				<Button
					variant="outline"
					className="mt-6 rounded-lg h-9"
					onClick={() => navigate(-1)}
				>
					Go Back
				</Button>
			</div>
		);
	}

	const status = run.status;
	const rc = statusMap[status] || statusMap.IDLE;
	const isSuccess = status === 'SUCCESS';
	const isFailed = status === 'FAILED';
	const isRunning = status === 'RUNNING';

	return (
		<div className="flex flex-col gap-6 animate-in fade-in duration-300 pb-10">
			{/* Clean Header */}
			<div className="flex flex-col gap-4">
				<nav className="flex items-center gap-2 text-[12px] font-medium text-white/30 uppercase tracking-wider">
					<Link to={`/dashboard/workflows/${workflowId}`} className="hover:text-white transition-colors">{run.workflowName}</Link>
					<span>/</span>
					<span className="text-white/60 font-mono">#{runId?.slice(-8).toUpperCase()}</span>
				</nav>

				<div className="flex items-center justify-between border-b border-white/5 pb-6">
					<div className="flex items-center gap-4">
						<div className={`size-12 rounded-xl flex items-center justify-center border shrink-0 ${isSuccess ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
							isFailed ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
								isRunning ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
									'bg-white/5 border-white/10 text-white/20'
							}`}>
							{isSuccess && <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-7" />}
							{isFailed && <HugeiconsIcon icon={Cancel01Icon} className="size-7" />}
							{isRunning && <HugeiconsIcon icon={Loading03Icon} className="size-7 animate-spin" />}
							{!isSuccess && !isFailed && !isRunning && <HugeiconsIcon icon={MoreHorizontalCircle01Icon} className="size-7 opacity-50" />}
						</div>

						<div className="space-y-0.5">
							<div className="flex items-center gap-3">
								<h1 className="text-2xl font-bold tracking-tight text-white">
									{run.workflowName}
								</h1>
								<div
									className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
									style={{
										color: rc.color,
										backgroundColor: `${rc.color}10`,
										borderColor: `${rc.color}30`,
									}}
								>
									{rc.label}
								</div>
							</div>
							<div className="flex items-center gap-3 text-[12px] font-medium text-white/30">
								<div className="flex items-center gap-1.5">
									<HugeiconsIcon icon={Calendar03Icon} className="size-3.5" />
									<span>{run.date}</span>
								</div>
								<div className="size-1 rounded-full bg-white/10" />
								<div className="flex items-center gap-1.5">
									<HugeiconsIcon icon={Clock04FreeIcons} className="size-3.5" />
									<span className="font-mono uppercase">{run.duration}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							className="rounded-lg h-9 gap-2 border-white/5 bg-white/5 hover:bg-white/10 text-[13px] font-semibold"
						>
							<HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
							Re-run
						</Button>
					</div>
				</div>
			</div>

			<AnimatePresence mode="wait">
				<motion.div
					key={selectedStep || 'summary'}
					initial={{ opacity: 0, y: 5 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -5 }}
					transition={{ duration: 0.2 }}
				>
					{selectedStep ? (
						<div className="min-h-[600px] h-full">
							<StepLogs runId={runId!} jobId={selectedStep} />
						</div>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
							<div className="lg:col-span-2 space-y-6">
								<div className="rounded-2xl border border-white/5 bg-zinc-900/10 p-6 shadow-sm">
									<h3 className="text-[15px] font-bold text-white mb-6">Execution Summary</h3>
									<div className="grid grid-cols-2 gap-8">
										<div className="space-y-1">
											<div className="text-[11px] font-bold uppercase tracking-widest text-white/20">Triggered By</div>
											<div className="text-[14px] text-white/80 flex items-center gap-2">
												<div className="size-5 rounded-full bg-white/5 flex items-center justify-center">
													<HugeiconsIcon icon={UserIcon} className="size-3 text-white/40" />
												</div>
											</div>
										</div>
										<div className="space-y-1">
											<div className="text-[11px] font-bold uppercase tracking-widest text-white/20">Namespace</div>
											<div className="text-[14px] text-white/80 font-mono">{run.namespace}</div>
										</div>
									</div>
								</div>

								<div className="rounded-2xl border border-white/5 bg-zinc-900/10 p-6 shadow-sm">
									<div className="flex items-center justify-between mb-6">
										<h3 className="text-[15px] font-bold text-white">Workflow Specification</h3>
										<div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
											YAML v{run.workflowVersion || '1'}
										</div>
									</div>
									<div className="p-5 rounded-xl bg-black/60 border border-white/5 font-mono text-[12px] text-white/40 leading-relaxed max-h-[300px] overflow-y-auto custom-scrollbar">
										<pre>{`version: v1\nname: ${run.workflowName}\ntrigger: ${run.trigger}\nsteps:\n  - name: pinging-google\n    image: alpine\n    script: ping -c 4 google.com`}</pre>
									</div>
								</div>
							</div>

							<div className="space-y-6">
								<div className="rounded-2xl border border-white/5 bg-zinc-900/10 p-6 shadow-sm">
									<h3 className="text-[15px] font-bold text-white mb-6">Execution Path</h3>
									<div className="space-y-4">
										{Object.entries(run.stepsMap || {}).map(([name, data]) => (
											<div key={name} className="flex items-start gap-4 group">
												<div className="relative flex flex-col items-center mt-1">
													<div className={`size-3 rounded-full border-2 ${data.status === 'SUCCESS' ? 'border-emerald-500 bg-emerald-500/20' : data.status === 'FAILED' ? 'border-rose-500 bg-rose-500/20' : 'border-white/10 bg-white/5'}`} />
													<div className="w-px h-8 bg-white/5 last:hidden" />
												</div>
												<div className="flex-1 pb-4">
													<div className="text-[13px] font-bold text-white/80 group-hover:text-white transition-colors">{name}</div>
													<div className="text-[10px] uppercase tracking-wider font-bold text-white/20">{data.status}</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
