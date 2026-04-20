import { ArrowLeft01Icon, SidebarLeftIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { TorqVersion } from '@/store/version-store';
import { useVersionStore } from '@/store/version-store';
import { TORQ_DOCS_REGISTRY } from '@/torqdocs';

export function DocsPage() {
	const navigate = useNavigate();
	const { activeVersion, setActiveVersion } = useVersionStore();
	const registry =
		TORQ_DOCS_REGISTRY[activeVersion] || TORQ_DOCS_REGISTRY['latest'];

	const [activePageId, setActivePageId] = useState(registry[0].id);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const activePage = registry.find((p) => p.id === activePageId) || registry[0];
	const ActiveComponent = activePage.component;

	return (
		<div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans flex flex-col">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-white/4 bg-zinc-950/80 backdrop-blur-xl shrink-0">
				<div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-6">
						<button
							type="button"
							onClick={() => navigate('/dashboard')}
							className="size-9 rounded-full flex items-center justify-center border border-white/8 text-white/40 hover:text-white hover:bg-white/4 transition-colors"
						>
							<HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
						</button>
						<div className="font-semibold tracking-wide text-[15px] flex items-center gap-3">
							<span className="text-white">Torq Docs</span>
							<Select
								value={activeVersion}
								onValueChange={(v) => setActiveVersion(v as TorqVersion)}
							>
								<SelectTrigger className="w-[100px] h-7 text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md ring-offset-0 focus:ring-0">
									<SelectValue placeholder="Version" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="v1alpha">v1alpha</SelectItem>
									<SelectItem value="v1beta">v1beta</SelectItem>
									<SelectItem value="latest">latest (v1beta)</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className={`size-9 rounded-md flex items-center justify-center border transition-colors hidden md:flex ${
							isSidebarOpen
								? 'bg-white/10 border-white/20 text-white'
								: 'border-white/8 text-white/40 hover:text-white hover:bg-white/4'
						}`}
						title="Toggle Sidebar"
					>
						<HugeiconsIcon icon={SidebarLeftIcon} className="size-4" />
					</button>
				</div>
			</header>

			<div className="flex-1 w-full max-w-[1400px] mx-auto flex items-start">
				{/* Sidebar */}
				<AnimatePresence initial={false}>
					{isSidebarOpen && (
						<motion.aside
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 280, opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							className="shrink-0 h-[calc(100vh-64px)] overflow-hidden border-r border-white/4 sticky top-16 hidden md:block"
						>
							<div className="w-[280px] p-6 h-full overflow-y-auto custom-scrollbar">
								<h3 className="text-[12px] font-bold text-white/30 uppercase tracking-widest mb-4 px-2">
									Documentation
								</h3>
								<nav className="space-y-1">
									{registry.map((page) => {
										const isActive = activePageId === page.id;
										return (
											<button
												type="button"
												key={page.id}
												onClick={() => setActivePageId(page.id)}
												className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-colors ${
													isActive
														? 'bg-emerald-500/10 text-emerald-400'
														: 'text-white/60 hover:text-white hover:bg-white/5'
												}`}
											>
												<HugeiconsIcon
													icon={page.icon}
													className={`size-4 ${isActive ? 'text-emerald-400' : 'text-white/40'}`}
												/>
												{page.label}
											</button>
										);
									})}
								</nav>
							</div>
						</motion.aside>
					)}
				</AnimatePresence>

				{/* Content Area */}
				<main className="flex-1 min-w-0 p-8 sm:p-12 lg:p-16 max-w-4xl">
					<AnimatePresence mode="wait">
						<motion.div
							key={activePageId}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3 }}
						>
							<ActiveComponent />
						</motion.div>
					</AnimatePresence>
				</main>
			</div>
		</div>
	);
}
