import {
	Alert01Icon,
	InformationCircleIcon,
	Tick02Icon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { motion } from 'motion/react';
import hotToast, {
	Toaster as HotToaster,
	resolveValue,
	type Toast,
	type ToastOptions,
} from 'react-hot-toast';

export const toast = {
	success: (msg: string, opts?: ToastOptions) => hotToast.success(msg, opts),
	error: (msg: string, opts?: ToastOptions) => hotToast.error(msg, opts),
	loading: (msg: string, opts?: ToastOptions) => hotToast.loading(msg, opts),
	info: (msg: string, opts?: ToastOptions) => hotToast.custom(msg, opts),
	dismiss: hotToast.dismiss,
};

function ToastCard({ t }: { t: Toast }) {
	// Dynamic glow and border coloring based on toast type
	const activeColorRaw =
		t.type === 'success'
			? '16, 185, 129' // emerald-500
			: t.type === 'error'
				? '248, 113, 113' // red-400
				: t.type === 'loading'
					? '16, 185, 129' // primary green
					: '255, 255, 255'; // standard blank

	const glowColor = `rgba(${activeColorRaw}, 0.15)`;
	const borderColor = `rgba(${activeColorRaw}, 0.25)`;

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(5px)' }}
			animate={{
				opacity: t.visible ? 1 : 0,
				scale: t.visible ? 1 : 0.95,
				y: t.visible ? 0 : 20,
				filter: t.visible ? 'blur(0px)' : 'blur(5px)',
			}}
			transition={{ type: 'spring', stiffness: 450, damping: 25 }}
			className="pointer-events-auto relative flex min-w-[280px] max-w-[400px] items-center gap-3 overflow-hidden rounded-full bg-[#100D08] px-4 py-3 shadow-2xl will-change-transform"
			style={{
				border: `1px solid ${borderColor}`,
				boxShadow: `0 24px 48px -12px rgba(0,0,0,0.5), 0 0 24px -4px ${glowColor}, inset 0 1px 0 0 rgba(255,255,255,0.06)`,
			}}
		>
			{/* Icon Container */}
			<div className="flex shrink-0 items-center justify-center">
				{t.type === 'loading' && (
					<div className="relative flex size-[22px] items-center justify-center">
						<motion.span
							animate={{ rotate: 360 }}
							transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
							className="absolute inset-0 rounded-full border-[2.5px] border-primary/20 border-t-primary"
						/>
						<motion.span
							animate={{ rotate: -360 }}
							transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
							className="absolute inset-[4px] rounded-full border-[2px] border-primary/20 border-b-primary"
						/>
					</div>
				)}
				{t.type === 'success' && (
					<div className="flex size-[22px] items-center justify-center rounded-full bg-primary/20 text-primary ring-1 ring-primary/30 ring-inset">
						<HugeiconsIcon
							icon={Tick02Icon}
							className="size-[14px]"
							strokeWidth={3}
						/>
					</div>
				)}
				{t.type === 'error' && (
					<div className="flex size-[22px] items-center justify-center rounded-full bg-red-400/20 text-red-400 ring-1 ring-red-400/30 ring-inset">
						<HugeiconsIcon
							icon={Alert01Icon}
							className="size-[14px]"
							strokeWidth={3}
						/>
					</div>
				)}
				{t.type === 'blank' && (
					<div className="flex size-[22px] items-center justify-center rounded-full bg-white/10 text-white/50 ring-1 ring-white/10 ring-inset">
						<HugeiconsIcon
							icon={InformationCircleIcon}
							className="size-[14px]"
							strokeWidth={2.5}
						/>
					</div>
				)}
			</div>

			<div className="flex min-w-0 flex-1 flex-col justify-center">
				<span className="truncate text-[13.5px] font-medium text-white/90">
					{resolveValue(t.message, t)}
				</span>
			</div>
		</motion.div>
	);
}

export function Toaster() {
	return (
		<HotToaster position="bottom-right" toastOptions={{ duration: 4000 }}>
			{(t) => <ToastCard t={t} />}
		</HotToaster>
	);
}
