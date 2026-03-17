import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, Alert02Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

import { MOCK_WORKFLOW, statusMap } from './mock-data';

// Tabs
import { OverviewTab } from './components/overview-tab';
import { EditorTab } from './components/editor-tab';
import { RunsTab } from './components/runs-tab';
import { MetricsTab } from './components/metrics-tab';
import { SecretsTab } from './components/secrets-tab';

const tabs = ['Overview', 'Editor', 'Runs', 'Metrics', 'Secrets'] as const;
type Tab = (typeof tabs)[number];

export function WorkflowDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState<Tab>('Overview');
	const [showDelete, setShowDelete] = useState(false);

	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const load = async () => {
			if (!id) return;
			setIsLoading(true);
			setError(null);
			await new Promise((res) => setTimeout(res, 600));
			// Optional error simulation: if (id === 'error') throw new Error('Could not find Workflow');
			setIsLoading(false);
		};
		load();
	}, [id]);

	const wf = MOCK_WORKFLOW;
	const cfg = statusMap[wf.status];

	if (error) {
		return (
			<div className="flex flex-col h-full bg-[#0a0a0a] items-center justify-center p-8">
				<div className="border border-red-500/20 bg-red-500/[0.02] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm max-w-md w-full">
					<div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
						<HugeiconsIcon icon={Alert02Icon as any} className="size-8 text-red-400" />
					</div>
					<h3 className="text-[18px] font-semibold text-white/90 mb-2">Workflow Not Found</h3>
					<p className="text-[14px] text-white/50 mb-8">{error.message}</p>
					<Button
						onClick={() => navigate('/dashboard/workflows')}
						variant="outline"
						className="gap-2 h-10 rounded-full px-6 border-white/[0.08] hover:bg-white/[0.04]"
					>
						Back to Workflows
					</Button>
				</div>
			</div>
		);
	}

	if (isLoading) {
		return (
			<div className="flex flex-col h-full bg-[#0a0a0a]">
				<div className="px-6 lg:px-8 pt-6 pb-5 border-b border-white/[0.05]">
					<div className="flex items-center gap-4 mb-5">
						<div className="size-9 rounded-full bg-white/[0.03] animate-pulse" />
						<div className="flex flex-col gap-2">
							<div className="w-48 h-6 bg-white/[0.05] rounded animate-pulse" />
							<div className="w-64 h-3 bg-white/[0.03] rounded animate-pulse" />
						</div>
					</div>
				</div>
				<div className="flex-1 flex items-center justify-center">
					<HugeiconsIcon icon={Loading03Icon as any} className="size-8 text-white/20 animate-spin" />
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="px-6 lg:px-8 pt-6 pb-5 border-b border-white/[0.05]">
				{/* Back + title + actions */}
				<div className="flex items-center justify-between mb-5">
					<div className="flex items-center gap-4">
						{/* Back button — round */}
						<button
							type="button"
							onClick={() => navigate('/dashboard')}
							className="flex items-center justify-center size-9 rounded-full border border-white/[0.08] text-white/30 hover:text-white/60 hover:bg-white/[0.04] transition-all"
						>
							<svg className="size-4" viewBox="0 0 16 16" fill="none">
								<title>Back</title>
								<path
									d="M10 12L6 8l4-4"
									stroke="currentColor"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						</button>
						<div>
							<div className="flex items-center gap-3">
								<h1 className="text-2xl font-bold tracking-tight text-white">{wf.name}</h1>
								<div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] px-2.5 py-1">
									<span
										className={`size-[6px] rounded-full ${wf.status === 'running' ? 'animate-pulse' : ''}`}
										style={{ background: cfg.color }}
									/>
									<span className="text-[11px] font-medium" style={{ color: cfg.color }}>
										{cfg.label}
									</span>
								</div>
							</div>
							<p className="text-[14px] text-white/30 mt-1.5">{wf.description}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button
							size="sm"
							variant="ghost"
							className="rounded-full text-white/30 hover:text-red-400"
							onClick={() => setShowDelete(true)}
						>
							Delete
						</Button>
						<Button size="sm" className="rounded-full gap-1.5 px-5">
							<svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
								<title>Run workflow</title>
								<polygon points="6 3 20 12 6 21 6 3" />
							</svg>
							Run
						</Button>
					</div>
				</div>

				{/* Tabs — sliding pill */}
				<div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.05] w-fit">
					{tabs.map((tab) => (
						<button
							key={tab}
							type="button"
							onClick={() => setActiveTab(tab)}
							className={`relative px-5 py-2 text-[13px] font-medium rounded-full transition-colors z-10 ${activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
								}`}
						>
							{activeTab === tab && (
								<motion.div
									layoutId="active-pill"
									className="absolute inset-0 rounded-full bg-primary/10 border border-primary/20"
									style={{ boxShadow: '0 0 16px 0 rgba(16,185,129,0.15)' }}
									transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
								/>
							)}
							<span className="relative z-10">{tab}</span>
						</button>
					))}
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 overflow-y-auto p-6 lg:p-8">
				<motion.div
					key={activeTab}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.15 }}
				>
					{activeTab === 'Overview' && <OverviewTab />}
					{activeTab === 'Editor' && <EditorTab />}
					{activeTab === 'Runs' && <RunsTab />}
					{activeTab === 'Metrics' && <MetricsTab />}
					{activeTab === 'Secrets' && id && <SecretsTab workflowId={id} />}
				</motion.div>
			</div>

			{/* Delete dialog */}
			<ConfirmDialog
				open={showDelete}
				onOpenChange={setShowDelete}
				title="Delete workflow"
				description={`This will permanently delete "${wf.name}" and all its run history. This action cannot be undone.`}
				confirmText={wf.name}
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
