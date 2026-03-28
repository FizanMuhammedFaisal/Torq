import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_RUNS, statusMap } from '../mock-data';

export function RunsTab({ workflowId }: { workflowId: string }) {
	const [selectedRunId, setSelectedRunId] = useState<string>(MOCK_RUNS[0].id);
	const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});

	// In a real app, you'd use workflowId to fetch runs
	console.log('Fetching runs for workflow:', workflowId);

	const selectedRun = MOCK_RUNS.find((r) => r.id === selectedRunId) || MOCK_RUNS[0];

	const toggleStep = (stepName: string) => {
		setExpandedSteps((prev) => ({
			...prev,
			[stepName]: !prev[stepName],
		}));
	};

	return (
		<div className="flex flex-col lg:flex-row gap-6 h-[max(75vh,600px)]">
			{/* Sidebar List */}
			<div className="w-full lg:w-[320px] flex flex-col gap-3 overflow-y-auto pr-3 pb-8 custom-scrollbar">
				{MOCK_RUNS.map((run) => {
					const rc = statusMap[run.status];
					const isSelected = run.id === selectedRunId;

					return (
						<button
							key={run.id}
							type="button"
							onClick={() => setSelectedRunId(run.id)}
							className={`text-left rounded-2xl p-4 transition-all border ${
								isSelected
									? 'bg-gradient-to-br from-white/[0.08] to-white/[0.02] border-white/[0.12] shadow-lg shadow-black/40 relative'
									: 'bg-white/[0.01] border-white/[0.03] hover:bg-white/[0.04] hover:border-white/[0.08]'
							}`}
						>
							{isSelected && (
								<div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-md" />
							)}
							<div className="flex items-start justify-between mb-3">
								<div className="flex items-center gap-2">
									<span
										className={`size-[6px] rounded-full ${run.status === 'running' ? 'animate-pulse' : ''}`}
										style={{ background: rc.color }}
									/>
									<span className={`text-[14px] font-semibold ${isSelected ? 'text-white' : 'text-white/80'}`}>{run.trigger}</span>
								</div>
								<span className="text-[11px] text-white/30 font-mono">{run.duration}</span>
							</div>
							<div className="flex items-center justify-between text-[12px]">
								<span className="text-white/40">#<span className="font-mono">{run.id.replace('run-', '')}</span></span>
								<span className="text-white/30">{run.date}</span>
							</div>
						</button>
					);
				})}
			</div>

			{/* Main Pane (Terminal/Logs) */}
			<div className="flex-1 flex flex-col rounded-[24px] border border-white/[0.08] bg-[#0c0c0c] overflow-hidden mb-6 shadow-2xl relative" style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.06)' }}>
				{/* Top Glow */}
				<div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
				
				{/* Terminal Header */}
				<div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] bg-black/40 backdrop-blur-md relative z-10">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center size-8 rounded-lg bg-white/5 border border-white/10 text-white/60">
							<svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<title>Terminal Icon</title>
								<polyline points="4 17 10 11 4 5" />
								<line x1="12" y1="19" x2="20" y2="19" />
							</svg>
						</div>
						<div>
							<h3 className="text-[14px] font-semibold text-white/90 font-mono">
								job_{selectedRun.id}
							</h3>
						</div>
					</div>
					<div className="flex items-center gap-2 text-[12px] font-semibold px-3 py-1 rounded-md bg-white/5 border border-white/10">
						<span style={{ color: statusMap[selectedRun.status].color }}>{statusMap[selectedRun.status].label}</span>
					</div>
				</div>

				{/* Logs container */}
				<div className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed relative z-10 bg-[#080808]">
					{selectedRun.steps.map((step) => {
						const isExpanded = expandedSteps[step.name];
						const isSuccess = step.status === 'success';
						const isFailed = step.status === 'failed';
						const isIdle = step.status === 'idle';
						
						return (
							<div key={step.name} className="mb-2 rounded-lg border border-white/[0.04] bg-[#0c0c0c] overflow-hidden">
								{/* Accordion Trigger */}
								<button 
									type="button"
									onClick={() => toggleStep(step.name)}
									className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors text-left"
								>
									{/* Expand icon */}
									<div className={`transition-transform duration-200 text-white/40 ${isExpanded ? 'rotate-90' : ''}`}>
										<svg className="size-3.5" viewBox="0 0 16 16" fill="currentColor">
											<title>Toggle step logs</title>
											<path d="M5.5 3L10.5 8L5.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
										</svg>
									</div>
									
									{/* Status Icon */}
									{isSuccess && <div className="text-emerald-500"><svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><title>Success</title><path d="M5 13l4 4L19 7"/></svg></div>}
									{isFailed && <div className="text-red-500"><svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><title>Failed</title><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></div>}
									{isIdle && <div className="size-4 rounded-full border-2 border-white/20" />}
									
									<span className={`font-semibold ${isFailed ? 'text-red-400' : 'text-white/80'}`}>{step.name}</span>
									<span className="text-white/30 text-[11px] ml-auto">{step.duration !== '—' ? step.duration : ''}</span>
								</button>
								
								{/* Accordion Content */}
								<AnimatePresence>
									{isExpanded && (
										<motion.div 
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: 'auto', opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											className="border-t border-white/[0.04] bg-[#080808]"
										>
											<div className="p-4 space-y-1 overflow-x-auto text-white/60">
												{isSuccess ? (
													<>
														<div className="flex"><span className="w-12 text-white/20 select-none">1</span><span>[info] Running pre-flight checks...</span></div>
														<div className="flex"><span className="w-12 text-white/20 select-none">2</span><span>[info] Restoring cache for {step.name}...</span></div>
														<div className="flex"><span className="w-12 text-white/20 select-none">3</span><span>[info] Executing script.</span></div>
														<div className="flex"><span className="w-12 text-white/20 select-none">4</span><span className="text-emerald-400/80">[ok] Completed successfully in {step.duration}</span></div>
													</>
												) : isFailed ? (
													<>
														<div className="flex"><span className="w-12 text-white/20 select-none">1</span><span>[info] Running pre-flight checks...</span></div>
														<div className="flex"><span className="w-12 text-white/20 select-none">2</span><span>[info] Executing script.</span></div>
														<div className="flex"><span className="w-12 text-white/20 select-none">3</span><span className="text-red-400/80">[error] Process exited with status 1</span></div>
														<div className="flex"><span className="w-12 text-white/20 select-none">4</span><span className="text-red-400/80">[error] FATAL: Module not found.</span></div>
													</>
												) : (
													<div className="flex"><span className="w-12 text-white/20 select-none">1</span><span className="text-white/20 italic">Waiting for runner...</span></div>
												)}
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
