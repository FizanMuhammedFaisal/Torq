import type {
    StreamRunLogsInputDTO,
    StreamRunLogsOutputDTO,
} from '@/application/dto/runs/streamRunLogs';
import type { IEventBus } from '@/application/port/services/eventBus.interface';
import type { IStreamRunLogsUseCase } from '@/application/port/usecases/runs/streamRunLogs.interface';
import { TOKENS } from '@/config/di/tokens';
import { BadRequst } from '@/domain/errors/BadRequestError';
import { inject, injectable } from 'tsyringe';

type LogFields = {
    log: string;
    container: string;
    ts: string;
};

@injectable()
export class StreamRunLogsUseCase implements IStreamRunLogsUseCase {
    constructor(
        @inject(TOKENS.EventBus) private eventBus: IEventBus,
    ) { }

    async *execute(data: StreamRunLogsInputDTO): AsyncGenerator<StreamRunLogsOutputDTO> {
        const streamKey = `logs:run:${data.runId}:job:${data.jobId}`;
        let cursor = data.cursorId;

        try {
            if (data.type === 'READ_FROM') {
                // streamEvents manages its own per-session blocking connection
                for await (const batch of this.eventBus.streamEvents(streamKey, data.abort, cursor)) {
                    console.log("A batch")
                    console.log(batch)
                    for (const entry of batch) {
                        cursor = entry.id;
                        const logData = this.getLogData(entry.fields);
                        if (!logData) continue;
                        yield {
                            id: entry.id,
                            data: logData,
                            event: 'LOG',
                        } satisfies StreamRunLogsOutputDTO;
                    }
                }
            } else if (data.type === 'READ_BEFORE') {
                if (!data.cursorId) {
                    throw new BadRequst('Read input not given');
                }
                const logs = await this.eventBus.getEventsBefore(streamKey, data.cursorId, 100);
                for (const entry of logs) {
                    if (data.abort?.aborted) break;
                    cursor = entry.id;
                    const logData = this.getLogData(entry.fields);
                    if (!logData) continue;
                    yield {
                        id: entry.id,
                        data: logData,
                        event: 'LOG',
                    } satisfies StreamRunLogsOutputDTO;
                }
                yield { event: 'END', id: 'end', data: '' } satisfies StreamRunLogsOutputDTO;
            } else if (data.type === 'READ_FULL') {

                outer: for await (const logsChunks of this.eventBus.getAllEvents(streamKey)) {
                    console.log("A batch Full")
                    console.log(logsChunks)
                    for (const entry of logsChunks) {
                        if (data.abort?.aborted) break outer;

                        const logData = this.getLogData(entry.fields);
                        if (!logData) continue;

                        yield {
                            id: entry.id,
                            data: logData,
                            event: 'LOG',
                        } satisfies StreamRunLogsOutputDTO;
                    }
                }
                yield { event: 'END', id: 'end', data: '' } satisfies StreamRunLogsOutputDTO;
            }
        } catch (error) {
            throw new BadRequst('HANG UP');
        }
    }

    getLogData(data: Record<string, string>): string | null {
        if (!this.isValidLogFields(data)) return null;
        return data.log;
    }

    isValidLogFields(data: Record<string, string>): data is LogFields {
        return (
            typeof data.log === 'string' &&
            typeof data.container === 'string' &&
            typeof data.ts === 'string'
        );
    }
}
