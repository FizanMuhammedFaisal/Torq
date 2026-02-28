import { Alert02Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { type ValidationError, YamlEditor } from '@/components/yaml-editor';

/* ── Types ─── */

type WorkflowStatus = 'idle' | 'queued' | 'running' | 'success' | 'failed';

interface Run {
	id: string;
	status: WorkflowStatus;
	trigger: string;
	date: string;
	duration: string;
	steps: { name: string; status: WorkflowStatus; duration: string }[];
}

/* ── Mock ─── */

const MOCK_YAML = `name: ci-build-test
description: Install dependencies, lint, type-check, and run tests

triggers:
  - type: push
    branches: [main, develop]
  - type: pull_request
    branches: [main]

steps:
  - name: install-deps
    run: npm ci
    timeout: 120s

  - name: lint
    run: npm run lint
    depends_on: [install-deps]

  - name: type-check
    run: npm run typecheck
    depends_on: [install-deps]

  - name: unit-tests
    run: npm run test
    depends_on: [lint, type-check]
    retry:
      max_attempts: 2
      delay: 5s

  - name: build
    run: npm run build
    depends_on: [unit-tests]
    artifacts:
      - dist/**
`;

const MOCK_RUNS: Run[] = [
	{
		id: 'run-1',
		status: 'success',
		trigger: 'push to main',
		date: '12 min ago',
		duration: '2m 34s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '32s' },
			{ name: 'Lint', status: 'success', duration: '18s' },
			{ name: 'Type check', status: 'success', duration: '24s' },
			{ name: 'Unit tests', status: 'success', duration: '58s' },
			{ name: 'Build', status: 'success', duration: '22s' },
		],
	},
	{
		id: 'run-2',
		status: 'failed',
		trigger: 'push to develop',
		date: '2 hr ago',
		duration: '1m 12s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '30s' },
			{ name: 'Lint', status: 'success', duration: '16s' },
			{ name: 'Type check', status: 'failed', duration: '26s' },
			{ name: 'Unit tests', status: 'idle', duration: '—' },
			{ name: 'Build', status: 'idle', duration: '—' },
		],
	},
	{
		id: 'run-3',
		status: 'success',
		trigger: 'PR #42',
		date: 'Yesterday',
		duration: '2m 50s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '34s' },
			{ name: 'Lint', status: 'success', duration: '20s' },
			{ name: 'Type check', status: 'success', duration: '28s' },
			{ name: 'Unit tests', status: 'success', duration: '1m 06s' },
			{ name: 'Build', status: 'success', duration: '22s' },
		],
	},
	{
		id: 'run-4',
		status: 'success',
		trigger: 'push to main',
		date: '2 days ago',
		duration: '2m 28s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '31s' },
			{ name: 'Lint', status: 'success', duration: '17s' },
			{ name: 'Type check', status: 'success', duration: '22s' },
			{ name: 'Unit tests', status: 'success', duration: '56s' },
			{ name: 'Build', status: 'success', duration: '22s' },
		],
	},
];

const MOCK_WORKFLOW = {
	id: 'wf-1',
	name: 'CI / Build & Test',
	description:
		'Install dependencies, lint, type-check, and run unit tests on every push to main and develop',
	status: 'success' as WorkflowStatus,
	lastRun: '12 min ago',
	duration: '2m 34s',
	totalRuns: 128,
	successRate: 94,
	avgDuration: '2m 41s',
};

/* ── Status ─── */

const statusMap: Record<WorkflowStatus, { label: string; color: string }> = {
	idle: { label: 'Idle', color: 'rgba(161,161,170,0.5)' },
	queued: { label: 'Queued', color: 'rgba(234,179,8,1)' },
	running: { label: 'Running', color: 'rgba(59,130,246,1)' },
	success: { label: 'Passed', color: 'oklch(0.60 0.13 163)' },
	failed: { label: 'Failed', color: 'rgba(239,68,68,1)' },
};

/* ── Tabs ─── */

const tabs = ['Overview', 'Editor', 'Runs', 'Metrics'] as const;
type Tab = (typeof tabs)[number];

/* ── Stat Card ─── */

function StatCard({
	label,
	value,
	accent,
}: {
	label: string;
	value: string;
	accent?: string;
}) {
	return (
		<div
			className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
			style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)' }}
		>
			<p className="text-[11px] font-medium uppercase tracking-wider text-white/25 mb-2">
				{label}
			</p>
			<p
				className="text-xl font-bold tracking-tight"
				style={{ color: accent || 'white' }}
			>
				{value}
			</p>
		</div>
	);
}

/* ── Tab: Overview ─── */

function OverviewTab() {
	const cfg = statusMap[MOCK_WORKFLOW.status];

	return (
		<div className="space-y-8">
			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
				<StatCard label="Status" value={cfg.label} accent={cfg.color} />
				<StatCard label="Last Run" value={MOCK_WORKFLOW.lastRun} />
				<StatCard label="Duration" value={MOCK_WORKFLOW.duration} />
				<StatCard label="Total Runs" value={String(MOCK_WORKFLOW.totalRuns)} />
			</div>

			{/* Description */}
			<div>
				<h3 className="text-xs font-semibold uppercase tracking-wider text-white/25 mb-3">
					About
				</h3>
				<p className="text-[15px] text-white/50 leading-relaxed">
					{MOCK_WORKFLOW.description}
				</p>
			</div>

			{/* Recent runs */}
			<div>
				<h3 className="text-xs font-semibold uppercase tracking-wider text-white/25 mb-4">
					Recent Runs
				</h3>
				<div className="space-y-2">
					{MOCK_RUNS.slice(0, 3).map((run) => {
						const rc = statusMap[run.status];
						return (
							<div
								key={run.id}
								className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.015] px-5 py-3.5"
							>
								<div className="flex items-center gap-3">
									<span
										className={`size-[7px] rounded-full ${run.status === 'running' ? 'animate-pulse' : ''}`}
										style={{ background: rc.color }}
									/>
									<span className="text-[13px] font-medium text-white/70">
										{run.trigger}
									</span>
								</div>
								<div className="flex items-center gap-5 text-[12px] text-white/25">
									<span className="font-mono">{run.duration}</span>
									<span>{run.date}</span>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

/* ── Tab: Editor ─── */

function EditorTab() {
	const [yamlContent, setYamlContent] = useState(MOCK_YAML);
	const [errors, setErrors] = useState<ValidationError[]>([]);
	const [saved, setSaved] = useState(true);

	const handleChange = (val: string) => {
		setYamlContent(val);
		setSaved(false);
	};

	const handleSave = () => {
		if (errors.length > 0) return;
		setSaved(true);
	};

	return (
		<div className="space-y-5">
			{/* Toolbar */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					{errors.length > 0 ? (
						<div className="flex items-center gap-2 text-red-400">
							<span className="size-2 rounded-full bg-red-400" />
							<span className="text-[13px] font-medium">
								{errors.length} error{errors.length > 1 ? 's' : ''}
							</span>
						</div>
					) : (
						<div className="flex items-center gap-2 text-primary">
							<span className="size-2 rounded-full bg-primary" />
							<span className="text-[13px] font-medium">Valid YAML</span>
						</div>
					)}
					{!saved && (
						<span className="text-[12px] text-white/20">• Unsaved changes</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					<Button
						size="sm"
						variant="ghost"
						className="rounded-full"
						onClick={() => {
							setYamlContent(MOCK_YAML);
							setSaved(true);
						}}
						disabled={saved}
					>
						Discard
					</Button>
					<Button
						size="sm"
						className="rounded-full px-5"
						onClick={handleSave}
						disabled={errors.length > 0 || saved}
					>
						Save
					</Button>
				</div>
			</div>

			{/* Error panel */}
			{errors.length > 0 && (
				<div className="rounded-xl bg-red-500/8 border border-red-500/15 px-4 py-3">
					{errors.map((err) => (
						<p
							key={`${err.line}-${err.message}`}
							className="text-[13px] text-red-400"
						>
							Line {err.line + 1}: {err.message}
						</p>
					))}
				</div>
			)}

			{/* Editor */}
			<YamlEditor
				value={yamlContent}
				onChange={handleChange}
				onValidation={setErrors}
				height="500px"
			/>
		</div>
	);
}

/* ── Tab: Runs ─── */

function RunsTab() {
	const [expandedRun, setExpandedRun] = useState<string | null>(null);

	return (
		<div className="space-y-2">
			{MOCK_RUNS.map((run) => {
				const rc = statusMap[run.status];
				const isExpanded = expandedRun === run.id;

				return (
					<div key={run.id}>
						<div
							className={`flex items-center justify-between rounded-xl border px-5 py-4 cursor-pointer transition-all ${
								isExpanded
									? 'border-white/[0.08] bg-white/[0.03]'
									: 'border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.025]'
							}`}
							onClick={() => setExpandedRun(isExpanded ? null : run.id)}
						>
							<div className="flex items-center gap-3">
								<span
									className={`size-[7px] rounded-full ${run.status === 'running' ? 'animate-pulse' : ''}`}
									style={{ background: rc.color }}
								/>
								<span className="text-[14px] font-medium text-white/80">
									{run.trigger}
								</span>
								<Badge
									variant="outline"
									className="text-[10px] border-white/[0.06] text-white/30"
								>
									{rc.label}
								</Badge>
							</div>
							<div className="flex items-center gap-5 text-[12px] text-white/25">
								<span className="font-mono">{run.duration}</span>
								<span>{run.date}</span>
								<svg
									className={`size-4 text-white/20 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
									viewBox="0 0 16 16"
									fill="none"
								>
									<title>Toggle details</title>
									<path
										d="M4 6l4 4 4-4"
										stroke="currentColor"
										strokeWidth="1.5"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
							</div>
						</div>

						{isExpanded && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: 'auto' }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.15 }}
								className="mt-1 ml-6 pl-5 border-l border-white/[0.06] py-3 space-y-2"
							>
								{run.steps.map((step) => {
									const sc = statusMap[step.status];
									return (
										<div
											key={step.name}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-2.5">
												<span
													className="size-[5px] rounded-full"
													style={{ background: sc.color }}
												/>
												<span className="text-[13px] text-white/50">
													{step.name}
												</span>
											</div>
											<span className="text-[12px] text-white/20 font-mono">
												{step.duration}
											</span>
										</div>
									);
								})}
							</motion.div>
						)}
					</div>
				);
			})}
		</div>
	);
}

/* ── Tab: Metrics ─── */

function MetricsTab() {
	const successRate = MOCK_WORKFLOW.successRate;
	const failCount = Math.round(
		MOCK_WORKFLOW.totalRuns * ((100 - successRate) / 100),
	);

	return (
		<div className="space-y-8">
			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
				<StatCard label="Total Runs" value={String(MOCK_WORKFLOW.totalRuns)} />
				<StatCard
					label="Success Rate"
					value={`${successRate}%`}
					accent="oklch(0.60 0.13 163)"
				/>
				<StatCard label="Avg Duration" value={MOCK_WORKFLOW.avgDuration} />
				<StatCard
					label="Failures (30d)"
					value={String(failCount)}
					accent="rgba(239,68,68,1)"
				/>
			</div>

			{/* Success rate bar */}
			<div>
				<h3 className="text-xs font-semibold uppercase tracking-wider text-white/25 mb-4">
					Success Rate
				</h3>
				<div className="flex items-center gap-4">
					<div className="flex-1 h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
						<motion.div
							initial={{ width: 0 }}
							animate={{ width: `${successRate}%` }}
							transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
							className="h-full rounded-full"
							style={{
								background:
									'linear-gradient(90deg, oklch(0.60 0.13 163), oklch(0.65 0.15 163))',
							}}
						/>
					</div>
					<span className="text-lg font-bold text-white w-14 text-right">
						{successRate}%
					</span>
				</div>
			</div>

			{/* Recent failures */}
			<div>
				<h3 className="text-xs font-semibold uppercase tracking-wider text-white/25 mb-4">
					Recent Failures
				</h3>
				{MOCK_RUNS.filter((r) => r.status === 'failed').length === 0 ? (
					<p className="text-[14px] text-white/30">No recent failures 🎉</p>
				) : (
					<div className="space-y-2">
						{MOCK_RUNS.filter((r) => r.status === 'failed').map((run) => {
							const rc = statusMap[run.status];
							return (
								<div
									key={run.id}
									className="flex items-center justify-between rounded-xl border border-red-500/10 bg-red-500/[0.03] px-5 py-3.5"
								>
									<div className="flex items-center gap-3">
										<span
											className="size-[7px] rounded-full"
											style={{ background: rc.color }}
										/>
										<span className="text-[13px] font-medium text-white/70">
											{run.trigger}
										</span>
									</div>
									<span className="text-[12px] text-white/25">{run.date}</span>
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

/* ── Page ─── */

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
						<HugeiconsIcon icon={Alert02Icon} className="size-8 text-red-400" />
					</div>
					<h3 className="text-[18px] font-semibold text-white/90 mb-2">
						Workflow Not Found
					</h3>
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
					<HugeiconsIcon
						icon={Loading03Icon}
						className="size-8 text-white/20 animate-spin"
					/>
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
								<h1 className="text-2xl font-bold tracking-tight text-white">
									{wf.name}
								</h1>
								<div className="flex items-center gap-1.5 rounded-full border border-white/[0.06] px-2.5 py-1">
									<span
										className={`size-[6px] rounded-full ${wf.status === 'running' ? 'animate-pulse' : ''}`}
										style={{ background: cfg.color }}
									/>
									<span
										className="text-[11px] font-medium"
										style={{ color: cfg.color }}
									>
										{cfg.label}
									</span>
								</div>
							</div>
							<p className="text-[14px] text-white/30 mt-1.5">
								{wf.description}
							</p>
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
							className={`relative px-5 py-2 text-[13px] font-medium rounded-full transition-colors z-10 ${
								activeTab === tab
									? 'text-white'
									: 'text-white/40 hover:text-white/70'
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
