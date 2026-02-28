import type { WorkflowStatus } from './types';

export const statusConfig: Record<
	WorkflowStatus,
	{ label: string; color: string; bg: string }
> = {
	idle: {
		label: 'Idle',
		color: 'rgba(161,161,170,1)',
		bg: 'rgba(161,161,170,0.1)',
	},
	queued: {
		label: 'Queued',
		color: 'rgba(234,179,8,1)',
		bg: 'rgba(234,179,8,0.1)',
	},
	running: {
		label: 'Running',
		color: 'rgba(59,130,246,1)',
		bg: 'rgba(59,130,246,0.1)',
	},
	success: {
		label: 'Passed',
		color: 'rgba(16,185,129,1)',
		bg: 'rgba(16,185,129,0.1)',
	},
	failed: {
		label: 'Failed',
		color: 'rgba(239,68,68,1)',
		bg: 'rgba(239,68,68,0.1)',
	},
};
