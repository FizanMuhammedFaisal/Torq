import {
	ArrowExpand02Icon,
	Book02Icon,
	Cancel01Icon,
	CodeIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { YamlEditor } from '@/components/yaml-editor';
import type { ApiErrorBody } from '@/api/client';

interface WorkflowEditorProps {
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
	name: string;
	yamlCode: string;
	setYamlCode: (code: string) => void;
	activeVersion?: string;
	apiError?: ApiErrorBody | null;
}

export function WorkflowEditor({
	isExpanded,
	setIsExpanded,
	name,
	yamlCode,
	setYamlCode,
	activeVersion = 'V1Alpha',
	apiError,
}: WorkflowEditorProps) {
	return (
		<div
			className={`mt-8 lg:mt-0 relative transition-all duration-500 ${isExpanded ? 'col-span-1 lg:col-span-12 h-[calc(100vh-100px)]' : 'lg:col-span-6 h-[500px] lg:h-auto'}`}
		>
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
				className={`flex flex-col h-full w-full ${isExpanded ? '' : 'sticky top-20'}`}
			>
				{/* Editor Header */}
				{!isExpanded ? (
					<div className="flex items-center justify-between mb-5">
						<div className="flex items-center gap-3">
							<div className="size-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500/70">
								<HugeiconsIcon icon={CodeIcon} className="size-3.5" />
							</div>
							<h2 className="text-lg font-medium tracking-tight">
								Workflow Definition
							</h2>
						</div>

						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => window.open('/docs', '_blank')}
								className="h-8 rounded-full bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[12px] px-3 font-medium"
							>
								<HugeiconsIcon icon={Book02Icon} className="size-3 mr-1.5" />
								Docs
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => setIsExpanded(true)}
								className="h-8 rounded-full bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[12px] px-3 font-medium"
							>
								<HugeiconsIcon
									icon={ArrowExpand02Icon}
									className="size-3 mr-1.5"
								/>
								Expand
							</Button>
						</div>
					</div>
				) : (
					<div
						className="h-12 border border-white/[0.04] rounded-t-[12px] flex items-center justify-between px-4 shrink-0 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
						style={{ backgroundColor: 'oklch(0.09 0.005 285)' }}
					>
						{/* Left: Back / Close Action */}
						<div className="flex items-center gap-2 basis-1/3">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsExpanded(false)}
								className="h-7 rounded-md hover:bg-white/5 text-white/60 hover:text-white transition-colors text-[12px] px-2.5 font-medium border border-transparent hover:border-white/5"
							>
								<HugeiconsIcon
									icon={Cancel01Icon}
									className="size-3.5 mr-1.5"
								/>
								Back to Configuration
							</Button>
						</div>

						{/* Center: File Info */}
						<div className="flex items-center justify-center gap-2 basis-1/3">
							<HugeiconsIcon
								icon={CodeIcon}
								className="size-3.5 text-white/30"
							/>
							<span className="text-[13px] font-mono text-white/50 tracking-tight">
								{name.trim() ? `${name.trim()}.yaml` : 'workflow.yaml'}
							</span>
							<span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-white/5 text-white/30 tracking-widest uppercase">
								{activeVersion}
							</span>
						</div>

						{/* Right: Docs */}
						<div className="flex items-center justify-end gap-2 basis-1/3">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => window.open('/docs', '_blank')}
								className="h-7 rounded-md hover:bg-white/5 text-white/40 hover:text-white transition-colors text-[12px] px-2.5 font-medium border border-transparent hover:border-white/5"
							>
								<HugeiconsIcon icon={Book02Icon} className="size-3.5 mr-1.5" />
								Docs
							</Button>
						</div>
					</div>
				)}

				{/* Editor Body */}
				<div
					className={`w-full relative overflow-hidden flex-1 flex flex-col ${
						isExpanded
							? 'border border-t-0 border-white/10 rounded-b-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]'
							: 'shadow-2xl shadow-emerald-500/5 ring-1 ring-white/10 rounded-xl min-h-[400px]'
					}`}
					style={isExpanded ? { backgroundColor: 'oklch(0.10 0.005 285)' } : {}}
				>
					{/* Error Banner overlay */}
					{apiError && apiError.issues && apiError.issues.length > 0 && (
						<div className="z-20 w-full shrink-0 bg-red-950/40 border-b border-red-500/30 px-5 py-4 max-h-64 overflow-y-auto backdrop-blur-xl shadow-[0_10px_40px_rgba(239,68,68,0.1)]">
							<div className="flex items-start gap-3 mb-3">
								<div className="size-6 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
									<HugeiconsIcon icon={Cancel01Icon} className="size-3.5 text-red-500" />
								</div>
								<div>
									<h3 className="text-[14px] font-medium text-red-400">
										Invalid Workflow Specification
									</h3>
									<p className="text-[13px] text-red-400/70 mt-0.5">
										Please fix the following {apiError.issues.length} error{apiError.issues.length > 1 ? 's' : ''} to continue.
									</p>
								</div>
							</div>
							
							<div className="space-y-2 mt-4">
								{apiError.issues.map((issue: any, idx) => {
									const fieldPath = issue.path || issue.field;
									return (
										<div key={idx} className="flex gap-3 bg-red-500/5 border border-red-500/10 rounded-lg p-3 relative overflow-hidden group hover:border-red-500/20 hover:bg-red-500/10 transition-colors">
											<div className="absolute left-0 top-0 bottom-0 w-[2px] bg-red-500/30 group-hover:bg-red-500/50 transition-colors" />
											<div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
												{fieldPath && (
													<div className="shrink-0 font-mono text-[11px] bg-red-500/10 text-red-400/90 px-2 py-0.5 rounded border border-red-500/20">
														{fieldPath}
													</div>
												)}
												<div className="text-[13px] text-red-200/80 leading-relaxed font-sans truncate whitespace-normal">
													{issue.message}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					)}
					<div className="relative flex-1 min-h-0 h-[400px] lg:h-auto">
						<YamlEditor
							value={yamlCode}
							onChange={(val) => setYamlCode(val)}
							height="100%"
							className="absolute inset-0"
						/>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
