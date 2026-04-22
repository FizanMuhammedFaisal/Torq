import {
	DashboardSquare01Icon,
	PlayCircleIcon,
	CodeIcon,
	KeyIcon,
	ChartBarLineIcon,
	ArrowLeft02Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';


export function WorkflowSidebar({ workflowId }: { workflowId: string }) {
	const navigate = useNavigate();

	const items = [
		{
			to: `/dashboard/workflows/${workflowId}`,
			label: 'Summary',
			end: true,
			icon: DashboardSquare01Icon,
		},
		{
			to: `/dashboard/workflows/${workflowId}/editor`,
			label: 'Editor',
			icon: CodeIcon,
		},
		{
			to: `/dashboard/workflows/${workflowId}/runs`,
			label: 'Runs',
			icon: PlayCircleIcon,
		},
		{
			to: `/dashboard/workflows/${workflowId}/metrics`,
			label: 'Metrics',
			icon: ChartBarLineIcon,
		},
		{
			to: `/dashboard/workflows/${workflowId}/secrets`,
			label: 'Secrets',
			icon: KeyIcon,
		},
	];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.15 }}
			className="flex flex-col h-full"
		>
			<div className="px-4 mb-4">
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-start gap-2 text-white/40 hover:text-white hover:bg-white/5 rounded-xl group transition-all"
					onClick={() => navigate('/dashboard/workflows')}
				>
					<HugeiconsIcon
						icon={ArrowLeft02Icon}
						className="size-4 group-hover:-translate-x-0.5 transition-transform"
					/>
					Back to Workflows
				</Button>
			</div>

			<div className="px-4 mb-2">
				<span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 px-3">
					Workflow context
				</span>
			</div>

			<nav className="flex-1 flex flex-col gap-1 px-3">
				{items.map((item) => (
					<NavLink
						key={item.to}
						to={item.to}
						end={item.end}
						className={({ isActive }) =>
							`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all relative ${isActive
								? 'text-primary bg-primary/10 ring-1 ring-inset ring-primary/20'
								: 'text-white/40 hover:text-white hover:bg-white/4'
							}`
						}
					>
						{({ isActive }) => (
							<>
								<HugeiconsIcon
									icon={item.icon}
									className={`size-[18px] relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
									strokeWidth={2}
								/>
								<span className="relative z-10">{item.label}</span>
							</>
						)}
					</NavLink>
				))}
			</nav>
		</motion.div>
	);
}
