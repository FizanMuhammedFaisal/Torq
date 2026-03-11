import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { type ValidationError, YamlEditor } from '@/components/yaml-editor';
import { MOCK_YAML } from '../mock-data';

export function EditorTab() {
	const [yamlContent, setYamlContent] = useState(MOCK_YAML);
	const [errors, setErrors] = useState<ValidationError[]>([]);
	const [saved, setSaved] = useState(true);

	const handleChange = (val: string) => {
		setYamlContent(val);
		setSaved(false);
	};

	const handleSave = () => {
		if (errors.length > 0) return;
		setSaved(true);
	};

	return (
		<div className="flex flex-col items-center justify-center w-full pb-12">
			<div className="w-full max-w-4xl space-y-6">
				{/* Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h3 className="text-[18px] font-semibold text-white/90">Workflow Definition</h3>
						<p className="text-[13px] text-white/40 mt-1">
							Edit the declarative YAML for this workflow.
						</p>
					</div>

					<div className="flex items-center gap-3">
						{errors.length > 0 ? (
							<div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20">
								<span className="size-2 rounded-full bg-red-400 animate-pulse" />
								<span className="text-[12px] font-medium tracking-wide">
									{errors.length} Error{errors.length > 1 ? 's' : ''}
								</span>
							</div>
						) : (
							<div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 transition-colors">
								<span className="size-2 rounded-full bg-primary" />
								<span className="text-[12px] font-medium tracking-wide">Valid Format</span>
							</div>
						)}

						<div className="hidden sm:block w-px h-5 bg-white/10 mx-1" />

						<div className="flex items-center gap-2">
							<Button
								size="sm"
								variant="ghost"
								className="rounded-full h-8 px-4 text-[12px] text-white/50 hover:text-white hover:bg-white/5 transition-all"
								onClick={() => {
									setYamlContent(MOCK_YAML);
									setSaved(true);
								}}
								disabled={saved}
							>
								Discard
							</Button>
							<Button
								size="sm"
								className={`rounded-full h-8 px-6 text-[12px] transition-all shadow-lg ${saved ? 'opacity-50 grayscale' : 'hover:scale-105'}`}
								onClick={handleSave}
								disabled={errors.length > 0 || saved}
							>
								Save Changes
							</Button>
						</div>
					</div>
				</div>

				{/* Error panel */}
				<AnimatePresence>
					{errors.length > 0 && (
						<motion.div
							initial={{ opacity: 0, y: -10, height: 0 }}
							animate={{ opacity: 1, y: 0, height: 'auto' }}
							exit={{ opacity: 0, y: -10, height: 0 }}
							className="rounded-xl bg-red-500/10 border border-red-500/20 px-5 py-4 overflow-hidden"
						>
							<div className="flex items-start gap-3">
								<HugeiconsIcon icon={Alert02Icon as any} className="size-5 text-red-400 shrink-0 mt-0.5" />
								<div className="space-y-1 w-full">
									<p className="text-[13px] font-semibold text-red-400/90 mb-2">Validation Errors Found</p>
									{errors.map((err) => (
										<div key={`${err.line}-${err.message}`} className="flex items-start gap-2 text-[13px] text-red-300/80 bg-red-500/5 p-2 rounded-md">
											<span className="font-mono text-red-400/50 w-12 shrink-0">L{err.line + 1}:</span>
											<span className="font-mono">{err.message}</span>
										</div>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Editor Container with Ambient Glow */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="relative group w-full"
				>
					{/* Ambient Blur */}
					<div className="absolute -inset-1.5 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-[28px] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />

					{/* Editor Pane */}
					<div className="relative rounded-[24px] border border-white/[0.08] bg-[#080808] p-1.5 shadow-2xl overflow-hidden" style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.04)' }}>
						<YamlEditor
							value={yamlContent}
							onChange={handleChange}
							onValidation={setErrors}
							height="560px"
							className="rounded-[20px] bg-[#0a0a0a] ring-1 ring-white/[0.02]"
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
