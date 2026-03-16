import { ArrowRight01Icon, Loading03Icon } from '@hugeicons/core-free-icons';
import type { ApiErrorBody, AxiosError } from '@/api/client';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WORKFLOW_TEMPLATES } from '@/features/workflows/config/templates';
import { useCreateWorkflow } from '@/features/workflows/hooks/use-create-workflow';
import { useVersionStore } from '@/store/version-store';
import { ConfigurationSection } from './workflow-create/configuration-section';
import { SecretsSection } from './workflow-create/secrets-section';
import { TemplateSelector } from './workflow-create/template-selector';
import { WorkflowEditor } from './workflow-create/workflow-editor';

export function WorkflowCreatePage() {
	const navigate = useNavigate();
	const { mutateAsync, isPending } = useCreateWorkflow();
	const { activeVersion, setActiveVersion } = useVersionStore();
	const templates =
		WORKFLOW_TEMPLATES[activeVersion] || WORKFLOW_TEMPLATES['latest'];

	const [selectedTemplate, setSelectedTemplate] = useState(
		templates[0]?.id || 'blank',
	);
	const [secrets, setSecrets] = useState<{ key: string; value: string }[]>([]);
	const [yamlCode, setYamlCode] = useState(templates[0]?.code || '');
	const [isExpanded, setIsExpanded] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [nameTouched, setNameTouched] = useState(false);
	const [apiError, setApiError] = useState<ApiErrorBody | null>(null);

	// Update template/yamlcode when version changes
	useEffect(() => {
		const newTemplates =
			WORKFLOW_TEMPLATES[activeVersion] || WORKFLOW_TEMPLATES['latest'];
		const tmpl = newTemplates[0];
		if (tmpl) {
			setSelectedTemplate(tmpl.id);
			setYamlCode(tmpl.code);
		}
	}, [activeVersion]);

	useEffect(() => {
		if (isExpanded) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	}, [isExpanded]);

	const handleTemplateSelect = (id: string) => {
		setSelectedTemplate(id);
		const tmpl = templates.find((t) => t.id === id);
		if (tmpl) setYamlCode(tmpl.code);
	};

	const handleSubmit = async () => {
		setNameTouched(true);
		setApiError(null);
		if (!name.trim()) {
			toast.error('Workflow name is required');
			return;
		}
		const validSecrets = secrets.filter((s) => s.key.trim() && s.value.trim());
		try {
			await mutateAsync({
				name: name.trim(),
				description: description.trim() || undefined,
				workflowSpec: yamlCode,
				specFormat: 'yaml',
				secrets: validSecrets.length > 0 ? validSecrets : undefined,
			});
			toast.success('Workflow created!');
			navigate('/dashboard');
		} catch (err: unknown) {
			const axiosErr = err as AxiosError<ApiErrorBody>;
			const errorData = axiosErr?.response?.data;
			
			if (errorData) {
				setApiError(errorData);
				if (errorData.issues && errorData.issues.length > 0) {
					toast.error(`Workflow creation failed with ${errorData.issues.length} validation error(s). Please check the editor.`);
				} else {
					toast.error(errorData.message || 'Failed to create workflow. Please try again.');
				}
			} else {
				toast.error('Failed to create workflow. Please try again.');
			}
		}
	};

	const sectionDelay = 0.08;

	return (
		<div
			className={`max-w-[1280px] mx-auto px-6 pb-32 transition-all duration-500 ${isExpanded ? 'pt-6' : 'pt-12 lg:pt-16'}`}
		>
			{/* Header - hide when expanded */}
			{!isExpanded && (
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6"
				>
					<div>
						<h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-white mb-3">
							Create <span className="font-medium">Workflow</span>
						</h1>
						<p className="text-white/40 font-light">
							Define a new automated execution pipeline.
						</p>
					</div>

					<Button
						variant="default"
						onClick={handleSubmit}
						disabled={isPending}
						className=" h-10 px-6 rounded-full font-medium tracking-wide text-[14px] transition-all duration-100 active:scale-[0.97] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed self-start sm:self-auto"
					>
						{isPending ? (
							<>
								Creating...
								<HugeiconsIcon
									icon={Loading03Icon}
									className="size-4 ml-2 animate-spin opacity-50"
								/>
							</>
						) : (
							<>
								Create Workflow
								<HugeiconsIcon
									icon={ArrowRight01Icon}
									className="size-4 ml-2 opacity-50"
								/>
							</>
						)}
					</Button>
				</motion.div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative w-full transition-all duration-500">
				{/* Configuration Column - hide when expanded */}
				{!isExpanded && (
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20, width: 0 }}
						className="lg:col-span-6 space-y-10 relative"
					>
						{/* Stepper Line extending down the left side */}
						<div className="absolute left-[13px] top-[24px] bottom-0 w-px bg-white/5 hidden sm:block pointer-events-none" />

						{/* Section 1: Templates */}
						<TemplateSelector
							activeVersion={activeVersion}
							setActiveVersion={setActiveVersion}
							templates={templates}
							selectedTemplate={selectedTemplate}
							onSelect={handleTemplateSelect}
						/>

						{/* Section 2: Metadata */}
						<ConfigurationSection
							name={name}
							setName={setName}
							nameTouched={nameTouched}
							setNameTouched={setNameTouched}
							description={description}
							setDescription={setDescription}
							sectionDelay={sectionDelay}
						/>

						{/* Section 3: Secrets List */}
						<SecretsSection
							secrets={secrets}
							setSecrets={setSecrets}
							sectionDelay={sectionDelay}
						/>
					</motion.div>
				)}

				{/* Editor Column - Expands to full width when isExpanded is true */}
				<WorkflowEditor
					isExpanded={isExpanded}
					setIsExpanded={setIsExpanded}
					name={name}
					yamlCode={yamlCode}
					setYamlCode={setYamlCode}
					activeVersion={activeVersion}
					apiError={apiError}
				/>
			</div>

			{/* Floating Action Bar removed */}
		</div>
	);
}
