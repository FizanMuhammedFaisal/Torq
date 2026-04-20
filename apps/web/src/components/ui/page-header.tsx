import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
	title: string;
	subtitle?: string | ReactNode;
	children?: ReactNode;
	className?: string;
}

export function PageHeader({
	title,
	subtitle,
	children,
	className,
}: PageHeaderProps) {
	return (
		<div
			className={cn(
				'flex items-center justify-between px-6 lg:px-8 py-8 border-b border-white/5 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-blue-900/5 via-zinc-950 to-zinc-950',
				className
			)}
		>
			<div className="flex-1 min-w-0">
				<h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
					{title}
				</h1>
				{subtitle && (
					<div className="text-[14px] text-white/40 mt-2 flex items-center gap-2 font-medium">
						{typeof subtitle === 'string' ? (
							<>
								<span className="relative flex size-2.5 items-center justify-center">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-20" />
									<span className="relative inline-flex size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
								</span>
								{subtitle}
							</>
						) : (
							subtitle
						)}
					</div>
				)}
			</div>
			{children && (
				<div className="flex items-center gap-3 shrink-0 ml-4">
					{children}
				</div>
			)}
		</div>
	);
}
