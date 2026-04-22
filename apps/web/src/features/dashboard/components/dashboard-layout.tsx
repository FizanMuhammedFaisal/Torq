import {
	LogoutIcon,
	PlusSignIcon,
	SettingsIcon,
	DashboardSquare01Icon,
	GitMergeIcon,
	PlayCircleIcon,
	BookOpen01Icon,
	ArrowLeft01Icon,
	SidebarLeftIcon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth';
import { useAuthStore } from '@/store/auth';

import { useNavigationContext } from '../hooks/use-navigation-context';
import { WorkflowSidebar } from '@/features/workflows/components/detail/workflow-sidebar';
import { RunSidebar } from '@/features/runs/components/detail/run-sidebar';
import { AnimatePresence, motion } from 'motion/react';

const navItems = [
	{
		to: '/dashboard',
		label: 'Overview',
		end: true,
		icon: DashboardSquare01Icon,
	},
	{
		to: '/dashboard/workflows',
		label: 'Workflows',
		end: false,
		icon: GitMergeIcon,
	},
	{
		to: '/dashboard/runs',
		label: 'Runs',
		end: false,
		icon: PlayCircleIcon,
	},
	{
		to: '/dashboard/settings',
		label: 'Settings',
		end: false,
		icon: SettingsIcon,
	},
];

export function DashboardLayout() {
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const { context, id: workflowId, runId } = useNavigationContext();

	// Keyboard shortcut to toggle sidebar
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === '[' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setIsCollapsed((c) => !c);
			}
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, []);

	const showSidebar = !isCollapsed || isHovered;

	return (
		<div className="flex h-svh bg-zinc-950 overflow-hidden relative w-full font-sans">

			{isCollapsed && !isHovered && (
				<div
					className="absolute left-0 top-0 bottom-0 w-6 z-40 bg-transparent cursor-pointer"
					onMouseEnter={() => setIsHovered(true)}
					role="presentation"
				/>
			)}

			<div
				className={`hidden md:block shrink-0 transition-[width] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${isCollapsed ? 'w-4' : 'w-[260px]'
					}`}
			/>

			<aside
				onMouseLeave={() => setIsHovered(false)}
				className={`hidden md:flex fixed top-0 bottom-0 left-0 z-50 w-[260px] flex-col border-r border-white/5 bg-zinc-950 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${showSidebar ? 'translate-x-0' : '-translate-x-[252px]'
					}`}
			>
				<div className="flex items-center justify-between px-5 h-20 shrink-0">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => navigate(-1)}
							className="size-8 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center text-white/20 hover:text-white hover:bg-white/5 transition-all"
						>
							<HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
						</button>
						<div
							className="flex items-center gap-3 cursor-pointer group"
							onClick={() => navigate('/dashboard')}
						>
							<span className="text-[17px] font-black tracking-tight text-white">
								Torq
							</span>
							<div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 tracking-widest uppercase">
								v1α
							</div>
						</div>
					</div>
					<button
						type="button"
						onClick={() => {
							setIsCollapsed(!isCollapsed);
							if (!isCollapsed) setIsHovered(false);
						}}
						className="size-8 flex items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-white/20 hover:text-white transition-all"
					>
						<HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
					</button>
				</div>

				<div className="flex-1 overflow-hidden relative">
					<AnimatePresence mode="popLayout" initial={false}>
						{context === 'run' && workflowId && runId ? (
							<RunSidebar key="run" workflowId={workflowId} runId={runId} />
						) : context === 'workflow' && workflowId ? (
							<WorkflowSidebar key="workflow" workflowId={workflowId} />
						) : (
							<motion.div
								key="global"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.15 }}
								className="flex flex-col h-full"
							>
								<div className="px-4 mb-4">
									<Button
										className="w-full h-10 gap-2 justify-center font-bold tracking-tight bg-primary text-black hover:bg-primary/90 transition-all active:scale-[0.97]"
										onClick={() => navigate('/dashboard/workflows/create')}
									>
										<HugeiconsIcon
											icon={PlusSignIcon}
											className="size-4"
											strokeWidth={3}
										/>
										Create Workflow
									</Button>
								</div>

								<nav className="flex-1 flex flex-col gap-0.5 px-3">
									{navItems.map((item) => (
										<NavLink
											key={item.to}
											to={item.to}
											end={item.end}
											className={({ isActive }) =>
												`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors relative group ${isActive
													? 'bg-primary/10 text-primary'
													: 'text-white/40 hover:text-white hover:bg-white/5'
												}`
											}
										>
											{({ isActive }) => (
												<>
													<HugeiconsIcon
														icon={item.icon}
														className={`size-[18px] transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
														strokeWidth={2}
													/>
													<span>{item.label}</span>
												</>
											)}
										</NavLink>
									))}
								</nav>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<div className="p-4 mt-auto space-y-2 shrink-0">
					<Separator className="opacity-10 mb-3" />
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2.5 text-white/30 hover:text-white hover:bg-white/5 rounded-lg font-medium"
						onClick={() => navigate('/docs')}
					>
						<HugeiconsIcon
							icon={BookOpen01Icon}
							className="size-4"
							strokeWidth={2}
						/>
						Documentation
					</Button>
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2.5 text-white/30 hover:text-red-400 hover:bg-red-500/5 rounded-lg font-medium"
						onClick={async () => {
							await authClient.signOut();
							useAuthStore.getState().clearAuth();
							toast.success('Signed out successfully');
							navigate('/login');
						}}
					>
						<HugeiconsIcon
							icon={LogoutIcon}
							className="size-4"
							strokeWidth={2}
						/>
						Sign out
					</Button>
				</div>
			</aside>

			<main className="flex-1 flex flex-col min-w-0 h-svh bg-zinc-950 relative z-0">
				<header className="flex md:hidden items-center justify-between border-b border-white/5 px-4 py-3 bg-zinc-950">
					<span className="text-lg font-black tracking-tight text-white">
						Torq
					</span>
				</header>

				<div className="flex-1 overflow-y-auto">
					<Outlet context={{ isCollapsed }} />
				</div>
			</main>
		</div>
	);
}
