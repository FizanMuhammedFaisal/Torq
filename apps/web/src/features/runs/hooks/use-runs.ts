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
	durationMs?: number;
	namespace: string;
	stepCount: number;
	workflowVersion?: string;
	stepsMap: Record<string, { status: string; ts?: number }>;
}

async function fetchRuns(workflowId?: string): Promise<Run[]> {
	const response = await runService.list({ workflowId });
	const runsData = response.data || [];

	return runsData.map((r) => ({
		id: r.id,
		workflowId: r.workflowId,
		workflowName: r.workflowName || 'Unknown Workflow',
		status: (r.status as WorkflowStatus) || 'IDLE',
		trigger: r.trigger || 'unknown',
		date: formatRelativeTime(r.startedAt),
		duration: formatDuration(r.durationMs),
		durationMs: r.durationMs,
		namespace: r.namespace || 'default',
		stepCount: r.stepCount ?? 0,
		workflowVersion: r.workflowVersion || '1',
		stepsMap: r.steps || {},
	}));
}

export function useRuns(options: { workflowId?: string; refetchInterval?: number } = {}) {
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

	const query = useQuery({
		queryKey: ['runs', 'list', options.workflowId],
		queryFn: () => fetchRuns(options.workflowId),
		refetchInterval: options.refetchInterval ?? 15_000,
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
			active: runs.filter((r) => r.status === 'RUNNING' || r.status === 'QUEUED').length,
			failed24h: runs.filter((r) => r.status === 'FAILED').length,
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
