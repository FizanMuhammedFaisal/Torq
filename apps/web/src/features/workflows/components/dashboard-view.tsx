import { useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useWorkflows } from '@/features/workflows/hooks/use-workflows';
import { DashboardHeader } from '@/features/workflows/components/dashboard/dashboard-header';
import { DashboardMetrics } from '@/features/workflows/components/dashboard/dashboard-metrics';
import { DashboardRecentExecutions } from '@/features/workflows/components/dashboard/dashboard-recent-executions';
import { useAppConfig } from '@/lib/app-config';

export function DashboardView() {
	const navigate = useNavigate();
	const context = useOutletContext<{ isCollapsed?: boolean }>();
	const isCollapsed = context?.isCollapsed ?? true;

	const { authEnabled } = useAppConfig();
	const { data, isLoading, error, refetch } = useWorkflows();
	const workflows = data?.workflows ?? [];

	const metrics = useMemo(() => {
		return {
			total: workflows.length,
			running: workflows.filter((w) => w.lastRun?.status === 'running').length,
			failed: workflows.filter((w) => w.lastRun?.status === 'failed').length,
		};
	}, [workflows]);

	const recentWorkflows = workflows.slice(0, 5);

	return (
		<div className="flex flex-col h-full bg-zinc-950">
			<DashboardHeader
				isCollapsed={isCollapsed}
				isAuthEnabled={authEnabled}
			/>

			<div className="flex-1 overflow-y-auto w-full p-6 lg:p-8">
				<div className="w-full max-w-7xl mx-auto space-y-8">
					<DashboardMetrics isLoading={isLoading} metrics={metrics} />

					<DashboardRecentExecutions
						workflows={recentWorkflows}
						isLoading={isLoading}
						error={error as Error | null}
						onRetry={() => refetch()}
						onViewAll={() => navigate('/dashboard/workflows')}
						onViewWorkflow={(id: string) => navigate(`/dashboard/workflows/${id}`)}
						onCreateWorkflow={() => navigate('/dashboard/workflows/new')}
					/>
				</div>
			</div>
		</div>
	);
}
