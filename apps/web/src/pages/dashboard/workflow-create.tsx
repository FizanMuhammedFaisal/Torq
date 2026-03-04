import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	CodeIcon,
	ContainerTruck02Icon,
	PlusSignIcon,
	CheckmarkCircle02Icon,
	Settings01Icon,
	ArrowRight01Icon,
	Delete01Icon,
	File01Icon,
	Book02Icon,
	ArrowExpand02Icon,
	Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { YamlEditor } from '@/components/yaml-editor';

const TEMPLATES = [
	{
		id: 'blank',
		name: 'Blank Canvas',
		description: 'Start from scratch with an empty workflow file.',
		icon: File01Icon,
		color: 'from-white/10 to-white/5',
		accent: 'text-white',
		code: `name: my-workflow\ntriggers:\n  - type: manual\nsteps:\n  - name: Hello World\n    run: echo "Hello world!"\n`,
	},
	{
		id: 'docker',
		name: 'Docker Publish',
		description: 'Build and push Docker images to your registry.',
		icon: ContainerTruck02Icon,
		color: 'from-purple-500/20 to-purple-500/5',
		accent: 'text-purple-400',
		code: `name: docker-publish
triggers:
  - type: push
    tags: ["v*"]
steps:
  - name: Build Image
    run: docker build -t my-app .
  - name: Push to Registry
    run: docker push my-app:latest
`,
	},
];

export function WorkflowCreatePage() {
	const navigate = useNavigate();
	const [selectedTemplate, setSelectedTemplate] = useState('blank');
	const [secrets, setSecrets] = useState([{ key: '', value: '' }]);
	const [yamlCode, setYamlCode] = useState(TEMPLATES[0].code);
	const [isExpanded, setIsExpanded] = useState(false);

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
		const tmpl = TEMPLATES.find((t) => t.id === id);
		if (tmpl) setYamlCode(tmpl.code);
	};

	const addSecret = () => setSecrets([...secrets, { key: '', value: '' }]);
	const removeSecret = (idx: number) => {
		const newSecrets = [...secrets];
		newSecrets.splice(idx, 1);
		setSecrets(newSecrets);
	};

	return (
		<div className="max-w-[1280px] mx-auto px-6 pt-12 lg:pt-16 pb-32">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="mb-10"
			>
				<h1 className="text-4xl sm:text-5xl font-light tracking-tighter text-white mb-3">
					Create <span className="font-medium">Workflow</span>
				</h1>
				<p className="text-white/40 font-light">Define a new automated execution pipeline.</p>
			</motion.div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
				<div className="lg:col-span-6 space-y-10">
					{/* Section 1: Templates */}
					<motion.section
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
					>
						<div className="flex items-center gap-3 mb-5">
							<div className="size-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
								<span className="text-[12px] font-medium">1</span>
							</div>
							<h2 className="text-lg font-medium tracking-tight">Select Template</h2>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{TEMPLATES.map((tmpl, i) => {
								const isSelected = selectedTemplate === tmpl.id;
								return (
									<motion.div
										key={tmpl.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
										onClick={() => handleTemplateSelect(tmpl.id)}
										className={`relative group cursor-pointer rounded-2xl p-4 border transition-all duration-300 overflow-hidden ${
											isSelected
												? 'border-white/20 bg-white/[0.04] shadow-[0_0_20px_rgba(255,255,255,0.03)]'
												: 'border-white/5 bg-[#0c0c0c] hover:bg-white/[0.02] hover:border-white/10'
										}`}
									>
										{isSelected && (
											<div
												className={
													'absolute inset-0 bg-gradient-to-br ' +
													tmpl.color +
													' opacity-20 pointer-events-none'
												}
											/>
										)}

										<div className="flex items-center gap-3 mb-3 relative z-10">
											<div
												className={`size-8 rounded-xl flex items-center justify-center border transition-colors ${
													isSelected
														? 'bg-white/10 border-white/20 ' + tmpl.accent
														: 'bg-white/5 border-white/10 text-white/40 group-hover:text-white/70'
												}`}
											>
												<HugeiconsIcon icon={tmpl.icon} className="size-4" />
											</div>
											<h3
												className={`font-medium text-[14px] flex-1 transition-colors ${
													isSelected ? 'text-white' : 'text-white/80'
												}`}
											>
												{tmpl.name}
											</h3>
											<div
												className={`transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
											>
												<HugeiconsIcon
													icon={CheckmarkCircle02Icon}
													className="size-4 text-white/50"
												/>
											</div>
										</div>

										<p className="relative z-10 text-[12px] text-white/40 leading-relaxed font-light">
											{tmpl.description}
										</p>
									</motion.div>
								);
							})}
						</div>
					</motion.section>

					{/* Section 2: Metadata */}
					<motion.section
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
					>
						<div className="flex items-center gap-3 mb-5">
							<div className="size-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
								<span className="text-[12px] font-medium">2</span>
							</div>
							<h2 className="text-lg font-medium tracking-tight">Configuration</h2>
						</div>

						<div className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-5 sm:p-6 space-y-5">
							<div>
								<label className="text-[11px] uppercase tracking-wider font-semibold text-white/30 block mb-2 px-1">
									Workflow Name
								</label>
								<Input
									placeholder="e.g. production-deploy"
									className="h-10 font-mono text-[13px] bg-[#050505] border-white/10 hover:border-white/20 focus:border-emerald-500/50 focus:ring-emerald-500/20 rounded-xl transition-all"
								/>
							</div>

							<div>
								<label className="text-[11px] uppercase tracking-wider font-semibold text-white/30 block mb-2 px-1">
									Description<span className="text-white/20 font-normal ml-2">(Optional)</span>
								</label>
								<Input
									placeholder="What does this workflow do?"
									className="h-10 text-[13px] bg-[#050505] border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl transition-all text-white/80 font-light"
								/>
							</div>
						</div>
					</motion.section>

					{/* Section 3: Secrets List */}
					<motion.section
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
					>
						<div className="flex items-center justify-between mb-5">
							<div className="flex items-center gap-3">
								<div className="size-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50">
									<span className="text-[12px] font-medium">3</span>
								</div>
								<h2 className="text-lg font-medium tracking-tight">Environment Secrets</h2>
							</div>
							<Button
								variant="outline"
								size="sm"
								onClick={addSecret}
								className="h-8 rounded-full bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[12px]"
							>
								<HugeiconsIcon icon={PlusSignIcon} className="size-3 mr-1.5" />
								Add Secret
							</Button>
						</div>

						<div className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-1.5 space-y-0.5 overflow-hidden">
							{secrets.length === 0 ? (
								<div className="py-8 text-center flex flex-col items-center">
									<div className="size-10 rounded-full bg-white/5 flex items-center justify-center mb-2">
										<HugeiconsIcon icon={Settings01Icon} className="size-4 text-white/20" />
									</div>
									<p className="text-white/30 text-[13px]">No secrets configured.</p>
								</div>
							) : (
								secrets.map((sec, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: 'auto' }}
										className="group flex items-center gap-1.5 p-1.5 rounded-[14px] hover:bg-white/5 transition-colors"
									>
										<Input
											placeholder="KEY_NAME"
											className="h-10 flex-1 font-mono text-[12px] bg-white/5 border-transparent focus:border-white/20 rounded-lg"
											value={sec.key}
											onChange={(e) => {
												const next = [...secrets];
												next[i].key = e.target.value.toUpperCase();
												setSecrets(next);
											}}
										/>
										<Input
											placeholder="Value"
											type="password"
											className="h-10 flex-1 font-mono text-[12px] bg-white/5 border-transparent focus:border-white/20 rounded-lg"
											value={sec.value}
											onChange={(e) => {
												const next = [...secrets];
												next[i].value = e.target.value;
												setSecrets(next);
											}}
										/>
										<button
											onClick={() => removeSecret(i)}
											className="size-10 flex items-center justify-center rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
										>
											<HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
										</button>
									</motion.div>
								))
							)}
						</div>
					</motion.section>
				</div>

				<div className="lg:col-span-6 mt-8 lg:mt-0 relative h-[500px] lg:h-auto">
					<motion.div
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className="sticky top-20 flex flex-col h-full"
					>
						<div className="flex items-center justify-between mb-5">
							<div className="flex items-center gap-3">
								<div className="size-7 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500/70">
									<HugeiconsIcon icon={CodeIcon} className="size-3.5" />
								</div>
								<h2 className="text-lg font-medium tracking-tight">Workflow Definition</h2>
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
									<HugeiconsIcon icon={ArrowExpand02Icon} className="size-3 mr-1.5" />
									Expand
								</Button>
							</div>
						</div>

						{/* Editor */}
						<div className="w-full relative shadow-2xl shadow-emerald-500/5 ring-1 ring-white/10 rounded-xl overflow-hidden flex-1 max-h-[600px] min-h-[400px]">
							<YamlEditor
								value={yamlCode}
								onChange={(val) => setYamlCode(val)}
								height="100%"
								className="absolute inset-0"
							/>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Floating Action Bar */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.4 }}
				className="fixed bottom-6 right-6 lg:bottom-10 lg:right-10 z-50 flex"
			>
				<Button
					onClick={() => navigate('/dashboard')}
					className="h-14 px-8 rounded-full bg-white text-black hover:bg-white/90 font-medium tracking-wide text-[15px] shadow-[0_4px_30px_rgba(255,255,255,0.15)] transition-all hover:scale-105 active:scale-95 group border border-white/20"
				>
					Create Workflow
					<HugeiconsIcon
						icon={ArrowRight01Icon}
						className="size-4 ml-2 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
					/>
				</Button>
			</motion.div>

			{/* Fullscreen Editor Modal */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-1000 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
					>
						<motion.div
							initial={{ scale: 0.95, opacity: 0, y: 20 }}
							animate={{ scale: 1, opacity: 1, y: 0 }}
							exit={{ scale: 0.95, opacity: 0, y: 20 }}
							transition={{ type: 'spring', damping: 25, stiffness: 300 }}
							className="w-full h-full max-w-[1400px] bg-[#0c0c0c] border border-white/10 rounded-2xl shadow-[0_0_100px_rgba(16,185,129,0.1)] overflow-hidden flex flex-col"
						>
							<div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-white/[0.02]">
								<div className="flex items-center gap-3">
									<div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500/70">
										<HugeiconsIcon icon={CodeIcon} className="size-4" />
									</div>
									<h2 className="font-medium tracking-tight text-white/90">Workflow Definition</h2>
								</div>

								<div className="flex items-center gap-3">
									<Button
										variant="outline"
										size="sm"
										onClick={() => window.open('/docs', '_blank')}
										className="h-8 rounded-full bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[12px] px-3 font-medium"
									>
										<HugeiconsIcon icon={Book02Icon} className="size-3 mr-1.5" />
										Docs
									</Button>
									<div className="w-[1px] h-4 bg-white/10 mx-1" />
									<button
										onClick={() => setIsExpanded(false)}
										className="size-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:text-red-400 hover:border-red-500/30 transition-colors"
									>
										<HugeiconsIcon icon={Cancel01Icon} className="size-4" />
									</button>
								</div>
							</div>

							<div className="flex-1 relative bg-[#050505]">
								<YamlEditor
									value={yamlCode}
									onChange={(val) => setYamlCode(val)}
									height="100%"
									className="absolute inset-0"
								/>
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
