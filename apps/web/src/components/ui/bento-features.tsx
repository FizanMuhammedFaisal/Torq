import { motion } from 'motion/react';
import type React from 'react';
import { cn } from '@/lib/utils';

// Common Card Wrapper
function BentoCard({
	title,
	desc,
	className,
	children,
}: {
	title: string;
	desc: string;
	className?: string;
	children?: React.ReactNode;
}) {
	return (
		<div
			className={cn(
				'group relative overflow-hidden rounded-2xl border border-white/5 bg-white/1 transition-all duration-200 hover:bg-white/2 hover:border-white/10 flex flex-col',
				className,
			)}
		>
			<div className="flex-1 overflow-hidden relative border-b border-white/5 bg-linear-to-b from-white/2 to-transparent">
				{children}
			</div>
			<div className="p-6">
				<h3 className="text-base font-semibold text-white/90 tracking-tight mb-2">{title}</h3>
				<p className="text-sm text-white/40 leading-relaxed font-normal">{desc}</p>
			</div>
		</div>
	);
}

function WorkflowGraphic() {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05)_0%,transparent_70%)]">
			<svg
				className="w-full h-full max-w-[240px] drop-shadow-[0_0_15px_rgba(16,185,129,0.15)]"
				viewBox="0 0 240 100"
				fill="none"
			>
				<title>DAG Execution</title>
				{/* Background Grid Lines */}
				<path
					d="M 0 50 L 240 50"
					stroke="#ffffff"
					strokeOpacity="0.02"
					strokeWidth="1"
					strokeDasharray="4 4"
				/>
				<path
					d="M 120 0 L 120 100"
					stroke="#ffffff"
					strokeOpacity="0.02"
					strokeWidth="1"
					strokeDasharray="4 4"
				/>

				{/* Base DAG Paths */}
				<g
					stroke="#ffffff"
					strokeOpacity="0.1"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<path d="M 30 50 L 70 20 L 170 20 L 210 50" />
					<path d="M 30 50 L 70 80 L 170 80 L 210 50" />
					<path d="M 70 20 L 120 50 L 170 80" />
					<path d="M 70 80 L 120 50 L 170 20" />
				</g>

				{/* Animated Laser Pulses (Filter removed for performance) */}
				<g strokeLinecap="round" strokeLinejoin="round">
					<path
						d="M 30 50 L 70 20 L 170 20 L 210 50"
						stroke="#10b981"
						strokeWidth="2.5"
						strokeDasharray="15 200"
						strokeDashoffset="0"
					>
						<animate
							attributeName="stroke-dashoffset"
							values="215; -200"
							dur="2s"
							repeatCount="indefinite"
						/>
					</path>
					<path
						d="M 30 50 L 70 80 L 170 80 L 210 50"
						stroke="#0ea5e9"
						strokeWidth="2.5"
						strokeDasharray="15 200"
						strokeDashoffset="0"
					>
						<animate
							attributeName="stroke-dashoffset"
							values="215; -200"
							dur="2s"
							begin="0.5s"
							repeatCount="indefinite"
						/>
					</path>
					<path
						d="M 70 20 L 120 50 L 170 80"
						stroke="#10b981"
						strokeWidth="2.5"
						strokeDasharray="15 200"
						strokeDashoffset="0"
					>
						<animate
							attributeName="stroke-dashoffset"
							values="215; -200"
							dur="2s"
							begin="1s"
							repeatCount="indefinite"
						/>
					</path>
					<path
						d="M 70 80 L 120 50 L 170 20"
						stroke="#0ea5e9"
						strokeWidth="2.5"
						strokeDasharray="15 200"
						strokeDashoffset="0"
					>
						<animate
							attributeName="stroke-dashoffset"
							values="215; -200"
							dur="2s"
							begin="1.5s"
							repeatCount="indefinite"
						/>
					</path>
				</g>

				{/* Nodes */}
				{[
					[30, 50],
					[70, 20],
					[70, 80],
					[120, 50],
					[170, 20],
					[170, 80],
					[210, 50],
				].map(([x, y]) => (
					<g key={`${x}-${y}`}>
						<circle
							cx={x}
							cy={y}
							r="8"
							className="fill-black stroke-white/20 stroke-2 group-hover:stroke-primary transition-colors duration-200"
						/>
						<circle
							cx={x}
							cy={y}
							r="3"
							className="fill-white/40 group-hover:fill-primary transition-colors duration-200"
						/>
					</g>
				))}
			</svg>
		</div>
	);
}

// 2. Live Logs (Mini Terminal)
function LogsGraphic() {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-6">
			<div className="w-full max-w-[200px] rounded-lg border border-white/10 bg-black/50 overflow-hidden shadow-2xl relative">
				<div className="h-6 border-b border-white/10 flex items-center px-3 gap-1.5 bg-white/2">
					<div className="w-2 h-2 rounded-full bg-white/20" />
					<div className="w-2 h-2 rounded-full bg-white/20" />
					<div className="w-2 h-2 rounded-full bg-white/20" />
				</div>
				<div className="p-3 text-[10px] font-mono leading-relaxed text-white/30 h-[80px] overflow-hidden relative">
					<motion.div
						animate={{ y: [-20, -40, -60, -80] }}
						transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
						className="space-y-1"
					>
						<p>[info] Starting workflow execution</p>
						<p className="text-primary/70">[ok] Checking out repository</p>
						<p>[info] Installing dependencies</p>
						<p className="text-white/50 group-hover:text-primary transition-colors duration-200">
							npm install completed
						</p>
						<p className="text-primary/70">[ok] Build complete</p>
						<p>[info] Deploying to edge</p>
						<p className="text-primary/70">[ok] Deployment successful</p>
						<p>[info] Workflow finished</p>
					</motion.div>
				</div>
			</div>
		</div>
	);
}

// 3. Artifacts (Data Vault)
function ArtifactsGraphic() {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-6">
			<div className="relative w-32 h-32 flex items-center justify-center">
				<motion.div
					className="absolute top-0 flex flex-col items-center justify-center gap-2"
					initial={{ y: 0 }}
					animate={{ y: [0, 8, 0] }}
					transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
				>
					<div className="w-8 h-10 rounded-sm border border-primary/50 bg-primary/10 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center group-hover:border-primary group-hover:bg-primary/20 transition-colors duration-200">
						<div className="w-4 h-1 bg-primary/50 rounded-full group-hover:bg-primary transition-colors duration-200" />
					</div>
				</motion.div>
				<motion.div
					className="absolute top-0 flex flex-col items-center justify-center gap-2"
					initial={{ y: 0 }}
					animate={{ y: [0, -8, 0] }}
					transition={{ duration: 4, delay: 2, repeat: Infinity, ease: 'easeInOut' }}
				>
					<div className="w-8 h-10 rounded-sm border border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(14,165,233,0.3)] flex items-center justify-center group-hover:border-cyan-500 group-hover:bg-cyan-500/20 transition-colors duration-200">
						<div className="w-4 h-1 bg-cyan-500/50 rounded-full group-hover:bg-cyan-400 transition-colors duration-200" />
					</div>
				</motion.div>

				<div className="absolute bottom-4 w-28 h-16">
					<svg
						viewBox="0 0 100 50"
						fill="none"
						className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
					>
						<title>Artifact Vault</title>
						{/* Back wall */}
						<path
							d="M 20 20 L 80 20 L 80 40 L 20 40 Z"
							fill="#ffffff"
							fillOpacity="0.02"
							stroke="#ffffff"
							strokeOpacity="0.1"
						/>
						{/* Front wall (backdrop-blur removed for performance) */}
						<path
							d="M 10 30 L 90 30 L 90 50 L 10 50 Z"
							className="fill-black/90 stroke-white/20 group-hover:stroke-primary/50 transition-colors duration-200"
						/>
						<path d="M 10 30 L 20 20" stroke="#ffffff" strokeOpacity="0.1" />
						<path d="M 90 30 L 80 20" stroke="#ffffff" strokeOpacity="0.1" />
						<path d="M 10 50 L 20 40" stroke="#ffffff" strokeOpacity="0.1" />
						<path d="M 90 50 L 80 40" stroke="#ffffff" strokeOpacity="0.1" />
						{/* Glowing inner floor */}
						<path
							d="M 20 40 L 80 40 L 90 50 L 10 50 Z"
							className="fill-primary/5 group-hover:fill-primary/20 transition-colors duration-200"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}

// 4. Run History (Timeline)
function HistoryGraphic() {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-6">
			<div className="w-full flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
				<div className="w-8 h-1 rounded-full bg-primary/20" />
				<div className="w-2.5 h-2.5 rounded-full bg-primary" />
				<div className="w-12 h-1 rounded-full bg-primary/20" />
				<div className="w-2.5 h-2.5 rounded-full bg-red-500" />
				<div className="w-8 h-1 rounded-full bg-white/10" />
				<div className="w-2.5 h-2.5 rounded-full bg-white/20" />
			</div>
		</div>
	);
}

// 5. Self-Host (Server Rack)
function SelfHostGraphic() {
	return (
		<div className="absolute inset-0 flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_bottom,rgba(16,185,129,0.05)_0%,transparent_60%)]">
			<div className="relative w-full max-w-[220px] h-[100px] flex flex-col justify-between">
				{[0, 1, 2].map((i) => (
					<motion.div
						key={i}
						className="w-full h-7 rounded-lg border border-white/10 bg-black/50 shadow-lg flex items-center px-4 justify-between group-hover:border-primary/30 transition-colors duration-200 relative overflow-hidden"
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.2 }}
					>
						{/* Subtle Server Vents */}
						<div className="flex gap-1.5 opacity-30">
							<div className="w-1 h-3 bg-white/50 rounded-full" />
							<div className="w-1 h-3 bg-white/50 rounded-full" />
							<div className="w-1 h-3 bg-white/50 rounded-full" />
							<div className="w-1 h-3 bg-white/50 rounded-full" />
						</div>

						{/* Blinking Data Lights */}
						<div className="flex items-center gap-2">
							<div className="w-1.5 h-1.5 rounded-full bg-white/20" />
							<motion.div
								className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)]"
								animate={{ opacity: [0.4, 1, 0.4] }}
								transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
							/>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}

export function FeatureBentoGrid() {
	return (
		<section className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 py-24">
			<motion.div
				initial={{ opacity: 0, y: 15 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: '-50px' }}
				transition={{ duration: 0.5 }}
				className="text-center mb-16"
			>
				<h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
					Built for execution speed
				</h2>
				<p className="text-base text-white/40 max-w-lg mx-auto">
					Every tool you need to run, monitor, and scale your workflows. Perfectly sized for clarity
					and speed.
				</p>
			</motion.div>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 auto-rows-[200px] gap-4">
				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-50px' }}
					transition={{ duration: 0.5, delay: 0 }}
					className="sm:col-span-2 md:col-span-4"
				>
					<BentoCard
						title="Workflow Engine"
						desc="Define multi-step pipelines with DAG-based execution. Runs independently with retry logic."
						className="h-full"
					>
						<WorkflowGraphic />
					</BentoCard>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-50px' }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="sm:col-span-1 md:col-span-2 md:row-span-2"
				>
					<BentoCard
						title="Live Logs"
						desc="Stream logs in real-time via WebSocket. Filter and search."
						className="h-full"
					>
						<LogsGraphic />
					</BentoCard>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-50px' }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="sm:col-span-1 md:col-span-2"
				>
					<BentoCard title="Run History" desc="Audit trail of every execution." className="h-full">
						<HistoryGraphic />
					</BentoCard>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-50px' }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="sm:col-span-1 md:col-span-2"
				>
					<BentoCard title="Artifacts" desc="Download build outputs instantly." className="h-full">
						<ArtifactsGraphic />
					</BentoCard>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 15 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: '-50px' }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="sm:col-span-2 md:col-span-6"
				>
					<BentoCard
						title="Self-Hosted"
						desc="Deploy Torq Core securely on your own infrastructure. Total control over your data and execution environment."
						className="h-full"
					>
						<SelfHostGraphic />
					</BentoCard>
				</motion.div>
			</div>
		</section>
	);
}
