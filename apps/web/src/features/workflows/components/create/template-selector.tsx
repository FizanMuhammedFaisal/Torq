import { CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { WorkflowTemplate } from '@/features/workflows/config/templates';
import type { TorqVersion } from '@/store/version-store';

interface TemplateSelectorProps {
	activeVersion: TorqVersion;
	setActiveVersion: (version: TorqVersion) => void;
	templates: WorkflowTemplate[];
	selectedTemplate: string;
	onSelect: (id: string) => void;
}

export function TemplateSelector({
	activeVersion,
	setActiveVersion,
	templates,
	selectedTemplate,
	onSelect,
}: TemplateSelectorProps) {
	return (
		<motion.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, delay: 0, ease: [0.16, 1, 0.3, 1] }}
			className="relative"
		>
			<div className="flex items-center justify-between gap-4 mb-5">
				<div className="flex items-center gap-4">
					<div className="size-7 rounded-full bg-neutral-950 border border-white/20 flex items-center justify-center text-white/70 shadow-[0_0_10px_rgba(255,255,255,0.05)] z-10">
						<span className="text-[12px] font-medium">1</span>
					</div>
					<h2 className="text-lg font-medium tracking-tight">
						Select Template
					</h2>
				</div>

				<Select
					value={activeVersion}
					onValueChange={(v) => setActiveVersion(v as TorqVersion)}
				>
					<SelectTrigger className="w-[120px] h-8 text-[12px] bg-neutral-950 border-white/10 rounded-lg">
						<SelectValue placeholder="Version" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="v1alpha">v1alpha</SelectItem>
						<SelectItem value="v1beta">v1beta</SelectItem>
						<SelectItem value="latest">latest (v1beta)</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-11">
				{templates.map((tmpl, i) => {
					const isSelected = selectedTemplate === tmpl.id;
					return (
						<motion.div
							key={tmpl.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 20,
								delay: i * 0.05,
							}}
							onClick={() => onSelect(tmpl.id)}
							className={`relative group cursor-pointer rounded-2xl p-4 border transition-all duration-500 ease-out overflow-hidden ${
								isSelected
									? 'border-white/20 bg-white/5 shadow-[0_0_20px_rgba(255,255,255,0.03)]'
									: 'border-white/5 bg-neutral-950 hover:bg-white/3 hover:border-white/10'
							}`}
						>
							<div
								className={
									'absolute inset-0 bg-linear-to-br pointer-events-none transition-opacity duration-500 ease-out ' +
									tmpl.color +
									' ' +
									(isSelected ? 'opacity-20' : 'opacity-0')
								}
							/>

							<div className="flex items-center gap-3 mb-3 relative z-10">
								<div
									className={`size-8 rounded-xl flex items-center justify-center border transition-all duration-500 ease-out ${
										isSelected
											? 'bg-white/10 border-white/20 ' + tmpl.accent
											: 'bg-white/5 border-white/10 text-white/40 group-hover:text-white/70'
									}`}
								>
									<HugeiconsIcon icon={tmpl.icon as any} className="size-4" />
								</div>
								<h3
									className={`font-medium text-[14px] flex-1 transition-colors duration-500 ease-out ${
										isSelected ? 'text-white' : 'text-white/80'
									}`}
								>
									{tmpl.name}
								</h3>
								<div
									className={`transition-opacity duration-500 ease-out ${isSelected ? 'opacity-100' : 'opacity-0'}`}
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
	);
}
