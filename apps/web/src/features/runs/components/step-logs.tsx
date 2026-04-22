import { useEffect, useRef, useState, useMemo } from 'react';
import { useStreamLogs } from '../hooks/use-stream-logs';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	Loading03Icon,
	Alert01Icon,
	Maximize01Icon,
	Minimize01Icon,
	Search01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StepLogsProps {
	runId: string;
	jobId: string;
}

export function StepLogs({ runId, jobId }: StepLogsProps) {
	const { logs, phase } = useStreamLogs(runId, jobId);
	const scrollRef = useRef<HTMLDivElement>(null);
	const [autoScroll, setAutoScroll] = useState(true);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');


	// Filter logs based on search query
	const filteredLogs = useMemo(() => {
		if (!searchQuery) return logs;
		return logs.filter(log => log.message.toLowerCase().includes(searchQuery.toLowerCase()));
	}, [logs, searchQuery]);

	// Auto-scroll when new logs arrive
	useEffect(() => {
		if (autoScroll && scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [logs.length, autoScroll]);

	// Detect user scrolling up to pause auto-scroll
	const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
		const el = e.currentTarget;
		const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
		setAutoScroll(isAtBottom);
	};

	const isLive = phase === 'live';

	const terminalContent = (
		<div className={`flex flex-col h-full bg-zinc-950 border border-white/5 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${isFullScreen ? 'fixed inset-4 z-[100] bg-black' : 'relative'}`}>
			{/* GitHub-Inspired Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-white/5 bg-zinc-900/40 backdrop-blur-md shrink-0 gap-4 sm:gap-0">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.03] border border-white/5">
						<div className="flex items-center gap-1">
							<div className="size-2 rounded-full bg-rose-500/40" />
							<div className="size-2 rounded-full bg-amber-500/40" />
							<div className="size-2 rounded-full bg-emerald-500/40" />
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-2.5">
							<span className="text-[14px] font-black text-white tracking-tight">{jobId}</span>
							<div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
								<span className={`size-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`} />
								<span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">
									{isLive ? 'Live' : 'History'}
								</span>
							</div>
						</div>
						<span className="text-[11px] text-white/30 font-medium">{logs.length} lines captured</span>
					</div>
				</div>

				<div className="flex items-center gap-2 w-full sm:w-auto">
					<div className="relative group flex-1 sm:flex-none mr-2">
						<HugeiconsIcon icon={Search01Icon} className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/20 group-focus-within:text-primary transition-colors" />
						<Input
							placeholder="Search logs..."
							className="h-9 w-full sm:w-[200px] pl-9 bg-black/40 border-white/5 rounded-xl text-[13px] focus-visible:ring-primary/20 placeholder:text-white/10"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className="flex items-center gap-2">


						<div className="w-px h-4 bg-white/10 mx-1" />

						<Button
							variant="ghost"
							size="sm"
							className="size-9 p-0 rounded-xl text-white/20 hover:text-white hover:bg-white/5 border border-white/5"
							onClick={() => setIsFullScreen(!isFullScreen)}
							title={isFullScreen ? "Minimize" : "Maximize"}
						>
							<HugeiconsIcon icon={isFullScreen ? Minimize01Icon : Maximize01Icon} className="size-4" />
						</Button>
					</div>
				</div>
			</div>

			{/* Logs Area */}
			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto p-6 font-mono text-[13px] leading-[1.6] custom-scrollbar selection:bg-emerald-500/30 bg-black/40"
			>
				{phase === 'history' && logs.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full gap-4 text-white/20">
						<HugeiconsIcon icon={Loading03Icon} className="size-6 animate-spin" />
						<p className="text-[12px] font-bold uppercase tracking-widest">Streaming historical logs...</p>
					</div>
				) : phase === 'error' && logs.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full gap-4 text-rose-500/40">
						<HugeiconsIcon icon={Alert01Icon} className="size-8" />
						<p className="text-[12px] font-bold uppercase tracking-widest">Connection failed</p>
					</div>
				) : filteredLogs.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full opacity-20 italic text-[12px] gap-2">
						<HugeiconsIcon icon={Search01Icon} className="size-8 mb-2" />
						{searchQuery ? `No results for "${searchQuery}"` : "No output generated yet."}
					</div>
				) : (
					<div className="flex flex-col">
						{filteredLogs.map((log, i) => (
							<div
								key={log.id}
								className="group flex gap-6 py-0.5 hover:bg-white/[0.03] transition-colors -mx-4 px-4 rounded-md"
							>
								<div className="flex items-center gap-4 flex-none select-none">
									<span className="text-white/20 text-right min-w-[32px] text-[11px] font-bold">
										{i + 1}
									</span>
								</div>
								<span className="text-white/80 break-all whitespace-pre-wrap">
									{log.message}
								</span>
							</div>
						))}

						{/* Live cursor indicator */}
						{isLive && !searchQuery && (
							<div className="flex gap-6 py-0.5 mt-2">
								<div className="flex items-center gap-4 flex-none select-none">
									<span className="min-w-[32px]" />
								</div>
								<div className="w-2 h-4 bg-emerald-500/30 animate-pulse rounded-sm" />
							</div>
						)}
					</div>
				)}
			</div>

		</div>
	);

	return (
		<>
			{isFullScreen && (
				<button
					type="button"
					className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[90] animate-in fade-in duration-300"
					onClick={() => setIsFullScreen(false)}
				/>
			)}
			<div className={`relative w-full ${isFullScreen ? 'h-0' : 'h-full min-h-[400px]'}`}>
				{terminalContent}
			</div>
		</>
	);
}
