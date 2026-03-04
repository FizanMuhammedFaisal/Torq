import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Copy01Icon, CheckmarkBadge01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { YamlEditor } from '../yaml-editor';

export function CodeBlock({
	code,
	language = 'yaml',
	filename,
	className,
}: {
	code: string;
	language?: string;
	filename?: string;
	className?: string;
}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div
			className={cn(
				'relative my-8 rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden group',
				className,
			)}
		>
			{/* Header */}
			<div className="flex items-center justify-between px-4 h-10 border-b border-white/5 bg-[#050505]/50">
				<div className="flex items-center gap-2">
					{filename && (
						<span className="text-[13px] font-mono text-emerald-400/80">{filename}</span>
					)}
					{!filename && (
						<span className="text-[12px] font-mono text-white/40 uppercase tracking-widest">
							{language}
						</span>
					)}
				</div>

				<button
					onClick={handleCopy}
					className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
				>
					<HugeiconsIcon icon={copied ? CheckmarkBadge01Icon : Copy01Icon} className="size-3.5" />
					<span className="text-[11px] font-medium tracking-wide uppercase">
						{copied ? 'Copied' : 'Copy'}
					</span>
				</button>
			</div>

			{/* Code Content */}
			<div className="relative w-full max-h-[500px] overflow-auto custom-scrollbar bg-[#0c0c0c]/80 text-[13px]">
				<YamlEditor
					value={code.trim()}
					readOnly={true}
					hideHeader={true}
					height="auto"
					className="border-none rounded-none w-full bg-transparent! text-[13px]"
				/>
			</div>
		</div>
	);
}
