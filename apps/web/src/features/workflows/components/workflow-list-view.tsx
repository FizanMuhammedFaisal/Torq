import { PageHeader } from '@/components/ui/page-header';
import { WorkflowHealthBar } from '@/features/workflows/components/workflow-health-bar';
import {
	Alert02Icon,
	EyeIcon,
	File02Icon,
	FilterIcon,
	MoreHorizontalCircle01Icon,
	PlusSignIcon,
	RefreshIcon,
	Search01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useQueryClient } from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { statusConfig } from '@/features/workflows/config';
import { useTriggerRun } from '@/features/workflows/hooks/use-trigger-run';
import { useWorkflows } from '@/features/workflows/hooks/use-workflows';
import type { WorkflowWithLatestRun, WorkflowStatus } from '@/features/workflows/types';
import { useAppConfig } from '@/lib/app-config';
import { formatDuration, formatRelativeTime } from '@/lib/format';


export function WorkflowListView() {
	const navigate = useNavigate();
	const context = useOutletContext<{ isCollapsed?: boolean }>();
	const isCollapsed = context?.isCollapsed ?? true;
	const queryClient = useQueryClient();

	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>(
		'all',
	);
	const triggerRun = useTriggerRun();
	const [deleteTarget, setDeleteTarget] = useState<WorkflowWithLatestRun | null>(null);

	const {
		data,
		isLoading,
		error,
		refetch: retry,
	} = useWorkflows();

	const workflows = data?.workflows ?? [];

	const filteredWorkflows = useMemo(() => {
		return workflows.filter((wf) => {
			const status = wf.lastRun?.status ?? 'idle';
			const matchesStatus =
				statusFilter === 'all' || status === statusFilter;
			return matchesStatus;
		});
	}, [workflows, statusFilter]);

	const metrics = useMemo(() => {
		return {
			total: data?.meta.totalItems ?? workflows.length,
			running: workflows.filter((w) => w.lastRun?.status === 'RUNNING').length,
			failed: workflows.filter((w) => w.lastRun?.status === 'FAILED').length,
		};
	}, [workflows, data?.meta.totalItems]);

	const { authEnabled } = useAppConfig();

	const handleDelete = () => {
		if (!deleteTarget) return;
		queryClient.setQueryData(
			['workflows', 'list'],
			(old: { workflows: WorkflowWithLatestRun[] } | undefined) =>
				old ? { ...old, workflows: old.workflows.filter((w) => w.id !== deleteTarget.id) } : old,
		);
		setDeleteTarget(null);
	};

	// ── Columns ──
	const columns = useMemo<ColumnDef<WorkflowWithLatestRun>[]>(() => {
		const cols: ColumnDef<WorkflowWithLatestRun>[] = [
			{
				id: 'name',
				accessorFn: (row) => row.name, // Used for global filter
				header: 'Workflow',
				cell: ({ row }) => {
					const wf = row.original;
					const status = wf.lastRun?.status ?? 'IDLE';
					const cfg = statusConfig[status] || statusConfig.IDLE;
					return (
						<div className="flex items-center gap-4 min-w-0 pr-4">
							<div className="relative flex items-center justify-center size-2.5 shrink-0 mt-0.5">
								{status === 'RUNNING' && (
									<span
										className="absolute size-[16px] rounded-full animate-ping opacity-30"
										style={{ backgroundColor: cfg.color }}
									/>
								)}
								<span
									className="relative size-full rounded-full"
									style={{
										backgroundColor: cfg.color,
										boxShadow: `0 0 10px ${cfg.color}80`,
									}}
								/>
							</div>
							<div className="min-w-0 flex flex-col gap-1">
								<div className="flex items-center gap-2.5">
									<span className="text-[14px] font-semibold text-white/95 truncate">
										{wf.name}
									</span>
									<span
										className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap"
										style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}
									>
										{cfg.label.toUpperCase()}
									</span>
								</div>
								{wf.description && (
									<span className="text-[13px] text-white/35 truncate pr-4">
										{wf.description}
									</span>
								)}
							</div>
						</div>
					);
				},
			},
			{
				id: 'health',
				header: 'Health (10 runs)',
				cell: ({ row }) => {
					const health = row.original.health || [];
					if (health.length === 0) return <span className="text-white/10 text-[11px] italic">No history</span>;
					return <WorkflowHealthBar health={health} />;
				}
			},
			{
				accessorKey: 'lastRun',
				header: 'Last Run',
				cell: ({ row }) => (
					<div className="flex items-center gap-2 text-[13px] text-white/60 whitespace-nowrap">
						{row.original.lastRun ? (
							formatRelativeTime(row.original.lastRun.startedAt)
						) : (
							<span className="text-white/10 italic">—</span>
						)}
					</div>
				),
			},
			{
				id: 'duration',
				header: 'Duration',
				cell: ({ row }) => {
					const lastRun = row.original.lastRun;
					return (
						<div className="flex flex-col gap-0.5 justify-center whitespace-nowrap">
							<span className="text-[13px] font-mono text-white/80">
								{lastRun ? formatDuration(lastRun.duration ?? 0) : '—'}
							</span>
						</div>
					);
				},
			},
			{
				id: 'actions',
				header: '',
				cell: ({ row }) => {
					const wf = row.original;
					return (
						<div className="flex items-center justify-end">
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<button
											type="button"
											className="shrink-0 size-8 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/8 transition-colors border border-transparent hover:border-white/5"
											onClick={(e) => e.stopPropagation()}
										/>
									}
								>
									<HugeiconsIcon
										icon={MoreHorizontalCircle01Icon}
										className="size-5"
										strokeWidth={2}
									/>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-[180px]">
									<DropdownMenuGroup>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												const p = triggerRun.mutateAsync({ id: wf.id });
												toast.promise(p, {
													loading: 'Triggering workflow...',
													success: 'Workflow execution started!',
													error: (err: any) => err.response?.data?.message || 'Failed to trigger workflow',
												});
											}}
											disabled={triggerRun.isPending}
										>
											<svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
												<title>Run</title>
												<polygon points="6 3 20 12 6 21 6 3" />
											</svg>
											Run Workflow
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={(e) => {
												e.stopPropagation();
												navigate(`/dashboard/workflows/${wf.id}`);
											}}
										>
											<HugeiconsIcon
												icon={EyeIcon}
												className="size-4"
												strokeWidth={2}
											/>
											View Details
										</DropdownMenuItem>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem
											variant="destructive"
											onClick={(e) => {
												e.stopPropagation();
												setDeleteTarget(wf);
											}}
										>
											<svg
												className="size-4"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth={2}
												strokeLinecap="round"
												strokeLinejoin="round"
											>
												<title>Delete</title>
												<path d="M3 6h18" />
												<path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
											</svg>
											Delete Workflow
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];

		return cols;
	}, [navigate, triggerRun]);

	return (
		<div className="flex flex-col h-full bg-zinc-950">
			{/* Header */}
			<PageHeader
				title="Workflows"
				subtitle={
					<p className="text-[14px] text-white/40 mt-1.5 flex items-center gap-2 font-medium">
						<span className="relative flex size-2.5 items-center justify-center">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
							<span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
						</span>
						Torq Engine via {authEnabled ? 'Workspace' : 'Default Namespace'}
					</p>
				}
			>
				<AnimatePresence>
					{isCollapsed && (
						<motion.div
							initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
							animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
							exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
							transition={{ duration: 0.2 }}
						>
							<Button
								onClick={() => navigate('/dashboard/workflows/create')}
								className="gap-2 rounded-full px-5 text-[13px] font-bold h-9 shadow-[0_4px_20px_-4px_rgba(52,211,153,0.3)] bg-emerald-400 text-emerald-950 hover:bg-emerald-500 border-0"
							>
								<HugeiconsIcon
									icon={PlusSignIcon}
									className="size-4"
									strokeWidth={2.5}
								/>
								New Workflow
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</PageHeader>

			<div className="flex-1 overflow-hidden w-full p-6 lg:p-8">
				<div className="w-full h-full max-w-7xl mx-auto flex flex-col space-y-6">
					{/* ── Toolbar ── */}
					<div className="flex-none flex items-center justify-between gap-4">
						<div className="relative w-full max-w-sm">
							<HugeiconsIcon
								icon={Search01Icon}
								className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-white/30"
							/>
							<input
								type="text"
								placeholder="Search workflows by name..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full bg-neutral-900 border border-white/10 rounded-full h-10 pl-10 pr-4 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
							/>
						</div>

						<div className="flex items-center gap-3">
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button
											variant="outline"
											className="gap-2 h-10 rounded-full px-4 border-white/10 bg-neutral-900 hover:bg-white/5"
										/>
									}
								>
									<HugeiconsIcon
										icon={FilterIcon}
										className="size-4 text-white/50"
									/>
									<span className="text-[13px] font-medium text-white/80">
										{' '}
										Status: {statusFilter === 'all' ? 'All' : statusFilter}
									</span>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuGroup>
										<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
										<DropdownMenuSeparator />
										<DropdownMenuCheckboxItem
											checked={statusFilter === 'all'}
											onCheckedChange={() => setStatusFilter('all')}
										>
											All Statuses
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={statusFilter === 'RUNNING'}
											onCheckedChange={() => setStatusFilter('RUNNING')}
										>
											Running
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={statusFilter === 'FAILED'}
											onCheckedChange={() => setStatusFilter('FAILED')}
										>
											Failed
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={statusFilter === 'SUCCESS'}
											onCheckedChange={() => setStatusFilter('SUCCESS')}
										>
											Passed
										</DropdownMenuCheckboxItem>
										<DropdownMenuCheckboxItem
											checked={statusFilter === 'IDLE'}
											onCheckedChange={() => setStatusFilter('IDLE')}
										>
											Idle
										</DropdownMenuCheckboxItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>

							<Button
								onClick={() => retry()}
								variant="outline"
								size="icon"
								className="size-10 rounded-full border-white/10 bg-neutral-900 hover:bg-white/5"
							>
								<HugeiconsIcon icon={RefreshIcon} className="size-4" />
							</Button>
						</div>
					</div>

					{/* ── Main Data Area ── */}
					<div className="flex-1 overflow-hidden">
						{error ? (
							<div className="border border-red-500/20 bg-red-500/2 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
								<div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
									<HugeiconsIcon
										icon={Alert02Icon}
										className="size-8 text-red-400"
									/>
								</div>
								<h3 className="text-[18px] font-semibold text-white/90 mb-2">
									Failed to load workflows
								</h3>
								<p className="text-[14px] text-white/50 max-w-sm mb-8">
									{error instanceof Error ? error.message : 'Unknown error'}
								</p>
								<Button
									onClick={() => retry()}
									variant="outline"
									className="gap-2 h-10 rounded-full px-6 border-white/8 hover:bg-white/4"
								>
									<HugeiconsIcon icon={RefreshIcon} className="size-4" />
									Try Again
								</Button>
							</div>
						) : isLoading ? (
							<div className="w-full">
								<div className="flex flex-col">
									{[1, 2, 3, 4, 5].map((i) => (
										<div
											key={i}
											className="flex items-center gap-6 px-4 py-4 border-b border-white/5"
										>
											<div className="flex items-center gap-4 w-1/3">
												<div className="size-2.5 rounded-full bg-white/3 animate-pulse" />
												<div className="flex flex-col gap-2 w-full">
													<div className="w-3/4 h-3.5 bg-white/4 rounded animate-pulse" />
													<div className="w-1/2 h-2.5 bg-white/2 rounded animate-pulse" />
												</div>
											</div>
											<div className="w-24 h-4 bg-white/3 rounded-full animate-pulse" />
											<div className="w-20 h-3 bg-white/3 rounded animate-pulse ml-auto" />
											<div className="size-8 rounded-full bg-white/3 animate-pulse" />
										</div>
									))}
								</div>
							</div>
						) : metrics.total === 0 &&
							!searchQuery &&
							statusFilter === 'all' ? (
							<div className="border border-dashed border-white/10 bg-white/1 rounded-2xl p-16 flex flex-col items-center justify-center text-center mt-2">
								<div className="size-16 rounded-full bg-white/3 flex items-center justify-center mb-6 border border-white/5">
									<HugeiconsIcon
										icon={File02Icon}
										className="size-7 text-white/40"
									/>
								</div>
								<h3 className="text-[18px] font-semibold text-white/90 mb-2">
									No workflows found
								</h3>
								<p className="text-[14px] text-white/40 max-w-sm mb-8">
									You don't have any workflows in this namespace yet. Create
									your first workflow to start automating.
								</p>
								<Button
									onClick={() => navigate('/dashboard/workflows/create')}
									className="gap-2 h-10 rounded-full px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-[0_0_12px_rgba(16,185,129,0.4)]"
								>
									<HugeiconsIcon
										icon={PlusSignIcon}
										className="size-4"
										strokeWidth={2.5}
									/>
									Create Workflow
								</Button>
							</div>
						) : (
							<DataTable
								columns={columns}
								data={filteredWorkflows}
								searchQuery={searchQuery}
								searchKey="name"
								noResultsMessage="No workflows found"
								noResultsSubtext={
									searchQuery || statusFilter !== 'all'
										? 'Try adjusting your filters.'
										: 'Get started by creating a new workflow.'
								}
								onRowClick={(row) => navigate(`/dashboard/workflows/${row.id}`)}
							/>
						)}
					</div>
				</div>
			</div>

			<ConfirmDialog
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
				title="Delete workflow"
				description={`This will permanently delete "${deleteTarget?.name}" and all its run history. This action cannot be undone.`}
				confirmText={deleteTarget?.name ?? ''}
				confirmLabel="Delete Workflow"
				variant="destructive"
				onConfirm={handleDelete}
			/>
		</div>
	);
}

