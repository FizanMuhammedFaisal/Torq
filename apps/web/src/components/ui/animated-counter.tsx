import { useEffect, useRef } from 'react';
import { motion, useInView, useSpring, useTransform } from 'motion/react';

// Configuration for the spring physics used in the Apple-like counter
const SPRING_CONFIG = { damping: 30, stiffness: 400, mass: 1 };

function Digit({ value }: { value: number }) {
	const animatedValue = useSpring(0, SPRING_CONFIG);

	useEffect(() => {
		animatedValue.set(value);
	}, [animatedValue, value]);

	// Height of each digit slot. Must match the line-height/font-size of the container
	// using 1em relative to the container for standard scaling
	return (
		<span className="relative inline-flex flex-col items-center justify-start overflow-hidden text-inherit tabular-nums leading-none">
			{/* Invisible placeholder for sizing the container width properly */}
			<span className="invisible opacity-0 px-0.5">8</span>

			{/* The sliding column of numbers */}
			<motion.div
				className="absolute inset-x-0 top-0 flex flex-col items-center justify-start pointer-events-none"
				style={{
					y: useTransform(animatedValue, (latest) => `-${latest * 10}%`),
				}}
			>
				{/* Map digits 0 through 9 */}
				{[...Array(10)].map((_, i) => (
					<span
						key={`digit-face-${i}`}
						className="flex h-[1em] w-full items-center justify-center shrink-0"
					>
						{i}
					</span>
				))}
			</motion.div>
		</span>
	);
}

export function AnimatedCounter({
	value,
	className = '',
}: {
	value: number | string;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);
	const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

	// Convert value to string to parse out individual characters (digits, letters, chars)
	const valueStr = typeof value === 'number' ? value.toLocaleString() : String(value);

	// For the initial scroll effect mimicking the counter starting from 0,
	// we only trigger the actual final value when the component comes into view.
	// We pass `isInView ? digit : 0` so it visibly spins up from 0 to the target number.

	let digitIndex = 0; // tracking actual digit positions from right-to-left for place values

	return (
		<span ref={ref} className={`inline-flex items-center leading-none ${className}`}>
			{valueStr.split('').map((char, i) => {
				// If it's not a number (e.g. comma, decimal), just render it static
				if (Number.isNaN(parseInt(char, 10))) {
					return (
						<span
							key={`static-${i}-${char}`}
							className="inline-flex items-center text-inherit opacity-80"
						>
							{char}
						</span>
					);
				}

				const digit = parseInt(char, 10);
				const place = digitIndex++;

				return <Digit key={`digit-col-${place}`} value={isInView ? digit : 0} />;
			})}
		</span>
	);
}
