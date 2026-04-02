import { cn } from '@/lib/utils';

interface WorkflowHealthBarProps {
	health: (boolean | null)[];
	className?: string;
}

export function WorkflowHealthBar({ health, className }: WorkflowHealthBarProps) {
	return (
		<div className={cn("flex items-center gap-[2px]", className)}>
			{health.map((isSuccess, idx) => (
				<div
					key={idx}
					className={cn(
                        "w-1.5 h-4 rounded-sm transition-all duration-300",
                        isSuccess === true
						? 'bg-emerald-500/60 shadow-[0_0_4px_rgba(16,185,129,0.2)]'
						: isSuccess === false
							? 'bg-red-500/60 shadow-[0_0_4px_rgba(239,68,68,0.2)]'
							: 'bg-white/5'
                    )}
				/>
			))}
		</div>
	);
}
