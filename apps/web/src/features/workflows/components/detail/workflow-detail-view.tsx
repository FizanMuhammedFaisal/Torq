import { useNavigate, useParams, Outlet, useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, PlayCircleIcon } from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { statusConfig as statusMap } from '@/features/workflows/config';
import { useTriggerRun } from '@/features/workflows/hooks/use-trigger-run';
import { useWorkflow } from '@/features/workflows/hooks/use-workflow';
import { useRuns } from '@/features/runs/hooks/use-runs';
import { useState } from 'react';
import { WorkflowProvider } from './workflow-context';

export function WorkflowDetailView() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [showDelete, setShowDelete] = useState(false);

	const triggerRun = useTriggerRun();
	const { data: workflow, isLoading, error, isFetching } = useWorkflow(id, {
		expand: ['latestRun']
	}, {
		refetchInterval: (data) => (data?.status === 'RUNNING' ? 2000 : 15000)
	});
	const { runs } = useRuns({
		workflowId: id,
		refetchInterval: workflow?.status === 'RUNNING' ? 2000 : 15000
	});

	const hanldeWorkflowTrigger = (id: string) => {
		const triggerPromise = triggerRun.mutateAsync({ id });
		toast.promise(triggerPromise, {
			loading: 'Triggering workflow execution...',
			success: 'Workflow execution started!',
			error: (err) => err.response?.data?.message || 'Failed to trigger workflow',
		});
	};

	const cfg = workflow ? (statusMap[workflow.status as keyof typeof statusMap] || statusMap.IDLE) : statusMap.IDLE;

	if (!id) return null;

	if (isLoading || !workflow) {
		return (
			<div className="flex flex-col h-full bg-zinc-950 items-center justify-center p-8">
				<HugeiconsIcon icon={Loading03Icon} className="size-8 text-white/10 animate-spin" />
			</div>
		);
	}

	return (
		<WorkflowProvider value={{ workflow, runs, isLoading }}>
			<div className="flex flex-col h-full bg-zinc-950">
				{/* Compact Header */}
				<div className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
					{/* Loading Progress Bar */}
					<AnimatePresence>
						{isFetching && (
							<motion.div
								initial={{ opacity: 0, scaleX: 0 }}
								animate={{ opacity: 1, scaleX: 1 }}
								exit={{ opacity: 0 }}
								className="absolute bottom-[-1px] left-0 right-0 h-px bg-primary origin-left z-50 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
								transition={{ duration: 0.5, ease: 'circOut' }}
							/>
						)}
					</AnimatePresence>

					<div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
						<div className="flex items-center gap-6">
							<div>
								<div className="flex items-center gap-3">
									<button
										type="button"
										className="text-xl font-bold tracking-tight text-white cursor-pointer hover:text-primary transition-all active:scale-[0.98]"
										onClick={() => navigate(`/dashboard/workflows/${id}`)}
									>
										{workflow.name}
									</button>
									<div className="flex items-center gap-1.5 rounded-full border border-white/6 px-2.5 py-1">
										<span
											className={`size-[6px] rounded-full ${workflow.status === 'RUNNING' ? 'animate-pulse' : ''}`}
											style={{ background: cfg.color }}
										/>
										<span className="text-[11px] font-medium uppercase tracking-widest" style={{ color: cfg.color }}>
											{cfg.label}
										</span>
									</div>
								</div>
								<p className="text-[13px] text-white/30 mt-1 font-medium">{workflow.description || 'No description provided'}</p>
							</div>
						</div>

						<div className="flex items-center gap-3">
							<Button
								size="sm"
								className="rounded-lg h-9 gap-2 px-5 font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.97] border-0"
								onClick={() => hanldeWorkflowTrigger(id)}
								disabled={triggerRun.isPending}
							>
								{triggerRun.isPending ? (
									<HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
								) : (
									<HugeiconsIcon icon={PlayCircleIcon} className="size-3.5" />
								)}
								{triggerRun.isPending ? 'STAGING...' : 'TRIGGER'}
							</Button>
						</div>
					</div>
				</div>

				<div className="flex-1 overflow-auto bg-black/95">
					<div className="max-w-[1400px] mx-auto p-8 h-full">
						<AnimatePresence mode="wait">
							<motion.div
								key={pathname}
								initial={{ opacity: 0, y: 5 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -5 }}
								transition={{ duration: 0.2, ease: 'easeOut' }}
								className="h-full"
							>
								<Outlet />
							</motion.div>
						</AnimatePresence>
					</div>
				</div>

				<ConfirmDialog
					open={showDelete}
					onOpenChange={setShowDelete}
					title="Delete workflow"
					description={`This will permanently delete "${workflow?.name}" and all its run history. This action cannot be undone.`}
					confirmText={workflow?.name || ''}
					confirmLabel="Delete Workflow"
					variant="destructive"
					onConfirm={() => {
						setShowDelete(false);
						navigate('/dashboard');
					}}
				/>
			</div>
		</WorkflowProvider>
	);
}
