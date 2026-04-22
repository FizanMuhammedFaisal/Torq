import {
	DashboardSquare01Icon,
	ArrowLeft02Icon,
	File02Icon,
	Settings01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useRuns } from '@/features/runs/hooks/use-runs';

export function RunSidebar({ workflowId, runId }: { workflowId: string; runId: string }) {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useSearchParams();
	const { runs } = useRuns();
	const run = runs.find(r => r.id === runId);

	const steps = run?.stepsMap ? Object.keys(run.stepsMap) : [];
	const currentJob = searchParams.get('job');

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.15 }}
			className="flex flex-col h-full"
		>
			<div className="px-4 mb-4 shrink-0">
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start gap-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl group transition-all"
					onClick={() => navigate(`/dashboard/workflows/${workflowId}/runs`)}
				>
					<HugeiconsIcon
						icon={ArrowLeft02Icon}
						className="size-4 group-hover:-translate-x-0.5 transition-transform"
					/>
					Back to Runs
				</Button>
			</div>

			<div className="px-4 mb-2 shrink-0">
				<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-3">
					Run details
				</span>
			</div>

			<nav className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
				<button
					type="button"
					className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all relative group shrink-0 ${
						!currentJob ? 'text-primary bg-primary/10 ring-1 ring-inset ring-primary/20' : 'text-white/40 hover:text-white hover:bg-white/4'
					}`}
					onClick={() => {
						const next = new URLSearchParams(searchParams);
						next.delete('job');
						setSearchParams(next);
					}}
				>
					<HugeiconsIcon icon={DashboardSquare01Icon} className={`size-[18px] relative z-10 transition-transform duration-300 ${!currentJob ? 'scale-110' : 'group-hover:scale-105'}`} strokeWidth={2} />
					<span className="relative z-10">Summary</span>
				</button>

				<Separator className="opacity-10 my-3 mx-3 shrink-0" />

				<div className="px-3 mb-2 shrink-0">
					<span className="text-[10px] font-bold uppercase tracking-widest text-white/20">
						All jobs
					</span>
				</div>

				<div className="flex flex-col gap-0.5 min-w-0">
					{steps.map((step) => {
						const status = run?.stepsMap?.[step]?.status;
						const isActive = currentJob === step;
						return (
							<button
								key={step}
								type="button"
								className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all relative group shrink-0 min-w-0 ${
									isActive ? 'text-white bg-white/10 ring-1 ring-inset ring-white/5' : 'text-white/80 hover:bg-white/4'
								}`}
								onClick={() => setSearchParams({ job: step })}
							>
								<div className="flex items-center justify-center size-4 relative z-10">
									{status === 'SUCCESS' ? (
										<div className="text-emerald-500"><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><title>Success</title><path d="M5 13l4 4L19 7" /></svg></div>
									) : status === 'FAILED' ? (
										<div className="text-red-500"><svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><title>Failed</title><path d="M18 6L6 18M6 6l12 12" /></svg></div>
									) : (
										<div className="size-2.5 rounded-full bg-white/20" />
									)}
								</div>
								<span className="truncate relative z-10">{step}</span>
							</button>
						);
					})}
				</div>

				<Separator className="opacity-10 my-3 mx-3 shrink-0" />

				<button
					type="button"
					className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/40 hover:text-white hover:bg-white/4 transition-all"
				>
					<HugeiconsIcon icon={Settings01Icon} className="size-[18px]" strokeWidth={2} />
					Usage
				</button>
				<button
					type="button"
					className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/40 hover:text-white hover:bg-white/4 transition-all"
				>
					<HugeiconsIcon icon={File02Icon} className="size-[18px]" strokeWidth={2} />
					Workflow file
				</button>
			</nav>
		</motion.div>
	);
}
