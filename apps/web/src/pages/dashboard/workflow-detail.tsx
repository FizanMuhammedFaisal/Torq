import {
	Alert02Icon,
	Loading03Icon,
	GridIcon,
	GearsIcon,
	File02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { type ValidationError, YamlEditor } from '@/components/yaml-editor';
import { AnimatedCounter } from '@/components/ui/animated-counter';

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

/* ── Metric Card ─── */

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

/* ── Tab: Overview ─── */

function OverviewTab() {
	const wf = MOCK_WORKFLOW;
	const cfg = statusMap[wf.status];

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
					accent="emerald"
					icon={GridIcon}
					delay={0.15}
				/>
				<MetricCard
					label="Status"
					value={cfg.label}
					accent={wf.status === 'success' ? 'emerald' : 'red'}
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

					<div className="pt-5 border-t border-white/4 flex items-center justify-between relative z-10">
						<div className="text-[12px] text-white/30 tracking-wider uppercase font-semibold">
							Project
						</div>
						<Badge variant="outline" className="border-white/10 text-white/50 bg-white/2">
							Core Engineering
						</Badge>
					</div>
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
											<HugeiconsIcon icon={isSuccess ? GridIcon : Alert02Icon} className="size-5" />
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
					{!saved && <span className="text-[12px] text-white/20">• Unsaved changes</span>}
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
						<p key={`${err.line}-${err.message}`} className="text-[13px] text-red-400">
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
						<button
							type="button"
							className={`w-full text-left flex items-center justify-between rounded-xl border px-5 py-4 cursor-pointer transition-all ${
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
								<span className="text-[14px] font-medium text-white/80">{run.trigger}</span>
								<Badge variant="outline" className="text-[10px] border-white/[0.06] text-white/30">
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
						</button>

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
										<div key={step.name} className="flex items-center justify-between">
											<div className="flex items-center gap-2.5">
												<span
													className="size-[5px] rounded-full"
													style={{ background: sc.color }}
												/>
												<span className="text-[13px] text-white/50">{step.name}</span>
											</div>
											<span className="text-[12px] text-white/20 font-mono">{step.duration}</span>
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

/* ── Tab: Metrics (Apple/Google Inspired) ─── */

function MetricsTab() {
	const successRate = MOCK_WORKFLOW.successRate;

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
					status: isSuccess ? 'success' : 'failed',
					durationSec,
					label: `Run #${128 - i}`,
				};
			})
			.reverse();
	}, []);

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
					Aggregated duration across <AnimatedCounter value={MOCK_WORKFLOW.totalRuns} /> total
					executions since creation.
				</p>
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Widget 2: Execution History Histogram (Battery/Usage Style) */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="lg:col-span-2 rounded-3xl border border-white/[0.04] bg-[#0c0c0c] p-6 sm:p-8 flex flex-col"
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

					<div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-2 h-[180px] w-full pt-4 border-b border-white/[0.05] pb-2">
						{history.map((run, i) => {
							const heightPct = Math.max((run.durationSec / maxDuration) * 100, 4); // min 4% height
							const isSuccess = run.status === 'success';
							return (
								<div
									key={run.id}
									className="group relative flex-1 flex justify-center h-full items-end"
								>
									{/* Tooltip */}
									<div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a1a] border border-white/10 text-white text-[11px] rounded-md px-2.5 py-1.5 pointer-events-none whitespace-nowrap z-10 shadow-xl">
										<div className="font-semibold">{run.label}</div>
										<div className={`text-${isSuccess ? 'emerald' : 'red'}-400`}>
											{Math.round(run.durationSec)}s
										</div>
									</div>
									<motion.div
										initial={{ height: 0 }}
										animate={{ height: `${heightPct}%` }}
										transition={{ duration: 0.7, delay: i * 0.01 + 0.2, ease: 'easeOut' }}
										className={`w-full rounded-sm opacity-80 hover:opacity-100 transition-opacity cursor-crosshair ${
											isSuccess
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
					className="rounded-3xl border border-white/[0.04] bg-[#0c0c0c] p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden"
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
								transition={{ duration: 1.5, delay: 0.4, ease: 'easeOut' }}
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
				className="rounded-3xl border border-white/[0.04] bg-[#0c0c0c] p-6 sm:p-8"
				style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.02)' }}
			>
				<h3 className="text-[16px] font-semibold text-white/90 mb-1">Configuration History</h3>
				<p className="text-[13px] text-white/40 mb-6">
					Recent revisions of this workflow's YAML specification.
				</p>

				<div className="space-y-4">
					<div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white/[0.02] border border-emerald-500/20 relative overflow-hidden">
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

					<div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
						<div className="size-10 shrink-0 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/40">
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

					<div className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03]">
						<div className="size-10 shrink-0 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/[0.05] text-white/40">
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
					<HugeiconsIcon icon={Loading03Icon} className="size-8 text-white/20 animate-spin" />
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
							className={`relative px-5 py-2 text-[13px] font-medium rounded-full transition-colors z-10 ${
								activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
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
