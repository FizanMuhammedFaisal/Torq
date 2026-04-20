import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from '@tanstack/react-table';
import { AnimatePresence, motion } from 'motion/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	searchKey?: string;
	searchQuery?: string;
	noResultsMessage?: string;
	noResultsSubtext?: string;
	onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	searchKey,
	searchQuery,
	noResultsSubtext = 'Try adjusting your filters.',
	onRowClick,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			globalFilter: searchQuery,
		},
		onGlobalFilterChange: () => {},
	});

	// Apply external search query if provided
	React.useEffect(() => {
		if (searchKey && searchQuery !== undefined) {
			table.getColumn(searchKey)?.setFilterValue(searchQuery);
		}
	}, [searchQuery, searchKey, table]);

	// Initialize pagination size to fit screen nicely
	React.useEffect(() => {
		table.setPageSize(20);
	}, [table]);

	return (
		<div className="w-full h-full flex flex-col min-h-0">
			<AnimatePresence mode="popLayout">
				{table.getRowModel().rows?.length === 0 ? (
					<motion.div
						key="empty"
						initial={{ opacity: 0, scale: 0.98 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.2 }}
						className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-white/6 rounded-2xl bg-white/1 border-dashed"
					>
						<p className="text-[13px] text-white/30">{noResultsSubtext}</p>
					</motion.div>
				) : (
					<motion.div
						key="table"
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						className="relative flex flex-col flex-1 w-full min-h-0"
					>
						<div className="relative flex-1 flex flex-col min-h-0 min-w-0">
							{/* Top edge fade (just below header) */}
							<div className="pointer-events-none absolute left-0 right-0 top-0 h-8 bg-gradient-to-b from-[#0a0a0a] to-transparent z-10" />
							{/* Bottom edge fade (just above pagination) */}
							<div className="pointer-events-none absolute left-0 right-0 bottom-0 h-10 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10" />

							<div className="flex-1 overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
								<Table className="relative min-w-full">
									<TableHeader className="bg-zinc-950 sticky top-0 z-20">
										{table.getHeaderGroups().map((headerGroup) => (
											<TableRow
												key={headerGroup.id}
												className="border-none hover:bg-transparent"
											>
												{headerGroup.headers.map((header) => {
													return (
														<TableHead
															key={header.id}
															className="text-[10px] h-11 font-bold text-white/40 uppercase tracking-widest px-4"
														>
															{header.isPlaceholder
																? null
																: flexRender(
																		header.column.columnDef.header,
																		header.getContext(),
																	)}
														</TableHead>
													);
												})}
											</TableRow>
										))}
									</TableHeader>
									<TableBody>
										{table.getRowModel().rows.map((row) => (
											<TableRow
												key={row.id}
												data-state={row.getIsSelected() && 'selected'}
												onClick={() => onRowClick?.(row.original)}
												className="border-none hover:bg-white/3 transition-colors cursor-pointer rounded-xl group"
											>
												{row.getVisibleCells().map((cell) => (
													<TableCell
														key={cell.id}
														className="px-4 py-3.5 align-middle group-first:rounded-t-xl group-last:rounded-b-xl"
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext(),
														)}
													</TableCell>
												))}
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>

						{/* Bottom Pagination Bar */}
						{table.getPageCount() > 1 && (
							<div className="flex-none py-2 border-t border-white/5  flex justify-center z-20">
								<div className="flex items-center gap-1 p-1 bg-zinc-950 shadow-sm border border-white/5 rounded-full">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => table.previousPage()}
										disabled={!table.getCanPreviousPage()}
										className="size-8 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
									>
										<HugeiconsIcon icon={ArrowLeft02Icon} className="size-4" />
									</Button>

									<div className="flex items-center gap-3 text-[12px] text-white/60 font-medium px-4 tracking-wide select-none">
										<span>
											Page {table.getState().pagination.pageIndex + 1} of{' '}
											{table.getPageCount()}
										</span>
										<span className="size-1 rounded-full bg-white/10" />
										<span>
											Total: {table.getFilteredRowModel().rows.length}
										</span>
									</div>

									<Button
										variant="ghost"
										size="icon"
										onClick={() => table.nextPage()}
										disabled={!table.getCanNextPage()}
										className="size-8 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
									>
										<HugeiconsIcon icon={ArrowRight02Icon} className="size-4" />
									</Button>
								</div>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
