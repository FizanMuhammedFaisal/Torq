import React from 'react';
import { cn } from '@/lib/utils';
import { HugeiconsIcon } from '@hugeicons/react';
import { Link01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';

export const H1 = ({ children, id, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h1
		id={id}
		className={cn(
			'scroll-m-20 text-4xl sm:text-5xl font-medium tracking-tight text-white mb-8',
			className,
		)}
	>
		{children}
	</h1>
);

export const H2 = ({ children, id, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
	<div className="group relative mt-16 mb-6">
		<h2
			id={id}
			className={cn(
				'scroll-m-20 text-2xl font-medium tracking-tight text-white/90 border-b border-white/5 pb-2',
				className,
			)}
		>
			{children}
		</h2>
		{id && (
			<a
				href={`#${id}`}
				className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-white/30 hover:text-white/60 hidden sm:block"
			>
				<HugeiconsIcon icon={Link01Icon} className="size-4" />
			</a>
		)}
	</div>
);

export const H3 = ({ children, id, className }: React.HTMLAttributes<HTMLHeadingElement>) => (
	<h3
		id={id}
		className={cn(
			'scroll-m-20 text-xl font-medium tracking-tight text-white/80 mt-10 mb-4',
			className,
		)}
	>
		{children}
	</h3>
);

export const P = ({ children, className }: React.HTMLAttributes<HTMLParagraphElement>) => (
	<p className={cn('leading-7 text-[15px] text-white/60 mb-6 font-light', className)}>{children}</p>
);

export const Ul = ({ children, className }: React.HTMLAttributes<HTMLUListElement>) => (
	<ul className={cn('my-6 ml-6 list-none space-y-2', className)}>
		{React.Children.map(children, (child) => (
			<li className="relative">
				<span className="absolute -left-6 top-1.5 size-1.5 rounded-full bg-white/20" />
				<span className="text-[15px] text-white/60 font-light leading-7">{child}</span>
			</li>
		))}
	</ul>
);

export const InlineCode = ({ children, className }: React.HTMLAttributes<HTMLElement>) => (
	<code
		className={cn(
			'relative rounded px-[0.3rem] py-[0.15rem] font-mono text-[13px] font-medium bg-white/10 text-emerald-400',
			className,
		)}
	>
		{children}
	</code>
);

export const Link = ({
	children,
	href,
	className,
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
	<a
		href={href}
		target="_blank"
		rel="noreferrer"
		className={cn(
			'font-medium text-emerald-400 group inline-flex items-center gap-1 hover:text-emerald-300 transition-colors underline underline-offset-4 decoration-emerald-500/30 hover:decoration-emerald-400',
			className,
		)}
	>
		{children}
		<HugeiconsIcon icon={ArrowRight01Icon} className="size-3 -rotate-45" />
	</a>
);

export const Alert = ({
	children,
	type = 'info',
	className,
}: {
	children: React.ReactNode;
	type?: 'info' | 'warning';
	className?: string;
}) => {
	const isWarning = type === 'warning';
	return (
		<div
			className={cn(
				'my-8 rounded-xl border p-4 sm:p-5',
				isWarning
					? 'bg-amber-500/[0.03] border-amber-500/20 text-amber-500/90'
					: 'bg-emerald-500/[0.03] border-emerald-500/20 text-emerald-500/90',
				className,
			)}
		>
			<div className="text-[14px] leading-relaxed font-light">{children}</div>
		</div>
	);
};
