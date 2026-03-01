import { HugeiconsIcon } from '@hugeicons/react';
import { Book02Icon, CodeIcon, Settings01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

/* ── Content ─── */
const DOCS_SECTIONS = [
	{
		id: 'core-concepts',
		title: 'Core Concepts',
		icon: Book02Icon,
		content: `
A Torq workflow is defined by a single YAML file. It describes the **metadata**, the **events** that trigger the workflow, and the **steps** that execute when triggered.

Torq executes these steps in isolated environments, resolving dependencies automatically to run tasks in parallel whenever possible.
		`.trim(),
		code: null,
	},
	{
		id: 'triggers',
		title: 'Triggers (Events)',
		icon: Settings01Icon,
		content: `
Triggers define *when* a workflow should run. You can specify multiple triggers for a single workflow. Supported event types include \`push\`, \`pull_request\`, \`schedule\`, and \`manual\`.

You can filter these events further by specifying target branches or tags.
		`.trim(),
		code: `triggers:
  - type: push
    branches: [main, release/*]
  - type: schedule
    cron: "0 0 * * *"
  - type: manual`,
	},
	{
		id: 'steps',
		title: 'Steps & Execution',
		icon: CodeIcon,
		content: `
Steps are the actual commands executed by the runner. Each step runs sequentially by default but can be heavily customized using dependencies, timeouts, and retry policies.

A step must contain a \`name\` and a \`run\` block containing the shell command.
		`.trim(),
		code: `steps:
  - name: Build Application
    run: npm run build
    timeout: 300s
    retry:
      max_attempts: 3
      delay: 5s`,
	},
];

export function DocsPage() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
			{/* Header */}
			<header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#0a0a0a]/80 backdrop-blur-xl">
				<div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-6">
					<button
						onClick={() => navigate(-1)}
						className="size-9 rounded-full flex items-center justify-center border border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.04] transition-colors"
					>
						<HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
					</button>
					<div className="font-semibold tracking-wide text-[15px]">
						Torq <span className="text-white/40 font-normal">Docs</span>
					</div>
				</div>
			</header>

			{/* Main Content */}
			<main className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="max-w-2xl mb-24"
				>
					<h1 className="text-5xl sm:text-7xl font-light tracking-tighter text-white mb-6">
						The Torq <br /> <span className="text-emerald-400 font-medium">DSL Guide</span>
					</h1>
					<p className="text-lg text-white/40 leading-relaxed font-light">
						A comprehensive guide to defining declarative, high-performance execution pipelines
						using the Torq YAML specification.
					</p>
				</motion.div>

				<div className="space-y-32">
					{DOCS_SECTIONS.map((section) => (
						<motion.section
							key={section.id}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: '-100px' }}
							transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
							className="relative group"
						>
							<div className="absolute -inset-x-6 -inset-y-12 bg-white/[0.02] rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

							<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative">
								{/* Text Side */}
								<div className="lg:col-span-5 flex flex-col pt-4">
									<div className="size-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/50 mb-6 group-hover:bg-white/[0.06] group-hover:text-emerald-400 transition-colors duration-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">
										<HugeiconsIcon icon={section.icon} className="size-6" />
									</div>
									<h2 className="text-3xl font-medium tracking-tight mb-4">{section.title}</h2>
									<div className="text-[15px] text-white/50 leading-relaxed space-y-4">
										{section.content.split('\n\n').map((paragraph, i) => (
											<p key={i}>{paragraph}</p>
										))}
									</div>
								</div>

								{/* Code Side */}
								{section.code && (
									<div className="lg:col-span-7 relative">
										<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-1000 pointer-events-none" />

										<div className="relative rounded-2xl border border-white/[0.08] bg-[#0c0c0c] overflow-hidden shadow-2xl">
											{/* MacOS Window Header */}
											<div className="h-12 border-b border-white/[0.04] bg-white/[0.02] flex items-center px-4 gap-2">
												<div className="flex gap-1.5">
													<div className="size-3 rounded-full bg-red-500/20 border border-red-500/50" />
													<div className="size-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
													<div className="size-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
												</div>
												<div className="flex-1 text-center font-mono text-[11px] text-white/30 tracking-wider">
													workflow.yaml
												</div>
											</div>
											<div className="p-6 overflow-x-auto text-[13px] font-mono leading-relaxed text-white/80">
												<pre>
													<code>{section.code}</code>
												</pre>
											</div>
										</div>
									</div>
								)}
							</div>
						</motion.section>
					))}
				</div>
			</main>
		</div>
	);
}
