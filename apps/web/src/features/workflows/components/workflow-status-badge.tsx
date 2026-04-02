import { statusConfig } from '../config';
import type { WorkflowStatus } from '../types';
import { cn } from '@/lib/utils';

interface WorkflowStatusBadgeProps {
	status?: WorkflowStatus;
	className?: string;
}

export function WorkflowStatusBadge({ status, className }: WorkflowStatusBadgeProps) {
	const cfg = status ? (statusConfig[status] || statusConfig.idle) : statusConfig.idle;
    const isRunning = status === 'running';

	return (
		<div
			className={cn(
				"flex items-center gap-2 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase border backdrop-blur-md w-fit",
				className
			)}
			style={{
				color: cfg.color,
				backgroundColor: `${cfg.color}15`,
				borderColor: `${cfg.color}30`,
			}}
		>
			<div className="relative flex items-center justify-center size-1.5 shrink-0">
				{isRunning && (
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
	);
}
