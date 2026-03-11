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

interface WorkflowEditorProps {
	isExpanded: boolean;
	setIsExpanded: (expanded: boolean) => void;
	name: string;
	yamlCode: string;
	setYamlCode: (code: string) => void;
	activeVersion?: string;
}

export function WorkflowEditor({
	isExpanded,
	setIsExpanded,
	name,
	yamlCode,
	setYamlCode,
	activeVersion = 'V1Alpha',
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
					className={`w-full relative overflow-hidden flex-1 ${
						isExpanded
							? 'border border-t-0 border-white/10 rounded-b-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)]'
							: 'shadow-2xl shadow-emerald-500/5 ring-1 ring-white/10 rounded-xl max-h-[600px] min-h-[400px]'
					}`}
					style={isExpanded ? { backgroundColor: 'oklch(0.10 0.005 285)' } : {}}
				>
					<YamlEditor
						value={yamlCode}
						onChange={(val) => setYamlCode(val)}
						height="100%"
						className="absolute inset-0"
					/>
				</div>
			</motion.div>
		</div>
	);
}
