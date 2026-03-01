import {
	Alert02Icon,
	EyeIcon,
	File02Icon,
	FilterIcon,
	MoreHorizontalCircle01Icon,
	RefreshIcon,
	Search01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import { type Run, useRuns } from '@/features/workflows/api/use-runs';
import { statusConfig } from '@/features/workflows/config';
import { useAppConfig } from '@/lib/app-config';
import { AnimatedCounter } from '@/components/ui/animated-counter';

/* ── Page ─── */

export function RunsPage() {
	const navigate = useNavigate();

	const {
		runs: filteredRuns,
		metrics,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		isLoading,
		error,
		retry,
	} = useRuns();

	const { authEnabled } = useAppConfig();

	// ── Columns ──
	const columns = useMemo<ColumnDef<Run>[]>(() => {
		const cols: ColumnDef<Run>[] = [
			{
				id: 'workflowName',
				accessorFn: (row) => row.workflowName, // Used for global filter
				header: 'Run',
				cell: ({ row }) => {
					const run = row.original;
					const cfg = statusConfig[run.status];
					return (
						<div className="flex items-center gap-4 min-w-0 pr-4">
							<div className="relative flex items-center justify-center size-2.5 shrink-0 mt-0.5">
								{run.status === 'running' && (
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
										{run.workflowName}
									</span>
									<span
										className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm whitespace-nowrap"
										style={{ color: cfg.color, backgroundColor: cfg.bg }}
									>
										{cfg.label.toUpperCase()}
									</span>
								</div>
								<span className="text-[13px] text-white/40 truncate pr-4">
									<span className="text-white/20">Trigger:</span> {run.trigger}
								</span>
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
				accessorKey: 'date',
				header: 'Date',
				cell: ({ row }) => (
					<div className="flex items-center gap-2 text-[13px] text-white/60 whitespace-nowrap">
						{row.original.date ? row.original.date : <span className="text-white/20">—</span>}
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
					const run = row.original;
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
												// Typically this would go to a specific run ID view
												// /dashboard/workflows/:workflowId/runs/:runId
												// But for this mockup demo we'll go to the WF page
												navigate(`/dashboard/workflows/${run.workflowId}`);
											}}
										>
											<HugeiconsIcon icon={EyeIcon} className="size-4" strokeWidth={2} />
											View Run Logs
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		];

		if (!authEnabled) {
			return cols.filter((c: any) => c.accessorKey !== 'namespace');
		}

		return cols;
	}, [authEnabled, navigate]);

	return (
		<div className="flex flex-col h-full bg-[#0a0a0a]">
			{/* Header with Metric Glance */}
			<div className="flex flex-col gap-6 px-6 lg:px-8 py-6 border-b border-white/[0.05] bg-[#0c0c0c]">
				<div>
					<div className="flex items-center gap-3 mb-2">
						<h1 className="text-2xl font-bold tracking-tight text-white">Live Feed</h1>
						<div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.05] px-2.5 py-1 backdrop-blur-md">
							<span className="relative flex size-1.5 items-center justify-center">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60"></span>
								<span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
							</span>
							<span className="text-[10px] font-bold text-emerald-400 tracking-wide uppercase">
								Connected
							</span>
						</div>
					</div>
					<p className="text-[13.5px] text-white/40 flex items-center gap-2 max-w-2xl">
						This view represents every chronological execution hitting the engine across all
						workflows globally.
					</p>
				</div>

				{/* Run Metrics */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
					<div className="flex-none w-44 flex flex-col p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.02)]">
						<span className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2">
							All Time
						</span>
						<span className="text-2xl font-mono text-white/90 font-medium h-[32px] flex items-center">
							{isLoading ? (
								<span className="animate-pulse opacity-20">---</span>
							) : (
								<AnimatedCounter value={metrics.total} />
							)}
						</span>
					</div>

					<div className="flex-none w-40 flex flex-col p-4 rounded-xl bg-blue-500/[0.03] border border-blue-500/10 shadow-[inset_0_1px_0_0_rgba(59,130,246,0.02)] relative overflow-hidden">
						{/* Subtle blue gradient flair */}
						<div className="absolute -top-10 -right-10 size-24 bg-blue-500/10 blur-[30px] rounded-full pointer-events-none" />
						<span className="text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5 z-10">
							Active Jobs
							{metrics.active > 0 && (
								<span className="relative flex size-1.5 ml-1">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full size-1.5 bg-blue-500"></span>
								</span>
							)}
						</span>
						<span className="text-2xl font-mono text-blue-400 font-medium z-10 h-[32px] flex items-center">
							{isLoading ? (
								<span className="animate-pulse opacity-20">---</span>
							) : (
								<AnimatedCounter value={metrics.active} />
							)}
						</span>
					</div>

					<div className="flex-none w-48 flex flex-col p-4 rounded-xl bg-red-500/[0.02] border border-red-500/[0.05] shadow-[inset_0_1px_0_0_rgba(239,68,68,0.01)] relative overflow-hidden">
						{/* Subtle red gradient flair */}
						<div className="absolute -top-10 -right-10 size-24 bg-red-500/5 blur-[30px] rounded-full pointer-events-none" />
						<span className="text-[11px] font-bold uppercase tracking-widest text-white/30 mb-2 z-10">
							Recent Failures
						</span>
						<span className="text-2xl font-mono text-white/90 font-medium flex items-center gap-2 z-10 h-[32px]">
							{isLoading ? (
								<span className="animate-pulse opacity-20">---</span>
							) : (
								<>
									<AnimatedCounter className="h-full" value={metrics.failed24h} />
									<span className="text-red-400 text-[13px] tracking-normal font-sans py-1 mt-1">
										in 24hrs
									</span>
								</>
							)}
						</span>
					</div>
				</div>
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
								placeholder="Search runs by workflow name..."
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
										checked={statusFilter === 'queued'}
										onCheckedChange={() => setStatusFilter('queued')}
									>
										Queued
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
									Failed to fetch run logs
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
									{[1, 2, 3, 4, 5, 6].map((i) => (
										<div key={i} className="flex items-center gap-6 px-4 py-3.5">
											<div className="flex items-center gap-4 w-1/3">
												<div className="size-2.5 rounded-full bg-white/[0.03] animate-pulse" />
												<div className="flex flex-col gap-2 w-full">
													<div className="w-3/4 h-3.5 bg-white/[0.04] rounded animate-pulse" />
													<div className="w-1/2 h-2.5 bg-white/[0.02] rounded animate-pulse" />
												</div>
											</div>
											<div className="w-16 h-3 bg-white/[0.03] rounded animate-pulse" />
											<div className="w-20 h-3 bg-white/[0.03] rounded animate-pulse ml-auto" />
											<div className="size-8 rounded-full bg-white/[0.03] animate-pulse" />
										</div>
									))}
								</div>
							</div>
						) : filteredRuns.length === 0 && !searchQuery && statusFilter === 'all' ? (
							<div className="border border-dashed border-white/10 bg-white/1 rounded-2xl p-16 flex flex-col items-center justify-center text-center mt-2">
								<div className="size-16 rounded-full bg-white/3 flex items-center justify-center mb-6 border border-white/5">
									<HugeiconsIcon icon={File02Icon} className="size-7 text-white/40" />
								</div>
								<h3 className="text-[18px] font-semibold text-white/90 mb-2">
									No executions found
								</h3>
								<p className="text-[14px] text-white/40 max-w-sm">
									There is no history inside the Torq Engine for this namespace.
								</p>
							</div>
						) : (
							<DataTable
								columns={columns}
								data={filteredRuns}
								searchKey="workflowName"
								searchQuery={searchQuery}
								onRowClick={(run) => navigate(`/dashboard/workflows/${run.workflowId}`)}
								noResultsMessage="No runs found"
								noResultsSubtext={
									searchQuery || statusFilter !== 'all'
										? "We couldn't find any executions matching those filters."
										: "This execution environment hasn't received any jobs yet."
								}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
