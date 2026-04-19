import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { statusConfig as statusMap } from '@/features/workflows/config';
import { useRuns } from '@/features/runs/hooks/use-runs';

interface Step {
	name: string;
	status: 'SUCCESS' | 'FAILED' | 'IDLE' | 'RUNNING' | 'PENDING';
	duration: string;
}

export function RunsTab({ workflowId }: { workflowId: string }) {
	const { runs } = useRuns();
	const [selectedRunId, setSelectedRunId] = useState<string>('');
	const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

	// In a real app, this would filter by the workflowId
	// But according to current mock/API it's overall list
	const workflowRuns = workflowId ? runs.filter(r => r.workflowId === workflowId) : runs;
	const selectedRun = workflowRuns.length > 0
		? (workflowRuns.find((r) => r.id === selectedRunId) || workflowRuns[0])
		: null;

	const toggleStep = (stepName: string) => {
		setExpandedSteps((prev) => ({
			...prev,
			[stepName]: !prev[stepName],
		}));
	};

	if (workflowRuns.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-[500px] border border-dashed border-white/10 rounded-[32px] bg-white/2 text-center p-12">
				<div className="size-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
					<svg className="size-8 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
						<title>No runs</title>
						<path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
				</div>
				<h3 className="text-[20px] font-semibold text-white/90 mb-2">No runs yet</h3>
				<p className="text-[14px] text-white/40 max-w-sm">
					This workflow has not been executed yet. Trigger its first job to see logs and metrics here.
				</p>
			</div>
		);
	}

	const selectedRunStatus = selectedRun?.status ?? 'IDLE';
	const rcStatus = statusMap[selectedRunStatus] || statusMap.IDLE;

	return (
		<div className="flex flex-col lg:flex-row gap-6 h-[max(75vh,600px)]">
			{/* Left Sidebar - Run List */}
			<div className="w-full lg:w-[320px] flex flex-col gap-3 overflow-y-auto pr-3 pb-8 custom-scrollbar">
				{workflowRuns.map((run) => {
					const rc = statusMap[run.status] || statusMap.IDLE;
					const isSelected = selectedRun && run.id === selectedRun.id;

					return (
						<button
							key={run.id}
							type="button"
							onClick={() => setSelectedRunId(run.id)}
							className={`group text-left rounded-2xl p-4 transition-all border ${isSelected
								? 'bg-linear-to-br from-white/8 to-white/2 border-white/12 shadow-lg shadow-black/40 relative'
								: 'bg-white/1 border-white/3 hover:bg-white/4 hover:border-white/8'
								}`}
						>
							{isSelected && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r-md shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
							)}
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-2">
									<span
										className={`size-[6px] rounded-full ${run.status === 'RUNNING' ? 'animate-pulse' : ''}`}
										style={{ background: rc.color }}
									/>
									<span className={`text-[14.5px] font-semibold ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
										{run.trigger === 'MANUAL' ? 'Manual Trigger' : run.trigger}
									</span>
								</div>
								<span className="text-[11.5px] text-white/30 font-mono tracking-tight">{run.duration}</span>
							</div>
							<div className="flex items-center justify-between text-[12.5px]">
								<span className="text-white/40">#<span className="font-mono">{run.id.slice(-8).toUpperCase()}</span></span>
								<span className="text-white/30">{run.date}</span>
							</div>
						</button>
					);
				})}
			</div>

			{/* Main Pane (Terminal/Logs) */}
			<div className="flex-1 flex flex-col rounded-[32px] border border-white/8 bg-neutral-950 overflow-hidden mb-6 shadow-2xl relative" style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.06)' }}>
				{/* Top Glow Overlay */}
				<div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/3 to-transparent pointer-events-none" />

				{/* Terminal Header */}
				<div className="flex items-center justify-between px-7 py-5 border-b border-white/6 bg-black/40 backdrop-blur-xl relative z-10">
					<div className="flex items-center gap-4">
						<div className="flex items-center justify-center size-9 rounded-xl bg-white/5 border border-white/10 text-white/60 shadow-inner">
							<svg className="size-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
								<title>Terminal Icon</title>
								<polyline points="4 17 10 11 4 5" />
								<line x1="12" y1="19" x2="20" y2="19" />
							</svg>
						</div>
						<div>
							<h3 className="text-[14px] font-bold text-white/90 font-mono tracking-wide">
								job_{selectedRun?.id.slice(-8).toLowerCase()}
							</h3>
						</div>
					</div>
					<div
						className="flex items-center gap-2.5 text-[11.5px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border backdrop-blur-md"
						style={{
							color: rcStatus.color,
							backgroundColor: `${rcStatus.color}15`,
							borderColor: `${rcStatus.color}30`,
						}}
					>
						{rcStatus.label}
					</div>
				</div>

				{/* Logs container */}
				<div className="flex-1 overflow-y-auto p-6 font-mono text-[13px] leading-[1.6] relative z-10 bg-black/95 custom-scrollbar">
					{!selectedRun ? (
						<div className="flex flex-col items-center justify-center h-full opacity-30 italic">
							Waiting for execution data...
						</div>
					) : (
						// Temporary mock steps as backend doesn't provide them yet
						([
							{ name: 'initialize', status: 'SUCCESS', duration: '124ms' },
							{ 
								name: 'execute-dsl', 
								status: selectedRun.status === 'FAILED' ? 'FAILED' : (selectedRun.status === 'RUNNING' ? 'RUNNING' : 'SUCCESS'), 
								duration: selectedRun.status === 'RUNNING' ? '—' : '2.4s' 
							},
							{ name: 'finalize', status: 'IDLE', duration: '—' }
						] as Step[]).map((step) => {
							const isExpanded = expandedSteps[step.name];
							const isSuccess = step.status === 'SUCCESS';
							const isFailed = step.status === 'FAILED';
							const isRunning = step.status === 'RUNNING';

							return (
								<div key={step.name} className="mb-3 rounded-2xl border border-white/5 bg-neutral-900/50 overflow-hidden">
									{/* Accordion Trigger */}
									<button
										type="button"
										onClick={() => toggleStep(step.name)}
										className="w-full flex items-center gap-3.5 px-5 py-3.5 hover:bg-white/3 transition-colors text-left"
									>
										{/* Expand icon */}
										<div className={`transition-transform duration-300 text-white/30 ${isExpanded ? 'rotate-90' : ''}`}>
											<svg className="size-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
												<title>Toggle</title>
												<path d="M6 12L10 8L6 4" />
											</svg>
										</div>

										{/* Status Icon */}
										{isSuccess && <div className="text-emerald-400"><svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><title>Success</title><path d="M5 13l4 4L19 7" /></svg></div>}
										{isFailed && <div className="text-red-400"><svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><title>Failed</title><path d="M18 6L6 18M6 6l12 12" /></svg></div>}
										{isRunning && <span className="size-2 rounded-full bg-blue-400 animate-ping" />}
										{!isSuccess && !isFailed && !isRunning && <div className="size-4 rounded-full border-2 border-white/15" />}

										<span className={`font-bold tracking-tight ${isFailed ? 'text-red-400' : (isRunning ? 'text-blue-400' : 'text-white/80')}`}>{step.name}</span>
										<span className="text-white/20 text-[11px] ml-auto font-mono">{step.duration}</span>
									</button>

									{/* Accordion Content */}
									<AnimatePresence>
										{isExpanded && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: 'auto', opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.3, ease: 'circOut' }}
												className="border-t border-white/5 bg-black/60"
											>
												<div className="p-5 space-y-1.5 overflow-x-auto text-[12.5px] text-white/50 font-mono">
													<div className="flex gap-4">
														<span className="w-10 text-right opacity-30 select-none">1</span>
														<span>[09:42:11] torq: initializing runner environment...</span>
													</div>
													<div className="flex gap-4">
														<span className="w-10 text-right opacity-30 select-none">2</span>
														<span>[09:42:11] torq: fetching spec for {selectedRun.workflowName}...</span>
													</div>
													{isRunning ? (
														<div className="flex gap-4">
															<span className="w-10 text-right opacity-30 select-none">3</span>
															<span className="text-blue-400/80 italic">Worker executing logic...</span>
														</div>
													) : isSuccess ? (
														<>
															<div className="flex gap-4">
																<span className="w-10 text-right opacity-30 select-none">3</span>
																<span>[09:42:12] torq: successfully applied DSL transform</span>
															</div>
															<div className="flex gap-4">
																<span className="w-10 text-right opacity-30 select-none">4</span>
																<span className="text-emerald-400/80">Done. Process exited with code 0.</span>
															</div>
														</>
													) : isFailed ? (
														<>
															<div className="flex gap-4 text-red-400/60">
																<span className="w-10 text-right opacity-30 select-none">3</span>
																<span>[critical] FATAL_ERROR: Connection timeout to downstream service</span>
															</div>
															<div className="flex gap-4">
																<span className="w-10 text-right opacity-30 select-none">4</span>
																<span className="text-red-400/80">Failed. Cleanup started.</span>
															</div>
														</>
													) : (
														<div className="flex gap-4 opacity-20 italic">
															<span className="w-10 text-right select-none">3</span>
															<span>Pending...</span>
														</div>
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							);
						})
					)}
				</div>
			</div>
		</div>
	);
}

