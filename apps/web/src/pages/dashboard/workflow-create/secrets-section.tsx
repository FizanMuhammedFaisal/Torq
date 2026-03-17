import {
	Delete01Icon,
	PlusSignIcon,
	Settings01Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Secret {
	key: string;
	value: string;
}

interface SecretsSectionProps {
	secrets: Secret[];
	setSecrets: (secrets: Secret[]) => void;
	sectionDelay?: number;
}

export function SecretsSection({
	secrets,
	setSecrets,
	sectionDelay = 0.08,
}: SecretsSectionProps) {
	const addSecret = () => setSecrets([...secrets, { key: '', value: '' }]);
	const removeSecret = (idx: number) => {
		const newSecrets = [...secrets];
		newSecrets.splice(idx, 1);
		setSecrets(newSecrets);
	};

	return (
		<motion.section
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.6,
				delay: sectionDelay * 2,
				ease: [0.16, 1, 0.3, 1],
			}}
			className="relative z-10 pb-4"
		>
			<div className="flex items-center justify-between mb-5">
				<div className="flex items-center gap-4 bg-[#050505]">
					<div className="size-7 rounded-full bg-[#0c0c0c] border border-white/20 flex items-center justify-center text-white/70 shadow-[0_0_10px_rgba(255,255,255,0.05)] z-10">
						<span className="text-[12px] font-medium">3</span>
					</div>
					<h2 className="text-lg font-medium tracking-tight">
						Environment Secrets
					</h2>
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

			<div className="rounded-2xl border border-white/5 bg-[#0c0c0c] p-1.5 space-y-0.5 overflow-hidden ml-0 sm:ml-11">
				<AnimatePresence mode="popLayout">
					{secrets.length === 0 ? (
						<motion.div
							key="empty"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.2 }}
							className="py-10 text-center flex flex-col items-center"
						>
							<div className="size-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center mb-3">
								<HugeiconsIcon
									icon={Settings01Icon}
									className="size-5 text-white/20"
								/>
							</div>
							<p className="text-white/40 text-[13px] font-medium">
								No secrets configured
							</p>
							<p className="text-white/20 text-[12px] max-w-[200px] mt-1 mx-auto leading-relaxed">
								Add environment variables like API keys or tokens.
							</p>
						</motion.div>
					) : (
						secrets.map((sec, i) => (
							<motion.div
								key={i}
								layout
								initial={{ opacity: 0, y: -10, scale: 0.98 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, scale: 0.95 }}
								transition={{ type: 'spring', stiffness: 400, damping: 30 }}
								className="group flex items-center gap-1.5 p-1.5 rounded-[14px] hover:bg-white/5 transition-colors border border-transparent hover:border-white/5"
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
				</AnimatePresence>
			</div>
		</motion.section>
	);
}
