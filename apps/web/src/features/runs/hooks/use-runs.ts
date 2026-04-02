import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { WorkflowStatus } from '@/features/workflows/types';
import { runService } from '../service/run.service';
import { formatDuration, formatRelativeTime } from '@/lib/format';

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

async function fetchRuns(): Promise<Run[]> {
	const response = await runService.list();
	const runsData = response.data || [];

	return runsData.map((r) => ({
		id: r.id,
		workflowId: r.workflowId,
		workflowName: r.workflowName || 'Unknown Workflow',
		status: (r.status as WorkflowStatus) || 'idle',
		trigger: r.trigger || 'unknown',
		date: formatRelativeTime(r.startedAt),
		duration: formatDuration(r.durationMs),
		namespace: r.namespace || 'default',
		steps: r.stepCount ?? 0,
	}));
}

export function useRuns() {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

	const query = useQuery({
		queryKey: ['runs', 'list'],
		queryFn: fetchRuns,
		// Refetch every 15s to simulate live updates until we have WebSockets
		refetchInterval: 15_000,
	});

	const runs = query.data ?? [];

	const filteredRuns = useMemo(() => {
		return runs.filter((run) => {
			const matchesStatus = statusFilter === 'all' || run.status === statusFilter;
			return matchesStatus;
		});
	}, [runs, statusFilter]);

	const metrics = useMemo(() => {
		return {
			total: runs.length,
			active: runs.filter((r) => r.status === 'running' || r.status === 'queued').length,
			failed24h: runs.filter((r) => r.status === 'failed').length,
		};
	}, [runs]);

	return {
		runs: filteredRuns,
		metrics,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		isLoading: query.isLoading,
		error: query.error as Error | null,
		retry: query.refetch,
	};
}
