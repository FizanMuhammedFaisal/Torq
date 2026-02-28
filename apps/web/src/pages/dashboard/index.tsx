import {
	Alert02Icon,
	ArrowRight01Icon,
	CheckListIcon,
	File02Icon,
	Loading03Icon,
	PlusSignIcon,
	RefreshIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { useWorkflows } from '@/features/workflows/api/use-workflows';
import { statusConfig } from '@/features/workflows/config';

export function DashboardPage() {
	const navigate = useNavigate();
	const context = useOutletContext<{ isCollapsed?: boolean }>();
	const isCollapsed = context?.isCollapsed ?? true;

	const { workflows, metrics, isLoading, error, retry } = useWorkflows();

	// Mocking Auth State
	const isAuthEnabledAndLoggedIn = true;
	const mockUserName = 'Fizan Muhammed Faisal';

	// Grab a few recent workflows for the abbreviated list (just picking the top 5 from mock)
	const recentWorkflows = workflows.slice(0, 5);

	return (
		<div className="flex flex-col h-full bg-[#0a0a0a]">
			{/* Header */}
			<div className="flex items-center justify-between px-6 lg:px-8 py-8 border-b border-white/[0.05] bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/[0.03] via-[#0c0c0c] to-[#0c0c0c]">
				<div>
					<h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
						Command Center
					</h1>
					<p className="text-[14px] text-white/40 mt-2 flex items-center gap-2 font-medium">
						<span className="relative flex size-2.5 items-center justify-center">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
							<span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
						</span>
						Torq Engine via {isAuthEnabledAndLoggedIn ? mockUserName : 'Default Namespace'}
					</p>
				</div>
				<AnimatePresence>
					{isCollapsed && (
						<motion.div
							initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
							animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
							exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
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

			<div className="flex-1 overflow-y-auto w-full p-6 lg:p-8">
				<div className="w-full max-w-7xl mx-auto space-y-8">
					{/* ── Large Metric Cards ── */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.02] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
							<div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
							<div>
								<h3 className="text-[13px] font-medium text-emerald-400/80 uppercase tracking-widest mb-1">
									Total Workflows
								</h3>
							</div>
							<p className="text-[42px] font-mono font-medium text-white tracking-tight relative z-10 leading-none mt-2">
								{isLoading ? (
									<span className="text-white/20 animate-pulse">--</span>
								) : (
									metrics.total.toLocaleString()
								)}
							</p>
						</div>

						<div className="rounded-xl border border-blue-500/30 bg-blue-500/[0.03] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
							<div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/15 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
							<div>
								<h3 className="text-[13px] font-medium text-blue-400/90 uppercase tracking-widest mb-1">
									Running
								</h3>
							</div>
							<p className="text-[42px] font-mono font-medium text-white tracking-tight relative z-10 leading-none mt-2">
								{isLoading ? (
									<span className="text-white/20 animate-pulse">--</span>
								) : (
									metrics.running
								)}
							</p>
						</div>

						<div className="rounded-xl border border-red-500/30 bg-red-500/[0.03] p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
							<div className="absolute top-0 right-0 w-40 h-40 bg-red-500/15 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
							<div>
								<h3 className="text-[13px] font-medium text-red-400/90 uppercase tracking-widest mb-1">
									Recent Failures
								</h3>
							</div>
							<p className="text-[42px] font-mono font-medium text-white tracking-tight relative z-10 leading-none mt-2">
								{isLoading ? (
									<span className="text-white/20 animate-pulse">--</span>
								) : (
									metrics.failed
								)}
							</p>
						</div>
					</div>

					{/* ── Recent Activity List ── */}
					<div className="pt-6">
						<div className="flex items-center justify-between mb-5">
							<div className="flex items-center gap-2">
								<div className="size-6 rounded-md bg-white/[0.03] border border-white/[0.05] flex items-center justify-center">
									<HugeiconsIcon icon={CheckListIcon} className="size-3.5 text-white/60" />
								</div>
								<h2 className="text-[16px] font-semibold text-white/90 tracking-tight">
									Recent Executions
								</h2>
							</div>
							<Button
								variant="outline"
								className="gap-2 h-9 rounded-full px-4 border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.06] text-[13px] font-medium transition-all hover:pr-3"
								onClick={() => navigate('/dashboard/workflows')}
							>
								View All
								<HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5 opacity-70" />
							</Button>
						</div>

						{error ? (
							<div className="border border-red-500/20 bg-red-500/[0.02] rounded-2xl p-8 flex flex-col items-center justify-center text-center mt-2 shadow-sm">
								<div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
									<HugeiconsIcon icon={Alert02Icon} className="size-6 text-red-400" />
								</div>
								<h3 className="text-[16px] font-semibold text-white/90 mb-1">
									Failed to load executions
								</h3>
								<p className="text-[14px] text-white/50 max-w-sm mb-6">{error.message}</p>
								<Button
									onClick={retry}
									variant="outline"
									className="gap-2 h-9 rounded-full px-5 border-white/[0.08] hover:bg-white/[0.04]"
								>
									<HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
									Try Again
								</Button>
							</div>
						) : isLoading ? (
							<div className="border border-white/[0.06] rounded-2xl overflow-hidden bg-[#101010]/80 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]">
								<div className="flex flex-col divide-y divide-white/[0.04]">
									{[1, 2, 3].map((i) => (
										<div
											key={i}
											className="flex flex-col sm:flex-row sm:items-center gap-6 px-8 py-6"
										>
											<div className="w-[120px] h-6 bg-white/[0.03] rounded-full animate-pulse" />
											<div className="flex-1 flex flex-col gap-2">
												<div className="w-48 h-4 bg-white/[0.04] rounded animate-pulse" />
												<div className="w-64 h-3 bg-white/[0.02] rounded animate-pulse" />
											</div>
											<div className="w-24 h-4 bg-white/[0.03] rounded animate-pulse" />
										</div>
									))}
								</div>
							</div>
						) : recentWorkflows.length === 0 ? (
							<div className="border border-dashed border-white/[0.1] bg-white/[0.01] rounded-2xl p-12 flex flex-col items-center justify-center text-center mt-2">
								<div className="size-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-4 border border-white/[0.05]">
									<HugeiconsIcon icon={File02Icon} className="size-5 text-white/40" />
								</div>
								<h3 className="text-[16px] font-semibold text-white/90 mb-1.5">
									No recent executions
								</h3>
								<p className="text-[14px] text-white/40 max-w-sm mb-6">
									You don't have any workflow runs in this namespace yet. Create and run a workflow
									to see activity here.
								</p>
								<Button
									onClick={() => navigate('/dashboard/workflows/new')}
									className="gap-2 h-9 rounded-full px-5 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-[0_0_12px_rgba(16,185,129,0.4)]"
								>
									Create Workflow
								</Button>
							</div>
						) : (
							<div className="border border-white/[0.06] rounded-2xl overflow-hidden bg-[#101010]/80 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)]">
								<div className="flex flex-col divide-y divide-white/[0.04]">
									{recentWorkflows.map((wf) => {
										const cfg = statusConfig[wf.status];
										return (
											<div
												key={wf.id}
												onClick={() => navigate(`/dashboard/workflows/${wf.id}`)}
												className="group flex flex-col sm:flex-row sm:items-center gap-6 px-8 py-6 hover:bg-white/[0.03] transition-colors cursor-pointer relative overflow-hidden"
											>
												{/* Subtle hover gradient */}
												<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02),transparent)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

												{/* Status badge */}
												<div className="shrink-0 w-[120px] flex items-center relative z-10">
													<div
														className="flex items-center gap-2 rounded-full px-2.5 py-1 text-[11.5px] font-bold tracking-wide uppercase border backdrop-blur-md"
														style={{
															color: cfg.color,
															backgroundColor: `${cfg.color}15`,
															borderColor: `${cfg.color}30`,
														}}
													>
														<div className="relative flex items-center justify-center size-1.5 shrink-0">
															{wf.status === 'running' && (
																<span
																	className="absolute size-full rounded-full animate-ping opacity-60"
																	style={{ backgroundColor: cfg.color }}
																/>
															)}
															<span
																className="relative size-full rounded-full"
																style={{ backgroundColor: cfg.color }}
															/>
														</div>
														{cfg.label}
													</div>
												</div>

												{/* Workflow Name & Description */}
												<div className="flex-1 min-w-0 relative z-10 flex flex-col gap-1.5">
													<span className="text-[15.5px] font-semibold text-white/95 truncate group-hover:text-white transition-colors">
														{wf.name}
													</span>
													<span className="text-[13.5px] text-white/40 truncate pr-4">
														{wf.description}
													</span>
												</div>

												{/* Time & Duration */}
												<div className="shrink-0 flex items-center justify-end min-w-[120px] gap-3 relative z-10 mt-2 sm:mt-0">
													<span className="text-[13px] font-medium text-white/70">
														{wf.lastRun || '—'}
													</span>
													<span className="text-[12px] font-mono text-white/30 bg-white/[0.03] px-1.5 py-0.5 rounded-md">
														{wf.duration || '0s'}
													</span>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
