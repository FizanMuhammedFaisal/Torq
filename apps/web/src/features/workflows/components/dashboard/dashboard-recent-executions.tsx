import {
	Alert02Icon,
	ArrowRight01Icon,
	CheckListIcon,
	File02Icon,
	RefreshIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { Button } from '@/components/ui/button';
import { WorkflowStatusBadge } from '@/features/workflows/components/workflow-status-badge';
import { formatDuration, formatRelativeTime } from '@/lib/format';
import type { WorkflowWithLatestRun } from '../../types';
import { statusConfig } from '../../config';

interface DashboardRecentExecutionsProps {
	workflows: WorkflowWithLatestRun[];
	isLoading: boolean;
	error: Error | null;
	onRetry: () => void;
	onViewAll: () => void;
	onViewWorkflow: (id: string) => void;
	onCreateWorkflow: () => void;
}

export function DashboardRecentExecutions({
	workflows,
	isLoading,
	error,
	onRetry,
	onViewAll,
	onViewWorkflow,
	onCreateWorkflow,
}: DashboardRecentExecutionsProps) {
	return (
		<div className="pt-6">
			{/* Header */}
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-2">
					<div className="size-6 rounded-md bg-white/3 border border-white/5 flex items-center justify-center">
						<HugeiconsIcon icon={CheckListIcon} className="size-3.5 text-white/60" />
					</div>
					<h2 className="text-[16px] font-semibold text-white/90 tracking-tight">
						Recent Workflows
					</h2>
				</div>
				<Button
					variant="outline"
					className="gap-2 h-9 rounded-full px-4 border-white/8 bg-white/2 hover:bg-white/6 text-[13px] font-medium transition-all"
					onClick={onViewAll}
				>
					View All
					<HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 opacity-70" />
				</Button>
			</div>

			{/* Error State */}
			{error ? (
				<div className="border border-red-500/20 bg-red-500/2 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm">
					<div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
						<HugeiconsIcon icon={Alert02Icon} className="size-6 text-red-400" />
					</div>
					<h3 className="text-[16px] font-semibold text-white/90 mb-1">
						Failed to load workflows
					</h3>
					<p className="text-[14px] text-white/50 max-w-sm mb-6">{error.message}</p>
					<Button
						onClick={onRetry}
						variant="outline"
						className="gap-2 h-9 rounded-full px-5 border-white/8 hover:bg-white/4"
					>
						<HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
						Try Again
					</Button>
				</div>

				/* Loading Skeleton */
			) : isLoading ? (
				<div className="border border-white/6 rounded-2xl overflow-hidden bg-neutral-900/80">
					<div className="flex flex-col divide-y divide-white/4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="flex items-center gap-6 px-8 py-5">
								<div className="w-[100px] h-5 bg-white/3 rounded-full animate-pulse" />
								<div className="flex-1 flex flex-col gap-2">
									<div className="w-48 h-4 bg-white/4 rounded animate-pulse" />
									<div className="w-64 h-3 bg-white/2 rounded animate-pulse" />
								</div>
								<div className="flex flex-col items-end gap-1.5">
									<div className="w-16 h-3 bg-white/3 rounded animate-pulse" />
									<div className="w-10 h-3 bg-white/2 rounded animate-pulse" />
								</div>
							</div>
						))}
					</div>
				</div>

				/* Empty State */
			) : workflows.length === 0 ? (
				<div className="border border-dashed border-white/10 bg-white/1 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
					<div className="size-12 rounded-full bg-white/3 flex items-center justify-center mb-4 border border-white/5">
						<HugeiconsIcon icon={File02Icon} className="size-5 text-white/40" />
					</div>
					<h3 className="text-[16px] font-semibold text-white/90 mb-1.5">
						No workflows yet
					</h3>
					<p className="text-[14px] text-white/40 max-w-sm mb-6">
						Create your first workflow to start automating tasks.
					</p>
					<Button
						onClick={onCreateWorkflow}
						className="gap-2 h-9 rounded-full px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-[0_0_12px_rgba(16,185,129,0.4)]"
					>
						Create Workflow
					</Button>
				</div>

				/* Workflow List */
			) : (
				<div className="border border-white/6 rounded-2xl overflow-hidden bg-neutral-900/80 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]">
					<div className="flex flex-col divide-y divide-white/4">
						{workflows.map((wf) => (
								<button
									key={wf.id}
									type="button"
									onClick={() => onViewWorkflow(wf.id)}
									className="group w-full text-left flex flex-col sm:flex-row sm:items-center gap-4 px-8 py-5 hover:bg-white/3 transition-colors cursor-pointer relative overflow-hidden"
								>
									<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02),transparent)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

									<div className="shrink-0 w-[110px] flex items-center relative z-10">
										<WorkflowStatusBadge 
                                            status={wf.lastRun?.status} 
                                            className={!wf.lastRun ? "text-white/30 border-white/8 bg-white/2" : ""}
                                        />
									</div>

									{/* Name & Description */}
									<div className="flex-1 min-w-0 relative z-10 flex flex-col gap-0.5">
										<span className="text-[15px] font-semibold text-white/90 truncate group-hover:text-white transition-colors">
											{wf.name}
										</span>
										{wf.description && (
											<span className="text-[13px] text-white/35 truncate">
												{wf.description}
											</span>
										)}
									</div>

									{/* Last run timing */}
									<div className="shrink-0 flex flex-col items-end gap-1 relative z-10 min-w-[100px]">
										{wf.lastRun ? (
											<>
												<span className="text-[13px] font-medium text-white/60">
													{formatRelativeTime(wf.lastRun.startedAt)}
												</span>
												<span className="text-[11px] font-mono text-white/30 bg-white/4 px-1.5 py-0.5 rounded-md">
													{formatDuration(wf.lastRun.duration)}
												</span>
											</>
										) : (
											<span className="text-[12px] text-white/20 italic">—</span>
										)}
									</div>
								</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
