import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, Alert02Icon } from '@hugeicons/core-free-icons';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { statusConfig as statusMap } from '@/features/workflows/config';
import { OverviewTab } from '@/features/workflows/components/detail/overview-tab';
import { EditorTab } from '@/features/workflows/components/detail/editor-tab';
import { RunsTab } from '@/features/runs/components/runs-tab';
import { MetricsTab } from '@/features/workflows/components/detail/metrics-tab';
import { SecretsTab } from '@/features/workflows/components/detail/secrets-tab';
import { useTriggerRun } from '@/features/workflows/hooks/use-trigger-run';
import { useWorkflow } from '@/features/workflows/hooks/use-workflow';
import { useRuns } from '@/features/runs/hooks/use-runs';


const tabs = ['Overview', 'Editor', 'Runs', 'Metrics', 'Secrets'] as const;
type Tab = (typeof tabs)[number];

export function WorkflowDetailView() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<Tab>('Overview');
	const [showDelete, setShowDelete] = useState(false);

	const triggerRun = useTriggerRun();
	const { data: workflow, isLoading, error } = useWorkflow(id);
	const { runs } = useRuns();

	const cfg = workflow ? (statusMap[workflow.status as keyof typeof statusMap] || statusMap.IDLE) : statusMap.IDLE;

	if (!id) {
		return (
			<div className="flex flex-col h-full bg-zinc-950 items-center justify-center p-8">
				<div className="border border-red-500/20 bg-red-500/2 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm max-w-md w-full">
					<div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
						<HugeiconsIcon icon={Alert02Icon} className="size-8 text-red-400" />
					</div>
					<h3 className="text-[18px] font-semibold text-white/90 mb-2">Invalid Workflow</h3>
					<p className="text-[14px] text-white/50 mb-8">No workflow ID provided in URL.</p>
					<Button
						onClick={() => navigate('/dashboard/workflows')}
						variant="outline"
						className="gap-2 h-10 rounded-full px-6 border-white/8 hover:bg-white/4"
					>
						Back to Workflows
					</Button>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col h-full bg-zinc-950 items-center justify-center p-8">
				<div className="border border-red-500/20 bg-red-500/2 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm max-w-md w-full">
					<div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
						<HugeiconsIcon icon={Alert02Icon} className="size-8 text-red-400" />
					</div>
					<h3 className="text-[18px] font-semibold text-white/90 mb-2">Workflow Not Found</h3>
					<p className="text-[14px] text-white/50 mb-8">{error.message}</p>
					<Button
						onClick={() => navigate('/dashboard/workflows')}
						variant="outline"
						className="gap-2 h-10 rounded-full px-6 border-white/8 hover:bg-white/4"
					>
						Back to Workflows
					</Button>
				</div>
			</div>
		);
	}

	if (isLoading || !workflow) {
		return (
			<div className="flex flex-col h-full bg-zinc-950 items-center justify-center p-8">
				<HugeiconsIcon icon={Loading03Icon} className="size-8 text-white/20 animate-spin" />
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full bg-zinc-950">
			{/* Top Header */}
			<div className="border-b border-white/4 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-30">
				<div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
					<div className="flex items-center gap-6">
						<button
							type="button"
							onClick={() => navigate('/dashboard/workflows')}
							className="group flex items-center justify-center size-9 rounded-full bg-white/3 border border-white/8 hover:bg-white/10 transition-all active:scale-95"
						>
							<svg
								className="size-4 text-white/40 group-hover:text-white transition-colors"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<title>Back</title>
								<path d="M19 12H5M12 19l-7-7 7-7" />
							</svg>
						</button>
						<div>
							<div className="flex items-center gap-3">
								<h1 className="text-2xl font-bold tracking-tight text-white">{workflow.name}</h1>
								<div className="flex items-center gap-1.5 rounded-full border border-white/6 px-2.5 py-1">
									<span
										className={`size-[6px] rounded-full ${workflow.status === 'RUNNING' ? 'animate-pulse' : ''}`}
										style={{ background: cfg.color }}
									/>
									<span className="text-[11px] font-medium" style={{ color: cfg.color }}>
										{cfg.label}
									</span>
								</div>
							</div>
							<p className="text-[14px] text-white/30 mt-1.5">{workflow.description}</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							size="sm"
							className="rounded-full gap-1.5 px-5 bg-white/2 border-white/8 hover:bg-white/4"
						>
							<svg
								className="size-3.5 text-white/40"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<title>Edit workflow</title>
								<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
								<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
							</svg>
							Edit
						</Button>
						<Button
							size="sm"
							className="rounded-full gap-2 px-5 shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
							onClick={() => {
								const triggerPromise = triggerRun.mutateAsync({ id });
								toast.promise(triggerPromise, {
									loading: 'Triggering workflow execution...',
									success: 'Workflow execution started!',
									error: (err) => err.response?.data?.message || 'Failed to trigger workflow',
								});
								triggerPromise.then(() => setActiveTab('Runs')).catch(() => { });
							}}
							disabled={triggerRun.isPending}
						>
							{triggerRun.isPending ? (
								<HugeiconsIcon icon={Loading03Icon} className="size-3.5 animate-spin" />
							) : (
								<svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
									<title>Trigger run</title>
									<polygon points="6 3 20 12 6 21 6 3" />
								</svg>
							)}
							{triggerRun.isPending ? 'Starting...' : 'Trigger'}
						</Button>
					</div>
				</div>

				{/* Tabs — sliding pill */}
				<div className="max-w-[1400px] mx-auto px-8 pb-4">
					<div className="flex items-center gap-1 p-1 rounded-full bg-white/3 border border-white/5 w-fit">
						{tabs.map((tab) => (
							<button
								key={tab}
								type="button"
								onClick={() => setActiveTab(tab)}
								className={`
                  px-5 py-1.5 rounded-full text-[13px] font-medium transition-all relative
                  ${activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/60'}
                `}
							>
								{activeTab === tab && (
									<div className="absolute inset-0 bg-white/10 rounded-full shadow-[0_2px_10px_rgba(255,255,255,0.05)]" />
								)}
								<span className="relative z-10">{tab}</span>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 overflow-auto bg-black/95">
				<div className="max-w-[1400px] mx-auto p-8">
					{activeTab === 'Overview' && <OverviewTab workflow={workflow} runs={runs} />}
					{activeTab === 'Editor' && <EditorTab workflow={workflow} />}
					{activeTab === 'Runs' && <RunsTab workflowId={id} />}
					{activeTab === 'Metrics' && <MetricsTab workflowId={id} />}
					{activeTab === 'Secrets' && <SecretsTab workflowId={id} />}
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
	);
}
