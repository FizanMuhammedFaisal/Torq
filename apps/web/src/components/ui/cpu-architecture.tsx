import { cn } from '@/lib/utils';
import React from 'react';

export interface CpuArchitectureSvgProps {
	className?: string;
	width?: string | number;
	height?: string | number;
	text?: string;
	showCpuConnections?: boolean;
	lineMarkerSize?: number;
	animateText?: boolean;
	animateLines?: boolean;
	animateMarkers?: boolean;
}

const CpuArchitecture = ({
	className,
	width = '100%',
	height = '100%',
	text = 'Torq Engine',
	showCpuConnections = true,
	animateText = true,
	lineMarkerSize = 12,
	animateLines = true,
	animateMarkers = true,
}: CpuArchitectureSvgProps) => {
	// A collection of large paths coming from the absolute edges to the center box
	// The viewBox is 0 0 800 400. Center is at x: 400, y: 200.
	// The chip is 240x120, centered at 400, 200 -> x: 280-520, y: 140-260
	const paths = [
		// Top edges
		{
			id: 't1',
			d: 'M 350 0 L 350 80 Q 350 100 370 100 L 400 100 L 400 140',
			dur: '5s',
			delay: '0s',
			color: '#0ea5e9',
		},
		{ id: 't2', d: 'M 450 0 L 450 140', dur: '3.5s', delay: '1s', color: '#8b5cf6' },

		// Bottom edges
		{
			id: 'b1',
			d: 'M 320 400 L 320 350 Q 320 330 340 330 L 400 330 L 400 260',
			dur: '4s',
			delay: '0.5s',
			color: '#3b82f6',
		},
		{ id: 'b2', d: 'M 480 400 L 480 260', dur: '3s', delay: '2s', color: '#6366f1' },

		// Left edges
		{ id: 'l1', d: 'M 0 160 L 280 160', dur: '4s', delay: '0.2s', color: '#0ea5e9' },
		{
			id: 'l2',
			d: 'M 0 240 L 100 240 Q 120 240 120 220 L 120 200 L 280 200',
			dur: '5s',
			delay: '1.5s',
			color: '#8b5cf6',
		},

		// Right edges
		{ id: 'r1', d: 'M 800 180 L 520 180', dur: '3.8s', delay: '1.2s', color: '#3b82f6' },
		{
			id: 'r2',
			d: 'M 800 220 L 700 220 Q 680 220 680 240 L 680 250 L 520 250',
			dur: '4.5s',
			delay: '0.8s',
			color: '#6366f1',
		},
	];

	return (
		<svg
			className={cn('text-muted-foreground', className)}
			width={width}
			height={height}
			viewBox="0 0 800 400"
			aria-labelledby="cpu-title"
			preserveAspectRatio="xMidYMid slice"
		>
			<title id="cpu-title">{text} Architecture</title>
			<defs>
				{/* Dark Apple-style subtle drop shadow */}
				<filter id="chip-shadow" x="-20%" y="-20%" width="140%" height="140%">
					<feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#000000" floodOpacity="0.8" />
				</filter>

				{/* Glow for the animated data packets */}
				<filter id="light-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="4" result="blur" />
					<feComposite in="SourceGraphic" in2="blur" operator="over" />
				</filter>

				{/* Elegant Text Gradient */}
				<linearGradient id="text-shimmer" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="#9ca3af">
						<animate attributeName="offset" values="-2; -1; 0" dur="8s" repeatCount="indefinite" />
					</stop>
					<stop offset="25%" stopColor="#ffffff">
						<animate attributeName="offset" values="-1; 0; 1" dur="8s" repeatCount="indefinite" />
					</stop>
					<stop offset="50%" stopColor="#9ca3af">
						<animate attributeName="offset" values="0; 1; 2" dur="8s" repeatCount="indefinite" />
					</stop>
				</linearGradient>

				{/* Dot markers at start/end of lines */}
				<marker
					id="pipe-marker"
					viewBox="0 0 10 10"
					refX="5"
					refY="5"
					markerWidth={lineMarkerSize}
					markerHeight={lineMarkerSize}
				>
					<circle cx="5" cy="5" r="2" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
				</marker>
			</defs>

			{/* Render Thick Paths (Pipes) */}
			<g
				stroke="#27272a"
				fill="none"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
				markerStart="url(#pipe-marker)"
			>
				{paths.map((p) => (
					<path key={p.id} id={p.id} d={p.d} />
				))}
			</g>

			{/* Render Inner Glow for Pipes to give them a modern dark UI feel */}
			<g stroke="#3f3f46" fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
				{paths.map((p) => (
					<path key={`inner-${p.id}`} d={p.d} opacity="0.4" />
				))}
			</g>

			{/* Render Animated Lights moving along the pipes */}
			<g>
				{paths.map((p) => (
					<circle key={`light-${p.id}`} r="4" fill={p.color} filter="url(#light-glow)">
						{animateLines && (
							<animateMotion dur={p.dur} begin={p.delay} repeatCount="indefinite">
								<mpath href={`#${p.id}`} />
							</animateMotion>
						)}
					</circle>
				))}
			</g>

			{/* Center CPU Chip (240x120, centered at 400,200) */}
			<g transform="translate(280, 140)">
				{/* CPU Connectors (Pins) */}
				{showCpuConnections && (
					<g fill="#3f3f46">
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
						<rect x="240" y="105" width="6" height="10" rx="2" />
					</g>
				)}

				{/* Main Dark Chip Body */}
				<rect
					x="0"
					y="0"
					width="240"
					height="120"
					rx="20"
					fill="#09090b"
					stroke="#18181b"
					strokeWidth="2"
					filter="url(#chip-shadow)"
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
					stroke="#27272a"
					strokeWidth="1"
					opacity="0.5"
				/>

				{/* CPU Text - Standard Capitalization */}
				<text
					x="120"
					y="68"
					fontSize="24"
					fontFamily="system-ui, -apple-system, sans-serif"
					fill={animateText ? 'url(#text-shimmer)' : '#e4e4e7'}
					fontWeight="500"
					textAnchor="middle"
					letterSpacing="0.05em"
				>
					{text}
				</text>
			</g>
		</svg>
	);
};

export { CpuArchitecture };
