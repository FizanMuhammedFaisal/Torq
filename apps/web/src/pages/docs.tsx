import { useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, SidebarLeftIcon } from '@hugeicons/core-free-icons';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import { TORQ_DOCS_REGISTRY } from '@/torqdocs';

export function DocsPage() {
	const navigate = useNavigate();
	const [activePageId, setActivePageId] = useState(TORQ_DOCS_REGISTRY[0].id);
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	const activePage = TORQ_DOCS_REGISTRY.find((p) => p.id === activePageId) || TORQ_DOCS_REGISTRY[0];
	const ActiveComponent = activePage.component;

	return (
		<div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans flex flex-col">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-xl shrink-0">
				<div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-6">
						<button
							type="button"
							onClick={() => navigate('/dashboard')}
							className="size-9 rounded-full flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors"
						>
							<HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
						</button>
						<div className="font-semibold tracking-wide text-[15px] flex items-center gap-3">
							<span className="text-white">Torq Docs</span>
							<span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
								v1.2.0
							</span>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className={`size-9 rounded-md flex items-center justify-center border transition-colors hidden md:flex ${
							isSidebarOpen
								? 'bg-white/10 border-white/20 text-white'
								: 'border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.04]'
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
							className="shrink-0 h-[calc(100vh-64px)] overflow-hidden border-r border-white/[0.04] sticky top-16 hidden md:block"
						>
							<div className="w-[280px] p-6 h-full overflow-y-auto custom-scrollbar">
								<h3 className="text-[12px] font-bold text-white/30 uppercase tracking-widest mb-4 px-2">
									Documentation
								</h3>
								<nav className="space-y-1">
									{TORQ_DOCS_REGISTRY.map((page) => {
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
