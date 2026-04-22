import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Alert02Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { type ValidationError, YamlEditor } from '@/components/yaml-editor';
import { useGetWorkflowSpec } from '../../hooks/use-get-workflow-spec';
import { useWorkFlowActions, useWorkFlowStore } from '@/store/workflow';
import { useUpdateWorkflow } from '../../hooks/use-update-workflow';
import toast from 'react-hot-toast';
import { useWorkflowDetail } from './workflow-context';

export function EditorTab() {
	const { workflow } = useWorkflowDetail();
	const workflowId = workflow.id;
	const { isLoading, isError } = useGetWorkflowSpec(workflowId);
	const updateWorkflowMutation = useUpdateWorkflow(workflowId);

	const { workflows } = useWorkFlowStore();
	const { setEditingSpecContent, setSaved } = useWorkFlowActions();
	const [errors, setErrors] = useState<ValidationError[]>([]);

	const workflowEntry = workflows[workflowId];

	// Cache-first: if we have the spec in the store, don't show loading even if query is pending/fetching
	const isDataLoading = isLoading && !workflowEntry?.spec;

	if (isDataLoading) {
		return <EditorSkeleton />;
	}

	if (isError || !workflowEntry) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 border border-white/5 bg-white/2 rounded-3xl">
				<div className="size-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
					<HugeiconsIcon icon={Alert02Icon} className="size-6 text-red-400" />
				</div>
				<h3 className="text-white font-medium mb-1">Failed to Load Specification</h3>
				<p className="text-white/40 text-sm max-w-xs">
					We couldn't retrieve the workflow definition. Please check your connection and try again.
				</p>
			</div>
		);
	}

	const { editingSpec: yamlContent, saved, spec } = workflowEntry;

	const handleChange = (val: string) => {
		setEditingSpecContent(workflowId, val);
		setSaved(workflowId, false);
	};

	const handleSave = async () => {
		if (errors.length > 0) return;
		if (saved) return;
		updateWorkflowMutation.mutate(
			{ raw: yamlContent },
			{
				onSuccess: (data) => {
					if (data.raw) {
						setEditingSpecContent(workflowId, data.raw);
					}
					toast.success('Workflow Updated');
					setSaved(workflowId, true);
				},
				onError: () => {
					toast.error('Update Failed, Try again');
					setSaved(workflowId, false);
				},
			},
		);
	};

	const hanldeDiscard = () => {
		setEditingSpecContent(workflowId, spec);
		setSaved(workflowId, true);
	};

	return (
		<div className="flex flex-col items-center justify-center w-full pb-12">
			<div className="w-full max-w-4xl space-y-6">
				{/* Toolbar */}
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
					<div>
						<h3 className="text-[18px] font-semibold text-white/90">Workflow Definition</h3>
						<p className="text-[13px] text-white/40 mt-1">Edit the declarative YAML for this workflow.</p>
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
								onClick={hanldeDiscard}
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
										<div
											key={`${err.line}-${err.message}`}
											className="flex items-start gap-2 text-[13px] text-red-300/80 bg-red-500/5 p-2 rounded-md"
										>
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
					<div
						className="relative rounded-[24px] border border-white/8 bg-black/95 p-1.5 shadow-2xl overflow-hidden"
						style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.04)' }}
					>
						<YamlEditor
							value={yamlContent}
							onChange={handleChange}
							onValidation={setErrors}
							height="560px"
							className="rounded-[20px] bg-zinc-950 ring-1 ring-white/2"
						/>
					</div>
				</motion.div>
			</div>
		</div>
	);
}

function EditorSkeleton() {
	return (
		<div className="flex flex-col items-center justify-center w-full animate-in fade-in duration-500">
			<div className="w-full max-w-4xl space-y-6">
				<div className="flex justify-between items-end">
					<div className="space-y-2">
						<div className="h-6 w-48 bg-white/5 rounded-md animate-pulse" />
						<div className="h-4 w-64 bg-white/5 rounded-md animate-pulse" />
					</div>
					<div className="flex gap-2">
						<div className="h-8 w-24 bg-white/5 rounded-full animate-pulse" />
						<div className="h-8 w-32 bg-white/10 rounded-full animate-pulse" />
					</div>
				</div>
				<div className="h-[600px] w-full bg-white/2 border border-white/5 rounded-[24px] overflow-hidden relative">
					<div className="absolute top-0 left-0 right-0 h-10 bg-white/5 border-b border-white/5 flex items-center px-4 gap-2">
						<div className="size-4 rounded bg-white/10 animate-pulse" />
						<div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
					</div>
					<div className="p-6 space-y-4">
						{[...Array(12)].map((_, i) => (
							<div
								key={i}
								className="h-4 bg-white/5 rounded animate-pulse"
								style={{ width: `${Math.random() * 40 + 40}%`, animationDelay: `${i * 100}ms` }}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
