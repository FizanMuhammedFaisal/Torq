import type {
	StreamRunLogsInputDTO,
	StreamRunLogsOutputDTO,
} from '@/application/dto/runs/streamRunLogs';

export interface IStreamRunLogsUseCase {
	execute(data: StreamRunLogsInputDTO): AsyncGenerator<StreamRunLogsOutputDTO>;
}
