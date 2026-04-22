import { statusConfig as statusMap } from '@/features/workflows/config';
import { useWorkflowDetail } from '@/features/workflows/components/detail/workflow-context';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

export function RunsTab() {
	const { workflow, runs } = useWorkflowDetail();
	const workflowId = workflow.id;
	const navigate = useNavigate();

	const workflowRuns = workflowId ? runs.filter(r => r.workflowId === workflowId) : runs;

	if (workflowRuns.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-white/10 rounded-[32px] bg-white/2 text-center p-12">
				<div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
					<svg className="size-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<title>No runs</title>
						<path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<h3 className="text-[20px] font-semibold text-white/90 mb-2">No runs yet</h3>
				<p className="text-[14px] text-white/40 max-w-sm">
					This workflow has not been executed yet. Trigger its first job to see logs and metrics here.
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4 max-w-5xl mx-auto">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h2 className="text-xl font-bold text-white tracking-tight">Run History</h2>
					<p className="text-sm text-white/40 mt-1">Chronological list of all executions for this workflow.</p>
				</div>
			</div>

			<div className="grid gap-3">
				{workflowRuns.map((run) => {
					const rc = statusMap[run.status] || statusMap.IDLE;
					return (
						<motion.button
							key={run.id}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							onClick={() => navigate(`/dashboard/workflows/${workflowId}/runs/${run.id}`)}
							className="group flex items-center justify-between p-5 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/4 hover:border-white/10 transition-all text-left w-full"
						>
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-3">
									<div
										className={`size-2.5 rounded-full ${run.status === 'RUNNING' ? 'animate-pulse' : ''}`}
										style={{ background: rc.color, boxShadow: `0 0 10px ${rc.color}40` }}
									/>
									<span className="text-[15px] font-semibold text-white group-hover:text-primary transition-colors">
										{run.trigger === 'MANUAL' ? 'Manual Trigger' : run.trigger}
									</span>
								</div>
								<div className="flex items-center gap-4 text-[13px] text-white/30 font-mono">
									<span>#<span className="text-white/60">{run.id.slice(-8).toUpperCase()}</span></span>
									<span className="size-1 rounded-full bg-white/5" />
									<span>{run.date}</span>
								</div>
							</div>

							<div className="flex items-center gap-6">
								<div className="flex flex-col items-end">
									<span className="text-[13px] font-bold text-white/80">{run.duration}</span>
									<span className="text-[11px] text-white/20 uppercase tracking-widest font-bold">{run.steps} steps</span>
								</div>
								<div className="text-white/10 group-hover:text-white/40 transition-colors">
									<svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
										<title>View details</title>
										<path d="M9 18l6-6-6-6" />
									</svg>
								</div>
							</div>
						</motion.button>
					);
				})}
			</div>
		</div>
	);
}
