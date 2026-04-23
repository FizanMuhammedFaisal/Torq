import type {
    StreamRunLogsInputDTO,
    StreamRunLogsOutputDTO,
} from '@/application/dto/runs/streamRunLogs';
import type { IEventBus } from '@/application/port/services/eventBus.interface';
import type { IStreamRunLogsUseCase } from '@/application/port/usecases/runs/streamRunLogs.interface';
import { TOKENS } from '@/config/di/tokens';
import { BadRequst } from '@/domain/errors/BadRequestError';
import { inject, injectable } from 'tsyringe';

@injectable()
export class StreamRunLogsUseCase implements IStreamRunLogsUseCase {
    constructor(
        @inject(TOKENS.EventBus) private eventBus: IEventBus,
    ) { }

    async *execute(data: StreamRunLogsInputDTO): AsyncGenerator<StreamRunLogsOutputDTO> {
        const streamKey = `logs:run:${data.runId}:job:${data.jobId}`;
        let cursor = data.cursorId;

        yield { event: 'PING', id: 'ping', data: '' };

        try {
            if (data.type === 'READ_FROM') {

                for await (const batch of this.eventBus.streamEvents(streamKey, data.abort, cursor)) {
                    const messages = batch;
                    for (let i = 0; i < messages.length; i++) {
                        const entry = messages[i];
                        cursor = entry.id;
                        const log = entry.fields.log;
                        if (typeof log !== 'string') continue;
                        yield { id: entry.id, data: log, event: 'LOG' };
                    }
                }
                // Stream ended naturally (STREAM_END detected or already ended)
                if (!data.abort.aborted) {
                    yield { event: 'STREAM_DONE', id: 'stream-done', data: '' };
                }
            } else if (data.type === 'READ_BEFORE') {
                if (!data.cursorId) {
                    throw new BadRequst('Read input not given');
                }
                const logs = await this.eventBus.getEventsBefore(streamKey, data.cursorId, 100);
                for (let i = 0; i < logs.length; i++) {
                    if (data.abort?.aborted) break;
                    const entry = logs[i];
                    cursor = entry.id;
                    const log = entry.fields.log;
                    if (typeof log !== 'string') continue;
                    yield { id: entry.id, data: log, event: 'LOG' };
                }
                // END = "this batch is done"
                yield { event: 'END', id: 'end', data: '' };
                // Check if the overall stream is also done
                if (await this.eventBus.isStreamEnded(streamKey)) {
                    yield { event: 'STREAM_DONE', id: 'stream-done', data: '' };
                }
            } else if (data.type === 'READ_FULL') {
                outer: for await (const logsChunks of this.eventBus.getAllEvents(streamKey)) {
                    for (let i = 0; i < logsChunks.length; i++) {
                        if (data.abort?.aborted) break outer;
                        const entry = logsChunks[i];
                        const log = entry.fields.log;
                        if (typeof log !== 'string') continue;
                        yield { id: entry.id, data: log, event: 'LOG' };
                    }
                }
                yield { event: 'END', id: 'end', data: '' };
                if (await this.eventBus.isStreamEnded(streamKey)) {
                    yield { event: 'STREAM_DONE', id: 'stream-done', data: '' };
                }
            }
        } catch (error) {
            throw new BadRequst('HANG UP');
        }
    }
}
