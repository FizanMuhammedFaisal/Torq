import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';

interface ConfigurationSectionProps {
	name: string;
	setName: (val: string) => void;
	nameTouched: boolean;
	setNameTouched: (val: boolean) => void;
	description: string;
	setDescription: (val: string) => void;
	sectionDelay?: number;
}

export function ConfigurationSection({
	name,
	setName,
	nameTouched,
	setNameTouched,
	description,
	setDescription,
	sectionDelay = 0.08,
}: ConfigurationSectionProps) {
	return (
		<motion.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.6,
				delay: sectionDelay,
				ease: [0.16, 1, 0.3, 1],
			}}
			className="relative"
		>
			<div className="flex items-center gap-4 mb-5">
				<div className="size-7 rounded-full bg-[#0c0c0c] border border-white/20 flex items-center justify-center text-white/70 shadow-[0_0_10px_rgba(255,255,255,0.05)] z-10">
					<span className="text-[12px] font-medium">2</span>
				</div>
				<h2 className="text-lg font-medium tracking-tight">Configuration</h2>
			</div>

			<div className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-5 sm:p-6 space-y-5 ml-0 sm:ml-11">
				<div>
					<label className="text-[11px] uppercase tracking-wider font-semibold text-white/30 block mb-2 px-1">
						Workflow Name
					</label>
					<Input
						placeholder="e.g. production-deploy"
						value={name}
						onChange={(e) => {
							setName(e.target.value);
							setNameTouched(true);
						}}
						onBlur={() => setNameTouched(true)}
						className={`h-10 font-mono text-[13px] bg-[#050505] rounded-xl transition-all ${
							nameTouched && !name.trim()
								? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
								: 'border-white/10 hover:border-white/20 focus:border-emerald-500/50 focus:ring-emerald-500/20'
						}`}
					/>
					{nameTouched && !name.trim() && (
						<motion.p
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							className="text-red-400 text-[12px] mt-1.5 px-1 font-medium"
						>
							A workflow name is required.
						</motion.p>
					)}
				</div>

				<div>
					<label className="text-[11px] uppercase tracking-wider font-semibold text-white/30 block mb-2 px-1">
						Description
						<span className="text-white/20 font-normal ml-2">(Optional)</span>
					</label>
					<Input
						placeholder="What does this workflow do?"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="h-10 text-[13px] bg-[#050505] border-white/10 hover:border-white/20 focus:border-white/30 rounded-xl transition-all text-white/80 font-light"
					/>
				</div>
			</div>
		</motion.section>
	);
}
