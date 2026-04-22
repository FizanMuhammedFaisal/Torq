import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface LogLine {
	id: string;
	message: string;
}

export type StreamPhase = 'idle' | 'history' | 'live' | 'done' | 'error';

const EMPTY_LOGS: LogLine[] = [];

interface LogsState {
	entries: Record<string, LogLine[]>;
	cursors: Record<string, string>;
	phases: Record<string, StreamPhase>;
}

interface LogsActions {
	batchAppend: (key: string, lines: LogLine[]) => void;
	setCursor: (key: string, id: string) => void;
	setPhase: (key: string, phase: StreamPhase) => void;
	reset: (key: string) => void;
}

export const useLogsStore = create<LogsState & LogsActions>()(
	immer((set) => ({
		entries: {},
		cursors: {},
		phases: {},

		batchAppend: (key, lines) =>
			set((state) => {
				if (!state.entries[key]) {
					state.entries[key] = [];
				}
				state.entries[key].push(...lines);

				// Track the cursor from the last entry
				if (lines.length > 0) {
					state.cursors[key] = lines[lines.length - 1].id;
				}
			}),

		setCursor: (key, id) =>
			set((state) => {
				state.cursors[key] = id;
			}),

		setPhase: (key, phase) =>
			set((state) => {
				state.phases[key] = phase;
			}),

		reset: (key) =>
			set((state) => {
				delete state.entries[key];
				delete state.cursors[key];
				state.phases[key] = 'idle';
			}),
	}))
);

// Stable selectors — never return a new reference for empty state
export const selectLogs = (state: LogsState, key: string): LogLine[] =>
	state.entries[key] || EMPTY_LOGS;

export const selectPhase = (state: LogsState, key: string): StreamPhase =>
	state.phases[key] || 'idle';

export const selectCursor = (state: LogsState, key: string): string | undefined =>
	state.cursors[key];
