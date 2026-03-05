import { cn } from '@/lib/utils';

export interface TorqEngineProps {
	className?: string;
	text?: string;
	showCpuConnections?: boolean;
	animateText?: boolean;
	animateLines?: boolean;
}

const TorqEngine = ({
	className,
	text = 'Torq Engine',
	showCpuConnections = true,
	animateText = true,
	animateLines = true,
}: TorqEngineProps) => {
	// A collection of paths coming from the absolute edges to the center box
	// The viewBox is 0 0 2400 400. Center is at x: 1200, y: 200.
	// The chip is 240x120, centered at 1200, 200 -> x: 1080-1320, y: 140-260
	const paths = [
		// Top edges
		{
			id: 't1',
			d: 'M 900 0 L 900 80 Q 900 100 920 100 L 1130 100 Q 1150 100 1150 120 L 1150 140',
			dur: '4s',
			delay: '0s',
			color: '#10b981',
		}, // Primary Green
		{
			id: 't2',
			d: 'M 1450 0 L 1450 80 Q 1450 100 1430 100 L 1270 100 Q 1250 100 1250 120 L 1250 140',
			dur: '3.5s',
			delay: '1.5s',
			color: '#059669',
		}, // Darker Green

		// Bottom edges
		{
			id: 'b1',
			d: 'M 850 400 L 850 320 Q 850 300 870 300 L 1100 300 Q 1120 300 1120 280 L 1120 260',
			dur: '3.8s',
			delay: '0.5s',
			color: '#34d399',
		}, // Lighter Green
		{
			id: 'b2',
			d: 'M 1600 400 L 1600 340 Q 1600 320 1580 320 L 1300 320 Q 1280 320 1280 300 L 1280 260',
			dur: '4.5s',
			delay: '2s',
			color: '#10b981',
		},

		// Left edges
		{ id: 'l1', d: 'M 0 160 L 1080 160', dur: '3.5s', delay: '0.2s', color: '#0ea5e9' }, // Cyan
		{
			id: 'l2',
			d: 'M 0 300 L 980 300 Q 1000 300 1000 280 L 1000 220 Q 1000 200 1020 200 L 1080 200',
			dur: '5s',
			delay: '1s',
			color: '#10b981',
		},
		{ id: 'l3', d: 'M 0 240 L 1080 240', dur: '4.2s', delay: '2.5s', color: '#059669' },

		// Right edges
		{ id: 'r1', d: 'M 2400 180 L 1320 180', dur: '3s', delay: '0.8s', color: '#34d399' },
		{
			id: 'r2',
			d: 'M 2400 100 L 1420 100 Q 1400 100 1400 120 L 1400 200 Q 1400 220 1380 220 L 1320 220',
			dur: '4.5s',
			delay: '1.2s',
			color: '#10b981',
		},
		{
			id: 'r3',
			d: 'M 2400 340 L 1520 340 Q 1500 340 1500 320 L 1500 260 Q 1500 240 1480 240 L 1320 240',
			dur: '5s',
			delay: '0.4s',
			color: '#0ea5e9',
		}, // Cyan
	];

	return (
		<svg
			className={cn('text-muted-foreground w-full h-full', className)}
			viewBox="0 0 2400 400"
			aria-labelledby="cpu-title"
			preserveAspectRatio="xMidYMid slice"
		>
			<title id="cpu-title">{text} Architecture</title>
			<defs>
				{/* Performant Radial Gradient for Glow instead of feGaussianBlur */}
				<radialGradient id="chip-radial-glow" cx="50%" cy="50%" r="50%">
					<stop offset="0%" stopColor="oklch(0.60 0.13 163)" stopOpacity="0.4" />
					<stop offset="100%" stopColor="oklch(0.60 0.13 163)" stopOpacity="0" />
				</radialGradient>
			</defs>

			{/* Render Thick Paths (Pipes) without edge markers for infinity illusion */}
			<g stroke="#18181b" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
				{paths.map((p) => (
					<path key={p.id} id={p.id} d={p.d} />
				))}
			</g>

			{/* Render Inner Detail for Pipes to give them a modern dark UI feel */}
			<g stroke="#27272a" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
				{paths.map((p) => (
					<path key={`inner-${p.id}`} d={p.d} opacity="0.6" />
				))}
			</g>

			{/* Render Animated Lasers (Data Packets) moving sporadically along the pipes */}
			{/* Removed filter="url(#light-glow)" for massive performance gain */}
			<g fill="none" strokeWidth="3" strokeLinecap="round">
				{paths.map((p) => (
					<path
						key={`laser-${p.id}`}
						d={p.d}
						stroke={p.color}
						pathLength="100"
						strokeDasharray="8 800"
						strokeDashoffset="108"
					>
						{animateLines && (
							<animate
								attributeName="stroke-dashoffset"
								from="108"
								to="-100"
								dur={p.dur}
								begin={p.delay}
								repeatCount="indefinite"
							/>
						)}
					</path>
				))}
			</g>

			{/* Center CPU Chip (240x120, centered at 1200,200) */}
			<g transform="translate(1080, 140)">
				{/* CPU Connectors (Pins) */}
				{showCpuConnections && (
					<g fill="#27272a">
						{/* Top pins */}
						<rect x="65" y="-6" width="10" height="6" rx="2" />
						<rect x="165" y="-6" width="10" height="6" rx="2" />
						{/* Bottom pins */}
						<rect x="35" y="120" width="10" height="6" rx="2" />
						<rect x="195" y="120" width="10" height="6" rx="2" />
						{/* Left pins */}
						<rect x="-6" y="15" width="6" height="10" rx="2" />
						<rect x="-6" y="55" width="6" height="10" rx="2" />
						<rect x="-6" y="95" width="6" height="10" rx="2" />
						{/* Right pins */}
						<rect x="240" y="35" width="6" height="10" rx="2" />
						<rect x="240" y="75" width="6" height="10" rx="2" />
						<rect x="240" y="95" width="6" height="10" rx="2" />
					</g>
				)}

				{/* Primary Brand Glow behind the chip using performant radial gradient */}
				<rect x="-80" y="-80" width="400" height="280" rx="140" fill="url(#chip-radial-glow)" />

				{/* Main Dark Chip Body - removed SVG filter shadow, added standard fill */}
				<rect
					x="0"
					y="0"
					width="240"
					height="120"
					rx="20"
					fill="#09090b"
					stroke="#18181b"
					strokeWidth="2"
				/>

				{/* Glossy inner bevel (Apple Silicon style) */}
				<rect
					x="2"
					y="2"
					width="236"
					height="58"
					rx="18"
					fill="white"
					opacity="0.02"
					style={{ clipPath: 'inset(0 0 20% 0 round 18px 18px 0 0)' }}
				/>

				{/* Inner detail ring */}
				<rect
					x="16"
					y="16"
					width="208"
					height="88"
					rx="10"
					fill="none"
					stroke="#18181b"
					strokeWidth="1"
					opacity="0.8"
				/>

				{/* Pulsing Up and Down Torq Engine Text */}
				<text
					x="120"
					y="68"
					fontSize="24"
					className="font-sans tracking-tight fill-white"
					fontWeight="700"
					textAnchor="middle"
				>
					{text}
					{animateText && (
						<animate
							attributeName="opacity"
							values="0.4; 1; 0.4"
							dur="3s"
							repeatCount="indefinite"
						/>
					)}
				</text>
			</g>
		</svg>
	);
};

export { TorqEngine };
