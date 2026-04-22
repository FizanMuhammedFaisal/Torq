import { PlusSignIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
	isCollapsed: boolean;
	isAuthEnabled: boolean;
}

export function DashboardHeader({
	isCollapsed,
	isAuthEnabled,
}: DashboardHeaderProps) {
	return (
		<div className="flex items-center justify-between px-8 py-8 border-b border-white/5 bg-zinc-950">
			<div>
				<h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
					Command Center
				</h1>
				<p className="text-[14px] text-white/40 mt-2 flex items-center gap-2 font-medium">
					<span className="relative flex size-2.5 items-center justify-center">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20"></span>
						<span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
					</span>
					Torq Engine via {isAuthEnabled ? 'Workspace' : 'Default Namespace'}
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
						<Button className="gap-2 rounded-lg px-5 text-[13px] font-bold h-9 shadow-[0_4px_12px_rgba(16,185,129,0.2)] bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-[0.97] border-0">
							<HugeiconsIcon
								icon={PlusSignIcon}
								className="size-4"
								strokeWidth={2.5}
							/>
							New Workflow
						</Button>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
