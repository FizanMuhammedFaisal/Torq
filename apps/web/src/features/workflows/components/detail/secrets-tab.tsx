import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
	PlusSignIcon,
	Delete01Icon,
	SecurityLockIcon,
	Loading03Icon,
	KeyIcon,
	EyeIcon,
	ViewOffSlashIcon,
} from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { useGetSecrets } from '@/features/workflows/hooks/use-get-secrets';
import { useUpsertSecrets } from '@/features/workflows/hooks/use-upsert-secrets';
import { useRevealSecret } from '@/features/workflows/hooks/use-reveal-secret';
import { formatRelativeTime } from '@/lib/format';

export function SecretsTab({ workflowId }: { workflowId: string }) {
	const { data: existingSecrets, isLoading, isError } = useGetSecrets(workflowId);
	const { mutate: upsertSecrets, isPending } = useUpsertSecrets(workflowId);

	const { mutate: revealSecret } = useRevealSecret(workflowId);

	const [isAdding, setIsAdding] = useState(false);
	const [newKey, setNewKey] = useState('');
	const [newValue, setNewValue] = useState('');
    const [revealedValues, setRevealedValues] = useState<Record<string, string>>({});
	const [revealingIds, setRevealingIds] = useState<Set<string>>(new Set());

	const secrets = existingSecrets ?? [];
	const hasSecrets = secrets.length > 0;

	const handleToggleReveal = (id: string, key: string) => {
		if (revealedValues[id]) {
			setRevealedValues((prev) => {
				const next = { ...prev };
				delete next[id];
				return next;
			});
			return;
		}

		setRevealingIds((prev) => new Set(prev).add(id));
		revealSecret(key, {
			onSuccess: (data) => {
				setRevealedValues((prev) => ({ ...prev, [id]: data.value }));
                setRevealingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
			},
			onError: (error: any) => {
				toast.error(error.response?.data?.message || 'Failed to reveal secret');
                setRevealingIds((prev) => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
			},
		});
	};

	const handleSaveNew = () => {
		if (!newKey.trim() || !newValue.trim()) return;
		upsertSecrets(
			[{ key: newKey.trim().toUpperCase(), value: newValue.trim() }],
			{
				onSuccess: () => {
					setIsAdding(false);
					setNewKey('');
					setNewValue('');
				},
			},
		);
	};

	return (
		<div className="space-y-12 pb-12">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="flex flex-col items-center justify-center text-center pt-4"
			>

				<h3 className="text-[13px] font-semibold tracking-widest uppercase text-white/40 mb-2 flex items-center gap-2">
					<HugeiconsIcon icon={KeyIcon as object} className="size-4 text-emerald-400" />
					Encrypted Secrets
				</h3>
				<div className="flex items-baseline gap-1">
					<span className="text-5xl sm:text-6xl font-light tracking-tighter text-white">
						{isLoading ? '—' : secrets.length}
					</span>
					<span className="text-xl sm:text-2xl font-medium text-white/40 mb-1">
						{secrets.length === 1 ? 'secret' : 'secrets'}
					</span>
				</div>
				<p className="text-[13px] text-white/30 mt-3 max-w-sm">
					Environment variables injected into workflow runs. Values are encrypted at rest
					and never exposed in logs.
				</p>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, delay: 0.1 }}
				className="rounded-3xl border border-white/4 bg-neutral-950 relative overflow-hidden"
				style={{ boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.02)' }}
			>
				<div className="flex items-center justify-between p-6 pb-0">
					<div>
						<h3 className="text-[16px] font-semibold text-white/90">Secret Store</h3>
						<p className="text-[13px] text-white/40 mt-1">
							Manage your workflow's environment variables
						</p>
					</div>
					{!isAdding && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsAdding(true)}
							className="h-9 rounded-full bg-white/5 border-white/8 text-white/60 hover:text-white hover:bg-white/10 transition-all"
						>
							<HugeiconsIcon
								icon={PlusSignIcon as object}
								className="size-4 mr-2"
							/>
							Add Secret
						</Button>
					)}
				</div>

				<div className="p-6">
					{isLoading ? (
						<div className="py-16 flex flex-col items-center justify-center gap-3">
							<HugeiconsIcon
								icon={Loading03Icon as object}
								className="size-6 text-white/20 animate-spin"
							/>
							<span className="text-[13px] text-white/30">
								Loading secrets…
							</span>
						</div>
					) : isError ? (
						<div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
							<div className="size-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
								<span className="text-amber-400 text-xl">!</span>
							</div>
							<p className="text-white/50 text-[14px] font-medium">
								Could not load secrets
							</p>
							<p className="text-white/25 text-[13px] max-w-xs">
								The API server may be unavailable. Secrets you add will still be
								saved.
							</p>
						</div>
					) : (
						<AnimatePresence mode="popLayout">
							{isAdding && (
								<motion.div
									key="add-form"
									layout
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: 'auto' }}
									exit={{ opacity: 0, height: 0 }}
									className="overflow-hidden mb-4"
								>
									<div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 relative overflow-hidden">
										<div className="absolute -right-16 -top-16 size-40 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
										<div className="relative z-10">
											<div className="flex items-center justify-between mb-4">
												<span className="text-[13px] font-semibold text-emerald-400 flex items-center gap-2">
													<HugeiconsIcon
														icon={PlusSignIcon as object}
														className="size-3.5"
													/>
													New Secret
												</span>
												<button
													type="button"
													onClick={() => {
														setIsAdding(false);
														setNewKey('');
														setNewValue('');
													}}
													className="text-[12px] text-white/40 hover:text-white transition-colors"
												>
													Cancel
												</button>
											</div>
											<div className="flex flex-col sm:flex-row gap-3">
												<Input
													placeholder="KEY_NAME"
													value={newKey}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
														setNewKey(e.target.value.toUpperCase())
													}
													className="h-11 flex-1 font-mono text-[13px] bg-black/50 border-white/10 focus:border-emerald-500/50 rounded-xl uppercase placeholder:text-white/20"
													autoFocus
												/>
												<Input
													placeholder="secret_value"
													type="password"
													value={newValue}
													onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
														setNewValue(e.target.value)
													}
													className="h-11 flex-1 font-mono text-[13px] bg-black/50 border-white/10 focus:border-emerald-500/50 rounded-xl placeholder:text-white/20"
												/>
												<Button
													onClick={handleSaveNew}
													disabled={
														isPending ||
														!newKey.trim() ||
														!newValue.trim()
													}
													className="h-11 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium w-full sm:w-auto transition-colors"
												>
													{isPending ? (
														<HugeiconsIcon
															icon={Loading03Icon as object}
															className="size-4 animate-spin"
														/>
													) : (
														'Save'
													)}
												</Button>
											</div>
										</div>
									</div>
								</motion.div>
							)}

							{!hasSecrets && !isAdding ? (
								<motion.div
									key="empty"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="py-12 text-center flex flex-col items-center"
								>
									<div className="size-14 rounded-full bg-white/3 border border-white/5 flex items-center justify-center mb-4">
										<HugeiconsIcon
											icon={SecurityLockIcon as object}
											className="size-6 text-white/15"
										/>
									</div>
									<p className="text-white/40 text-[14px] font-medium">
										No secrets configured
									</p>
									<p className="text-white/20 text-[13px] max-w-[300px] mt-2 leading-relaxed">
										Add environment variables that will be securely injected
										into every workflow run.
									</p>
									<Button
										variant="link"
										onClick={() => setIsAdding(true)}
										className="mt-5 text-emerald-400 hover:text-emerald-300"
									>
										Add your first secret →
									</Button>
								</motion.div>
							) : (
								<div className="space-y-2">
									{secrets.map((sec, i) => (
										<motion.div
											key={sec.id}
											layout
											initial={{ opacity: 0, y: -8 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: i * 0.04 }}
											className="group flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/4 hover:border-white/8 hover:bg-white/3 transition-all duration-200"
										>
											{/* Icon */}
											<div className="size-10 shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
												<HugeiconsIcon
													icon={KeyIcon as object}
													className="size-4 text-emerald-400"
												/>
											</div>

											{/* Key info */}
											<div className="flex-1 min-w-0">
												<div className="font-mono text-[13px] font-semibold text-white/90 truncate">
													{sec.key}
												</div>
												<div className="text-[11px] text-white/25 mt-0.5">
													Updated{' '}
													{formatRelativeTime(sec.updatedAt)}
												</div>
											</div>

											{/* Masked value */}
											<div className="hidden sm:flex items-center gap-2">
												<div className="h-8 flex items-center px-3 rounded-lg bg-black/30 border border-white/5 font-mono text-[12px] text-white/20 tracking-normal select-all overflow-hidden max-w-[200px]">
													{revealingIds.has(sec.id) ? (
                                                        <HugeiconsIcon icon={Loading03Icon as object} className="size-3 animate-spin mx-auto saturate-0 opacity-50" />
                                                    ) : revealedValues[sec.id] ? (
														<span className="text-emerald-400/90">{revealedValues[sec.id]}</span>
													) : (
														<span className="tracking-widest">••••••••</span>
													)}
												</div>
												<button
													type="button"
													onClick={() => handleToggleReveal(sec.id, sec.key)}
                                                    disabled={revealingIds.has(sec.id)}
													className="size-8 flex items-center justify-center rounded-lg text-white/20 hover:text-white/50 hover:bg-white/5 transition-colors disabled:opacity-50"
													title={
														revealedValues[sec.id]
															? 'Hide'
															: 'Show'
													}
												>
													<HugeiconsIcon
														icon={
															(revealedValues[sec.id]
																? ViewOffSlashIcon
																: EyeIcon) as object
														}
														className="size-4"
													/>
												</button>
											</div>

											{/* Delete */}
											<button
												type="button"
												className="size-8 shrink-0 flex items-center justify-center rounded-lg text-white/15 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
												title="Delete secret"
											>
												<HugeiconsIcon
													icon={Delete01Icon as object}
													className="size-4"
												/>
											</button>
										</motion.div>
									))}
								</div>
							)}
						</AnimatePresence>
					)}
				</div>
			</motion.div>
		</div>
	);
}
