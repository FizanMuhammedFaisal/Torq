import { useCallback, useEffect, useMemo, useState } from 'react';
import type { WorkflowStatus } from '../types';

export interface Run {
	id: string;
	workflowId: string;
	workflowName: string;
	status: WorkflowStatus;
	trigger: string;
	date: string;
	duration: string;
	namespace: string;
	steps: number;
}

const MOCK_RUNS: Run[] = [
	{
		id: 'run-12',
		workflowId: 'wf-1',
		workflowName: 'CI / Build & Test',
		status: 'running',
		trigger: 'push to develop',
		date: 'Just now',
		duration: '1m 12s',
		namespace: 'engineering/core',
		steps: 5,
	},
	{
		id: 'run-11',
		workflowId: 'wf-3',
		workflowName: 'Nightly Database Backup',
		status: 'success',
		trigger: 'cron (0 2 * * *)',
		date: '4 hours ago',
		duration: '45m 12s',
		namespace: 'ops/infrastructure',
		steps: 8,
	},
	{
		id: 'run-10',
		workflowId: 'wf-2',
		workflowName: 'Deploy to Production',
		status: 'failed',
		trigger: 'manual by m.faisal',
		date: '12 hours ago',
		duration: '4m 30s',
		namespace: 'engineering/core',
		steps: 12,
	},
	{
		id: 'run-9',
		workflowId: 'wf-1',
		workflowName: 'CI / Build & Test',
		status: 'success',
		trigger: 'pull_request #142',
		date: '14 hours ago',
		duration: '2m 15s',
		namespace: 'engineering/core',
		steps: 5,
	},
	{
		id: 'run-8',
		workflowId: 'wf-4',
		workflowName: 'Send Weekly Newsletter',
		status: 'success',
		trigger: 'cron (0 9 * * 1)',
		date: '1 day ago',
		duration: '1m 02s',
		namespace: 'marketing/campaigns',
		steps: 3,
	},
	{
		id: 'run-7',
		workflowId: 'wf-5',
		workflowName: 'Sync Salesforce Data',
		status: 'queued',
		trigger: 'webhook',
		date: '1 day ago',
		duration: '—',
		namespace: 'sales/ops',
		steps: 4,
	},
];

export function useRuns() {
	const [runs, setRuns] = useState<Run[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

	const fetchRuns = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			// Simulate network latency
			await new Promise((resolve) => setTimeout(resolve, 600));

			setRuns(MOCK_RUNS);
		} catch (err) {
			setError(err instanceof Error ? err : new Error('Failed to load runs'));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRuns();
	}, [fetchRuns]);

	// Simulate WebSocket "Live" Feed
	useEffect(() => {
		if (isLoading) return;

		let timeoutId: number;

		const insertRandomExecution = () => {
			const statuses: WorkflowStatus[] = ['running', 'queued', 'success', 'failed'];
			const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

			const workflows = [
				'CI / Build & Test',
				'Nightly Database Backup',
				'Deploy to Production',
				'Send Weekly Newsletter',
				'Sync Salesforce Data',
			];
			const randomWf = workflows[Math.floor(Math.random() * workflows.length)];

			const newRun: Run = {
				id: `run-${Date.now()}`,
				workflowId: `wf-${Math.floor(Math.random() * 5) + 1}`,
				workflowName: randomWf,
				status: randomStatus,
				trigger: 'system_webhook',
				date: 'Just now',
				duration: randomStatus === 'running' || randomStatus === 'queued' ? '—' : '12s',
				namespace: 'engineering/core',
				steps: Math.floor(Math.random() * 10) + 1,
			};

			setRuns((prev) => [newRun, ...prev].slice(0, 100)); // Keep a max of 100 in feed to not kill DOM

			// Randomly enqueue the next execution between 3 and 10 seconds
			timeoutId = window.setTimeout(insertRandomExecution, Math.random() * 7000 + 3000);
		};

		timeoutId = window.setTimeout(insertRandomExecution, 5000);

		return () => clearTimeout(timeoutId);
	}, [isLoading]);

	// Filtering
	const filteredRuns = useMemo(() => {
		return runs.filter((run) => {
			const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
			return matchesStatus; // TanStack table handles the search natively via name
		});
	}, [runs, statusFilter]);

	// Metrics
	const metrics = useMemo(() => {
		return {
			// Offset by a large number to emulate global total runs, adding the actual array length
			// as it grows so the counter rolls up on screen
			total: 1420500 + runs.length,
			active: runs.filter((r) => r.status === 'running' || r.status === 'queued').length,
			failed24h: runs.filter((r) => r.status === 'failed').length, // Mocked as just standard failed for now
		};
	}, [runs]);

	return {
		runs: filteredRuns,
		metrics,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		isLoading,
		error,
		retry: fetchRuns,
	};
}
