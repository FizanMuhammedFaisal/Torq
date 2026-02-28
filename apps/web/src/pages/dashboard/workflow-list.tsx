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
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
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
import { useWorkflows } from '@/features/workflows/api/use-workflows';
import { statusConfig } from '@/features/workflows/config';
import type { Workflow } from '@/features/workflows/types';
import { useAppConfig } from '@/lib/app-config';

/* ── Page ─── */

export function WorkflowListPage() {
	const navigate = useNavigate();
	const context = useOutletContext<{ isCollapsed?: boolean }>();
	const isCollapsed = context?.isCollapsed ?? true;

	const {
		workflows: filteredWorkflows,
		metrics,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		handleDelete: deleteWorkflow,
		isLoading,
		error,
		retry,
	} = useWorkflows();

	const [deleteTarget, setDeleteTarget] = useState<Workflow | null>(null);

	const { authEnabled } = useAppConfig();

	const handleDelete = () => {
		if (!deleteTarget) return;
		deleteWorkflow(deleteTarget.id);
		setDeleteTarget(null);
	};

	// ── Columns ──
	const columns = useMemo<ColumnDef<Workflow>[]>(() => {
		const cols: ColumnDef<Workflow>[] = [
			{
				id: 'name',
				accessorFn: (row) => row.name, // Used for global filter
				header: 'Workflow',
				cell: ({ row }) => {
					const wf = row.original;
					const cfg = statusConfig[wf.status];
					return (
						<div className="flex items-center gap-4 min-w-0 pr-4">
							<div className="relative flex items-center justify-center size-2.5 shrink-0 mt-0.5">
								{wf.status === 'running' && (
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
										style={{ color: cfg.color, backgroundColor: cfg.bg }}
									>
										{cfg.label.toUpperCase()}
									</span>
								</div>
								<span className="text-[13px] text-white/40 truncate pr-4">{wf.description}</span>
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: 'namespace',
				header: 'Namespace',
				cell: ({ row }) => (
					<div className="flex items-center min-w-0 text-[13px] text-white/60">
						<div className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.05] truncate max-w-full font-mono text-[11.5px]">
							{row.original.namespace}
						</div>
					</div>
				),
			},
			{
				id: 'health',
				header: 'Health (10 runs)',
				cell: ({ row }) => (
					<div className="flex items-center gap-[2px]">
						{row.original.successRate.map((isSuccess, idx) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: fixed mock data length
								key={idx}
								className={`w-1.5 h-4 rounded-sm ${isSuccess ? 'bg-emerald-500/80 shadow-[0_0_4px_rgba(16,185,129,0.2)]' : 'bg-red-500/80 shadow-[0_0_4px_rgba(239,68,68,0.3)]'}`}
							/>
						))}
					</div>
				),
			},
			{
				accessorKey: 'lastRun',
				header: 'Last Run',
				cell: ({ row }) => (
					<div className="flex items-center gap-2 text-[13px] text-white/60 whitespace-nowrap">
						{row.original.lastRun ? row.original.lastRun : <span className="text-white/20">—</span>}
					</div>
				),
			},
			{
				accessorKey: 'duration',
				header: 'Duration',
				cell: ({ row }) => (
					<div className="flex flex-col gap-0.5 justify-center whitespace-nowrap">
						<span className="text-[13px] font-mono text-white/80">
							{row.original.duration || '—'}
						</span>
						<span className="text-[11.5px] text-white/30">{row.original.steps} steps</span>
					</div>
				),
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
											className="shrink-0 size-8 rounded-full flex items-center justify-center text-white/30 hover:text-white hover:bg-white/[0.08] transition-colors border border-transparent hover:border-white/[0.05]"
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
												navigate(`/dashboard/workflows/${wf.id}`);
											}}
										>
											<HugeiconsIcon icon={EyeIcon} className="size-4" strokeWidth={2} />
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

		// Remove Namespace column if running in Auth mode (namespace is an internal concern)
		if (authEnabled) {
			return cols.filter((c: any) => c.accessorKey !== 'namespace');
		}

		return cols;
	}, [authEnabled, navigate]);

	// Derived metrics removed, using metrics from useWorkflows

	return (
		<div className="flex flex-col h-full bg-[#0a0a0a]">
			{/* Header */}
			<div className="flex items-center justify-between px-6 lg:px-8 py-6 border-b border-white/[0.05] bg-[#0c0c0c]">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-white">Workflows</h1>
					<p className="text-[13.5px] text-white/40 mt-1.5 flex items-center gap-2">
						<span className="inline-flex size-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
						Connected to Torq Engine {authEnabled ? `(Workspace)` : '(Default Namespace)'}
					</p>
				</div>
				<AnimatePresence>
					{isCollapsed && (
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, filter: 'blur(0px)', scale: [1.1, 1] }}
							exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.9 }}
							transition={{ duration: 0.2 }}
						>
							<Button className="gap-2 rounded-full px-5 text-[13px] font-bold h-9 shadow-[0_4px_20px_-4px_rgba(52,211,153,0.3)] bg-emerald-400 text-emerald-950 hover:bg-emerald-500 border-0">
								<HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2.5} />
								New Workflow
							</Button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

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
								className="w-full bg-[#121212] border border-white/[0.08] rounded-full h-10 pl-10 pr-4 text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
							/>
						</div>

						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button
										variant="outline"
										className="gap-2 h-10 rounded-full px-4 border-white/[0.08] bg-[#121212] hover:bg-white/[0.04]"
									/>
								}
							>
								<HugeiconsIcon icon={FilterIcon} className="size-4 text-white/50" />
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
										checked={statusFilter === 'running'}
										onCheckedChange={() => setStatusFilter('running')}
									>
										Running
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={statusFilter === 'failed'}
										onCheckedChange={() => setStatusFilter('failed')}
									>
										Failed
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={statusFilter === 'success'}
										onCheckedChange={() => setStatusFilter('success')}
									>
										Passed
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={statusFilter === 'idle'}
										onCheckedChange={() => setStatusFilter('idle')}
									>
										Idle
									</DropdownMenuCheckboxItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* ── Main Data Area ── */}
					<div className="flex-1 overflow-hidden">
						{error ? (
							<div className="border border-red-500/20 bg-red-500/[0.02] rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
								<div className="size-16 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
									<HugeiconsIcon icon={Alert02Icon} className="size-8 text-red-400" />
								</div>
								<h3 className="text-[18px] font-semibold text-white/90 mb-2">
									Failed to load workflows
								</h3>
								<p className="text-[14px] text-white/50 max-w-sm mb-8">{error.message}</p>
								<Button
									onClick={retry}
									variant="outline"
									className="gap-2 h-10 rounded-full px-6 border-white/[0.08] hover:bg-white/[0.04]"
								>
									<HugeiconsIcon icon={RefreshIcon} className="size-4" />
									Try Again
								</Button>
							</div>
						) : isLoading ? (
							<div className="w-full">
								<div className="flex items-center px-4 h-11 border-b border-transparent">
									<div className="w-24 h-3 bg-white/[0.03] rounded-sm animate-pulse" />
									<div className="w-32 h-3 bg-white/[0.03] rounded-sm animate-pulse ml-auto" />
								</div>
								<div className="flex flex-col">
									{[1, 2, 3, 4, 5].map((i) => (
										<div key={i} className="flex items-center gap-6 px-4 py-3.5">
											<div className="flex items-center gap-4 w-1/3">
												<div className="size-2.5 rounded-full bg-white/[0.03] animate-pulse" />
												<div className="flex flex-col gap-2 w-full">
													<div className="w-3/4 h-3.5 bg-white/[0.04] rounded animate-pulse" />
													<div className="w-1/2 h-2.5 bg-white/[0.02] rounded animate-pulse" />
												</div>
											</div>
											<div className="w-24 h-3 bg-white/[0.03] rounded animate-pulse" />
											<div className="w-16 h-3 bg-white/[0.03] rounded animate-pulse ml-auto" />
											<div className="size-8 rounded-full bg-white/[0.03] animate-pulse" />
										</div>
									))}
								</div>
							</div>
						) : metrics.total === 0 && !searchQuery && statusFilter === 'all' ? (
							<div className="border border-dashed border-white/10 bg-white/1 rounded-2xl p-16 flex flex-col items-center justify-center text-center mt-2">
								<div className="size-16 rounded-full bg-white/3 flex items-center justify-center mb-6 border border-white/5">
									<HugeiconsIcon icon={File02Icon} className="size-7 text-white/40" />
								</div>
								<h3 className="text-[18px] font-semibold text-white/90 mb-2">No workflows found</h3>
								<p className="text-[14px] text-white/40 max-w-sm mb-8">
									You don't have any workflows in this namespace yet. Create your first workflow to
									start automating.
								</p>
								<Button
									onClick={() => navigate('/dashboard/workflows/new')}
									className="gap-2 h-10 rounded-full px-6 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-[0_0_12px_rgba(16,185,129,0.4)]"
								>
									<HugeiconsIcon icon={PlusSignIcon} className="size-4" strokeWidth={2.5} />
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
							/>
						)}
					</div>
				</div>
			</div>

			{/* Delete confirmation */}
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
