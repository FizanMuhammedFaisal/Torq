import type { Variants } from 'motion/react';

export const fieldVariants: Variants = {
	hidden: { opacity: 0, y: 6 },
	visible: () => ({
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.16,
			delay: 0.08,
			ease: [0.25, 1, 0.5, 1],
		},
	}),
};

export const stepVariants: Variants = {
	enter: { opacity: 0 },
	center: {
		opacity: 1,
		transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
	},
	exit: { opacity: 0, transition: { duration: 0.15 } },
};
