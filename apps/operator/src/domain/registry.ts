export const Registry = {
	v1alpha: 'v1alpha',
} as const;

export type Registry = keyof typeof Registry;
