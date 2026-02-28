import { useEffect, useMemo, useState } from 'react';
import type { Workflow, WorkflowStatus } from '../types';
import { MOCK_WORKFLOWS } from './mock-data';

export function useWorkflows() {
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchWorkflows = async () => {
			try {
				setIsLoading(true);
				setError(null);
				// Simulate network delay
				await new Promise((resolve) => setTimeout(resolve, 800));

				// Optional: Simulate a random error for testing
				// if (Math.random() > 0.8) throw new Error('Failed to fetch workflows from Torq Engine. Please check your connection.');

				// Multiply mock data to demonstrate scrolling and pagination
				const extendedMocks = Array.from({ length: 5 }).flatMap((_, i) =>
					MOCK_WORKFLOWS.map((wf) => ({
						...wf,
						id: `${wf.id}-${i}`,
						name: i === 0 ? wf.name : `${wf.name} (Copy ${i})`,
					})),
				);

				setWorkflows(extendedMocks);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error('Failed to load workflows'),
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchWorkflows();
	}, []);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>(
		'all',
	);

	const handleDelete = (id: string) => {
		setWorkflows((prev) => prev.filter((w) => w.id !== id));
	};

	// Derived state
	const filteredWorkflows = useMemo(() => {
		return workflows.filter((wf) => {
			const matchesStatus =
				statusFilter === 'all' || wf.status === statusFilter;
			return matchesStatus; // search handles name/desc natively via TanStack Table
		});
	}, [workflows, statusFilter]);

	// Metrics
	const metrics = useMemo(() => {
		return {
			total: workflows.length,
			running: workflows.filter((w) => w.status === 'running').length,
			failed: workflows.filter((w) => w.status === 'failed').length,
		};
	}, [workflows]);

	return {
		workflows: filteredWorkflows,
		metrics,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		handleDelete,
		isLoading,
		error,
		// Optional: Provide a way to retry
		retry: () => {
			setIsLoading(true);
			setError(null);
			setTimeout(() => {
				const extendedMocks = Array.from({ length: 5 }).flatMap((_, i) =>
					MOCK_WORKFLOWS.map((wf) => ({
						...wf,
						id: `${wf.id}-${i}`,
						name: i === 0 ? wf.name : `${wf.name} (Copy ${i})`,
					})),
				);
				setWorkflows(extendedMocks);
				setIsLoading(false);
			}, 800);
		},
	};
}
