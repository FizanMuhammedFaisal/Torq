import { create } from 'zustand';

export const TorqVersion = ['v1alpha', 'v1beta', 'latest'] as const;
export type TorqVersion = (typeof TorqVersion)[number];

interface VersionStore {
	activeVersion: TorqVersion;
	setActiveVersion: (version: TorqVersion) => void;
}

export const useVersionStore = create<VersionStore>((set) => ({
	activeVersion: 'v1alpha',
	setActiveVersion: (version) => set({ activeVersion: version }),
}));
