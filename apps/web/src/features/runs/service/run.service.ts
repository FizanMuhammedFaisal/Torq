import { apiClient } from '@/api/client';
import { API_ROUTES } from '@/api/routes';
import { useAuthStore } from '@/store/auth';
import type { GetRunsResponse } from '../schema/api.dto';

export interface LogEntry {
	id: string;
	event: 'LOG' | 'STATUS' | 'END' | 'PING' | 'STREAM_DONE';
	data: string;
}

// How often we flush the buffer to the consumer
const FLUSH_INTERVAL_MS = 100;

export const runService = {
	list: async (params?: { workflowId?: string }): Promise<GetRunsResponse> => {
		const { data } = await apiClient.get<GetRunsResponse>(API_ROUTES.RUNS.BASE, { params });
		return data;
	},

	/**
	 * Opens a POST SSE stream and delivers parsed entries in batches.
	 *
	 * - `onBatch` receives an array of entries every ~100ms 
	 * - Pass an `AbortSignal` to kill the TCP connection on cleanup
	 * - The returned promise resolves when the stream ends naturally
	 */
	streamLogs: async (
		params: {
			runId: string;
			jobId: string;
			type: 'READ_FULL' | 'READ_FROM' | 'READ_BEFORE';
			cursorId?: string;
		},
		onBatch: (entries: LogEntry[]) => void,
		signal: AbortSignal,
	): Promise<'END' | 'STREAM_DONE' | undefined> => {
		const { jwt } = useAuthStore.getState();
		const baseUrl = import.meta.env.VITE_BASE_URL;

		const response = await fetch(`${baseUrl}${API_ROUTES.RUNS.RUN_LOGS}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
			},
			body: JSON.stringify(params),
			signal,
		});

		if (!response.ok) {
			throw new Error(`Failed to stream logs: ${response.status} ${response.statusText}`);
		}

		const reader = response.body?.getReader();
		if (!reader) return;

		const decoder = new TextDecoder();
		let sseBuffer = '';

		// batching,
		let pendingEntries: LogEntry[] = [];
		const flushTimer = setInterval(() => {
			if (pendingEntries.length > 0) {
				onBatch(pendingEntries);
				pendingEntries = [];
			}
		}, FLUSH_INTERVAL_MS);

		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				sseBuffer += decoder.decode(value, { stream: true });

				// SSE messages are separated by double newlines
				const messages = sseBuffer.split('\n\n');
				sseBuffer = messages.pop() || '';

				for (const message of messages) {
					if (!message.trim()) continue;

					const entry = parseSSEMessage(message);
					if (!entry) continue;

					// Server signals: skip PING (just a keepalive)
					if (entry.event === 'PING') continue;

					// Server signals end of this batch
					if (entry.event === 'END' || entry.event === 'STREAM_DONE') {
						if (pendingEntries.length > 0) {
							onBatch(pendingEntries);
							pendingEntries = [];
						}
						clearInterval(flushTimer);
						reader.releaseLock();
						// Return the event so the caller knows why we stopped
						return entry.event as 'END' | 'STREAM_DONE';
					}

					pendingEntries.push(entry);
				}
			}

			// Final flush for any remaining entries
			if (pendingEntries.length > 0) {
				onBatch(pendingEntries);
				pendingEntries = [];
			}
		} finally {
			clearInterval(flushTimer);
			reader.releaseLock();
		}
	},
};

/**
 * Parses a single SSE message block into a LogEntry.
 *
 * Expected format from Elysia:
 *   event: LOG
 *   data: <log line string>
 *   id: <redis stream id>
 */
function parseSSEMessage(message: string): LogEntry | null {
	let event: string | undefined;
	let data: string | undefined;
	let id: string | undefined;

	for (const line of message.split('\n')) {
		if (line.startsWith('event:')) {
			event = line.slice(6).trim();
		} else if (line.startsWith('data:')) {
			data = line.slice(5).trim();
		} else if (line.startsWith('id:')) {
			id = line.slice(3).trim();
		}
	}

	if (!id || data === undefined) return null;

	return {
		id,
		event: (event as 'LOG' | 'STATUS') || 'LOG',
		data,
	};
}
