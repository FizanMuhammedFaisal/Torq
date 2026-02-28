import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/* ── Types ──────────────────────────────────────────────────── */

type WorkflowStatus = 'idle' | 'queued' | 'running' | 'success' | 'failed';

interface Workflow {
	id: string;
	name: string;
	description: string;
	status: WorkflowStatus;
	lastRun?: string;
	duration?: string;
	steps: { name: string; status: WorkflowStatus }[];
}

/* ── Mock Data ──────────────────────────────────────────────── */

const MOCK_WORKFLOWS: Workflow[] = [
	{
		id: 'wf-1',
		name: 'CI / Build & Test',
		description: 'Install dependencies, lint, type-check, and run unit tests',
		status: 'idle',
		lastRun: '12 min ago',
		duration: '2m 34s',
		steps: [
			{ name: 'Install deps', status: 'idle' },
			{ name: 'Lint', status: 'idle' },
			{ name: 'Type check', status: 'idle' },
			{ name: 'Unit tests', status: 'idle' },
		],
	},
	{
		id: 'wf-2',
		name: 'Deploy to Staging',
		description: 'Build Docker image, push to registry, deploy to staging cluster',
		status: 'idle',
		lastRun: '1 hr ago',
		duration: '5m 12s',
		steps: [
			{ name: 'Build image', status: 'idle' },
			{ name: 'Push to registry', status: 'idle' },
			{ name: 'Deploy', status: 'idle' },
			{ name: 'Health check', status: 'idle' },
		],
	},
	{
		id: 'wf-3',
		name: 'Database Migration',
		description: 'Run pending migrations and seed test data',
		status: 'idle',
		lastRun: '3 days ago',
		duration: '45s',
		steps: [
			{ name: 'Backup', status: 'idle' },
			{ name: 'Run migrations', status: 'idle' },
			{ name: 'Seed data', status: 'idle' },
		],
	},
	{
		id: 'wf-4',
		name: 'Nightly E2E Suite',
		description: 'Full end-to-end tests against staging environment',
		status: 'idle',
		lastRun: 'Yesterday',
		duration: '14m 08s',
		steps: [
			{ name: 'Spin up env', status: 'idle' },
			{ name: 'Auth tests', status: 'idle' },
			{ name: 'API tests', status: 'idle' },
			{ name: 'UI tests', status: 'idle' },
			{ name: 'Teardown', status: 'idle' },
		],
	},
];

/* ── Helpers ────────────────────────────────────────────────── */

const statusConfig: Record<WorkflowStatus, { label: string; color: string; dot: string }> = {
	idle: { label: 'Idle', color: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground/50' },
	queued: { label: 'Queued', color: 'bg-yellow-500/10 text-yellow-500', dot: 'bg-yellow-500' },
	running: { label: 'Running', color: 'bg-blue-500/10 text-blue-500', dot: 'bg-blue-500' },
	success: { label: 'Success', color: 'bg-primary/10 text-primary', dot: 'bg-primary' },
	failed: { label: 'Failed', color: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
};

function StatusBadge({ status }: { status: WorkflowStatus }) {
	const cfg = statusConfig[status];
	return (
		<Badge variant="outline" className={`gap-1.5 border-0 ${cfg.color}`}>
			<span
				className={`size-1.5 rounded-full ${cfg.dot} ${status === 'running' ? 'animate-pulse' : ''}`}
			/>
			{cfg.label}
		</Badge>
	);
}

/* ── Simulate a run ─────────────────────────────────────────── */

function simulateRun(wf: Workflow, onUpdate: (w: Workflow) => void) {
	const steps = wf.steps.map((s) => ({ ...s, status: 'queued' as WorkflowStatus }));
	let current: Workflow = { ...wf, status: 'running', steps };
	onUpdate(current);

	let i = 0;
	const interval = setInterval(() => {
		if (i < steps.length) {
			steps[i].status = 'running';
			current = { ...current, steps: [...steps] };
			onUpdate(current);

			setTimeout(
				() => {
					const pass = Math.random() > 0.1; // 90% pass rate
					steps[i].status = pass ? 'success' : 'failed';
					current = { ...current, steps: [...steps] };

					if (!pass) {
						current.status = 'failed';
						clearInterval(interval);
					}

					onUpdate(current);
					i++;

					if (i === steps.length && current.status !== 'failed') {
						current = { ...current, status: 'success', lastRun: 'Just now' };
						onUpdate(current);
						clearInterval(interval);
					}
				},
				800 + Math.random() * 1200,
			);
		}
	}, 1400);

	return () => clearInterval(interval);
}

/* ── Page Component ─────────────────────────────────────────── */

export function DashboardPage() {
	const [workflows, setWorkflows] = useState<Workflow[]>(MOCK_WORKFLOWS);
	const [selected, setSelected] = useState<string | null>(null);

	const updateWorkflow = (updated: Workflow) => {
		setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
	};

	const runWorkflow = (id: string) => {
		const wf = workflows.find((w) => w.id === id);
		if (!wf || wf.status === 'running') return;

		// Reset to idle before running
		const reset: Workflow = {
			...wf,
			status: 'idle',
			steps: wf.steps.map((s) => ({ ...s, status: 'idle' as WorkflowStatus })),
		};
		updateWorkflow(reset);

		setTimeout(() => simulateRun(reset, updateWorkflow), 100);
	};

	const selectedWf = workflows.find((w) => w.id === selected);

	return (
		<div className="flex flex-col h-full">
			{/* Header */}
			<div className="flex items-center justify-between px-6 lg:px-8 py-5 border-b border-border/50">
				<div>
					<h1 className="text-xl font-bold tracking-tight text-foreground">Workflows</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Run and monitor your automation pipelines
					</p>
				</div>
				<Button size="sm" className="gap-1.5">
					<PlusIcon className="size-3.5" />
					New workflow
				</Button>
			</div>

			<div className="flex flex-1 overflow-hidden">
				{/* Workflow list */}
				<div className="flex-1 overflow-y-auto p-6 lg:p-8">
					<div className="grid gap-3">
						{workflows.map((wf) => (
							<motion.div
								key={wf.id}
								layout
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.15, ease: [0.25, 1, 0.5, 1] }}
							>
								<Card
									className={`group relative cursor-pointer transition-colors border-border/50 hover:border-border p-0 ${
										selected === wf.id ? 'border-primary/30 bg-primary/[0.02]' : ''
									}`}
									onClick={() => setSelected(selected === wf.id ? null : wf.id)}
								>
									<div className="flex items-center gap-4 px-4 py-3.5">
										{/* Status indicator line */}
										<div
											className={`w-0.5 h-10 rounded-full shrink-0 transition-colors ${
												statusConfig[wf.status].dot
											}`}
										/>

										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2.5">
												<h3 className="text-sm font-semibold text-foreground truncate">
													{wf.name}
												</h3>
												<StatusBadge status={wf.status} />
											</div>
											<p className="text-xs text-muted-foreground mt-0.5 truncate">
												{wf.description}
											</p>
										</div>

										<div className="flex items-center gap-3 shrink-0">
											{wf.lastRun && (
												<span className="text-xs text-muted-foreground/60 hidden sm:block">
													{wf.lastRun}
												</span>
											)}
											<Button
												size="sm"
												variant={wf.status === 'running' ? 'outline' : 'default'}
												className="gap-1.5 h-8 text-xs"
												disabled={wf.status === 'running'}
												onClick={(e) => {
													e.stopPropagation();
													runWorkflow(wf.id);
												}}
											>
												{wf.status === 'running' ? (
													<>
														<LoadingSpinner className="size-3" />
														Running…
													</>
												) : (
													<>
														<PlayIcon className="size-3" />
														Run
													</>
												)}
											</Button>
										</div>
									</div>
								</Card>
							</motion.div>
						))}
					</div>
				</div>

				{/* Detail panel */}
				<AnimatePresence>
					{selectedWf && (
						<motion.aside
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 360, opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
							className="border-l border-border/50 overflow-hidden hidden lg:block"
						>
							<div className="w-[360px] p-6 h-full overflow-y-auto">
								<div className="flex items-center justify-between mb-1">
									<h2 className="text-sm font-bold text-foreground">{selectedWf.name}</h2>
									<StatusBadge status={selectedWf.status} />
								</div>
								<p className="text-xs text-muted-foreground mb-5">{selectedWf.description}</p>

								{selectedWf.duration && (
									<div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
										<span>
											<strong className="text-foreground font-medium">Last run:</strong>{' '}
											{selectedWf.lastRun}
										</span>
										<span>
											<strong className="text-foreground font-medium">Duration:</strong>{' '}
											{selectedWf.duration}
										</span>
									</div>
								)}

								<Separator className="opacity-30 mb-5" />

								<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
									Steps
								</h3>

								<div className="flex flex-col gap-0">
									{selectedWf.steps.map((step, i) => (
										<div key={step.name} className="flex items-center gap-3">
											{/* Vertical connector */}
											<div className="flex flex-col items-center">
												<StepDot status={step.status} />
												{i < selectedWf.steps.length - 1 && (
													<div className="w-px h-6 bg-border/50" />
												)}
											</div>
											<span
												className={`text-sm py-1 ${
													step.status === 'running'
														? 'text-blue-400 font-medium'
														: step.status === 'success'
															? 'text-primary'
															: step.status === 'failed'
																? 'text-destructive'
																: 'text-muted-foreground'
												}`}
											>
												{step.name}
											</span>
										</div>
									))}
								</div>

								<div className="mt-6">
									<Button
										className="w-full gap-1.5"
										disabled={selectedWf.status === 'running'}
										onClick={() => runWorkflow(selectedWf.id)}
									>
										{selectedWf.status === 'running' ? (
											<>
												<LoadingSpinner className="size-3.5" />
												Running…
											</>
										) : (
											<>
												<PlayIcon className="size-3.5" />
												Run workflow
											</>
										)}
									</Button>
								</div>
							</div>
						</motion.aside>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

/* ── Step Dot ───────────────────────────────────────────────── */

function StepDot({ status }: { status: WorkflowStatus }) {
	const base = 'size-3 rounded-full border-2 transition-colors';
	switch (status) {
		case 'success':
			return (
				<div className={`${base} border-primary bg-primary`}>
					<svg viewBox="0 0 12 12" className="size-full text-primary-foreground">
						<path
							d="M3.5 6.5L5 8l3.5-4"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			);
		case 'failed':
			return <div className={`${base} border-destructive bg-destructive`} />;
		case 'running':
			return <div className={`${base} border-blue-500 bg-blue-500 animate-pulse`} />;
		case 'queued':
			return <div className={`${base} border-yellow-500/50 bg-transparent`} />;
		default:
			return <div className={`${base} border-border bg-transparent`} />;
	}
}

/* ── Inline Icons ───────────────────────────────────────────── */

function PlayIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="currentColor"
			className={className}
		>
			<polygon points="6 3 20 12 6 21 6 3" />
		</svg>
	);
}

function PlusIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			className={className}
		>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	);
}

function LoadingSpinner({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			className={`animate-spin ${className}`}
		>
			<circle
				cx="12"
				cy="12"
				r="10"
				stroke="currentColor"
				strokeWidth={3}
				strokeDasharray="60 30"
				strokeLinecap="round"
			/>
		</svg>
	);
}
