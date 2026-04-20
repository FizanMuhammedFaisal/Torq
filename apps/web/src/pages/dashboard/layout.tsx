import {
	LogoutIcon,
	PlusSignIcon,
	SettingsIcon,
	DashboardSquare01Icon,
	GitMergeIcon,
	PlayCircleIcon,
	BookOpen01Icon
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { authClient } from '@/lib/auth';
import { useAuthStore } from '@/store/use-auth-store';

const navItems = [
	{
		to: '/dashboard',
		label: 'Overview',
		end: true,
		icon: (
			<HugeiconsIcon
				icon={DashboardSquare01Icon}
				className="size-[18px]"
				strokeWidth={2}
			/>
		),
	},
	{
		to: '/dashboard/workflows',
		label: 'Workflows',
		end: false,
		icon: (
			<HugeiconsIcon
				icon={GitMergeIcon}
				className="size-[18px]"
				strokeWidth={2}
			/>
		),
	},
	{
		to: '/dashboard/runs',
		label: 'Runs',
		end: false,
		icon: (
			<HugeiconsIcon
				icon={PlayCircleIcon}
				className="size-[18px]"
				strokeWidth={2}
			/>
		),
	},
	{
		to: '/dashboard/settings',
		label: 'Settings',
		end: false,
		icon: (
			<HugeiconsIcon
				icon={SettingsIcon}
				className="size-[18px]"
				strokeWidth={2}
			/>
		),
	},
];

export function DashboardLayout() {
	const navigate = useNavigate();
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

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
		<div className="flex h-svh bg-background overflow-hidden relative w-full">

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
				className={`hidden md:flex fixed top-0 bottom-0 left-0 z-50 w-[260px] flex-col border-r border-border/50 bg-zinc-950 transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${showSidebar ? 'translate-x-0' : '-translate-x-[252px]'
					}`}
			>
				<div className="flex items-center justify-between px-5 pt-6 pb-4">
					<span className="text-xl font-black tracking-tight text-foreground">
						Torq
					</span>
					<button
						type="button"
						onClick={() => {
							setIsCollapsed(!isCollapsed);
							if (!isCollapsed) setIsHovered(false);
						}}
						className="text-white/30 hover:text-white/70 transition-colors p-1.5 rounded-md hover:bg-white/4"
						title={
							isCollapsed
								? 'Expand sidebar (Cmd+[)'
								: 'Collapse sidebar (Cmd+[)'
						}
					>
						<svg
							className="size-[15px]"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth={2}
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Toggle Sidebar</title>
							<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
							<line x1="9" y1="3" x2="9" y2="21" />
						</svg>
					</button>
				</div>

				<div className="px-4 mb-3">
					<Button
						className="w-full gap-2 justify-center font-medium"
						onClick={() => navigate('/dashboard/workflows/create')}
					>
						<HugeiconsIcon
							icon={PlusSignIcon}
							className="size-4"
							strokeWidth={2.5}
						/>
						Create Workflow
					</Button>
				</div>
				<Separator className="opacity-20 mx-4" />
				<nav className="flex-1 flex flex-col gap-0.5 px-3 pt-3">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isActive
									? 'bg-primary/10 text-primary'
									: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
								}`
							}
						>
							{item.icon}
							{item.label}
						</NavLink>
					))}
				</nav>

				<div className="p-4 mt-auto space-y-2">
					<Separator className="opacity-20 mb-3" />
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
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
						className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
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

			<main className="flex-1 flex flex-col min-w-0 h-svh bg-background relative z-0">
				<header className="flex md:hidden items-center justify-between border-b border-border/50 px-4 py-3">
					<span className="text-lg font-black tracking-tight text-foreground">
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
