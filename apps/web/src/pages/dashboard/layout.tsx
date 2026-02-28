import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
	{ to: '/dashboard', label: 'Workflows', icon: WorkflowIcon, end: true },
	{ to: '/dashboard/runs', label: 'Runs', icon: RunsIcon, end: false },
	{ to: '/dashboard/settings', label: 'Settings', icon: SettingsIcon, end: false },
];

export function DashboardLayout() {
	const navigate = useNavigate();

	return (
		<div className="flex min-h-svh bg-background">
			{/* Sidebar */}
			<aside className="hidden md:flex w-[240px] flex-col border-r border-border/50 bg-card/30">
				{/* Brand */}
				<div className="flex items-end gap-0 px-5 pt-6 pb-4">
					<span className="text-lg font-black tracking-tight text-foreground">Tor</span>
					<span className="text-lg font-black tracking-tight text-primary">q</span>
				</div>

				<Separator className="opacity-30" />

				{/* Nav */}
				<nav className="flex-1 flex flex-col gap-0.5 px-3 pt-4">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
									isActive
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
								}`
							}
						>
							<item.icon className="size-4 shrink-0" />
							{item.label}
						</NavLink>
					))}
				</nav>

				{/* Bottom */}
				<div className="p-3 mt-auto">
					<Separator className="opacity-30 mb-3" />
					<Button
						variant="ghost"
						size="sm"
						className="w-full justify-start gap-2.5 text-muted-foreground hover:text-foreground"
						onClick={() => navigate('/login')}
					>
						<LogoutIcon className="size-4" />
						Sign out
					</Button>
				</div>
			</aside>

			{/* Main content */}
			<main className="flex-1 flex flex-col overflow-hidden">
				{/* Top bar (mobile) */}
				<header className="flex md:hidden items-center justify-between border-b border-border/50 px-4 py-3">
					<div className="flex items-end gap-0">
						<span className="text-lg font-black tracking-tight text-foreground">Tor</span>
						<span className="text-lg font-black tracking-tight text-primary">q</span>
					</div>
				</header>

				<div className="flex-1 overflow-y-auto">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

/* ── Inline Icons ─────────────────────────────────────────── */

function WorkflowIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M6 3v12" />
			<circle cx="18" cy="6" r="3" />
			<circle cx="6" cy="18" r="3" />
			<path d="M18 9a9 9 0 0 1-9 9" />
		</svg>
	);
}

function RunsIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<polygon points="6 3 20 12 6 21 6 3" />
		</svg>
	);
}

function SettingsIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	);
}

function LogoutIcon({ className }: { className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
			<polyline points="16 17 21 12 16 7" />
			<line x1="21" x2="9" y1="12" y2="12" />
		</svg>
	);
}
