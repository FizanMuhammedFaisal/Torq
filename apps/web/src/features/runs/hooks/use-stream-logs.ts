import { useEffect, useMemo, useRef } from 'react';
import { runService } from '../service/run.service';
import { useLogsStore, selectLogs, selectPhase, selectCursor } from '@/store/logs';
import type { LogLine } from '@/store/logs';


export function useStreamLogs(runId: string, jobId: string) {
	const key = useMemo(() => `${runId}:${jobId}`, [runId, jobId]);


	const logs = useLogsStore((s) => selectLogs(s, key));
	const phase = useLogsStore((s) => selectPhase(s, key));
	const cursor = useLogsStore((s) => selectCursor(s, key));

	// Guard against React StrictMode double-fire
	const isRunningRef = useRef(false);

	useEffect(() => {
		if (!runId || !jobId) return;

		// StrictMode guard: if already running for this key, skip
		if (isRunningRef.current) return;
		isRunningRef.current = true;

		const ac = new AbortController();

		const run = async () => {
			const store = useLogsStore.getState;

			// Check if we already have cached logs from a previous expansion
			const existingLogs = store().entries[key];
			const hasCachedLogs = existingLogs && existingLogs.length > 0;

			let historyResult: 'END' | 'STREAM_DONE' | undefined;

			// history logs
			if (!hasCachedLogs) {
				store().setPhase(key, 'history');

				historyResult = await runService.streamLogs(
					{ runId, jobId, type: 'READ_FULL' },
					(batch) => {
						const lines: LogLine[] = batch.map((e) => ({
							id: e.id,
							message: e.data,
						}));
						useLogsStore.getState().batchAppend(key, lines);
					},
					ac.signal,
				);
			}

			if (ac.signal.aborted) return;

			// If the stream is already done (job finished), skip live tail entirely
			if (historyResult === 'STREAM_DONE') {
				useLogsStore.getState().setPhase(key, 'done');
				return;
			}

			// live tail
			const liveCursor = useLogsStore.getState().cursors[key];
			store().setPhase(key, 'live');

			const liveResult = await runService.streamLogs(
				{ runId, jobId, type: 'READ_FROM', cursorId: liveCursor },
				(batch) => {
					const lines: LogLine[] = batch.map((e) => ({
						id: e.id,
						message: e.data,
					}));
					useLogsStore.getState().batchAppend(key, lines);
				},
				ac.signal,
			);

			// If READ_FROM ends naturally (STREAM_DONE from server)
			if (!ac.signal.aborted && liveResult === 'STREAM_DONE') {
				useLogsStore.getState().setPhase(key, 'done');
			}
		};

		run().catch((err) => {
			if (err.name === 'AbortError') return;
			console.error('[useStreamLogs] error:', err);
			useLogsStore.getState().setPhase(key, 'error');
		});

		return () => {
			ac.abort();
			isRunningRef.current = false;
		};
	}, [runId, jobId, key]);

	return { logs, phase, cursor };
}
