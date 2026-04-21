import type {
	StreamRunLogsInputDTO,
	StreamRunLogsOutputDTO,
} from '@/application/dto/runs/streamRunLogs';
import type { IStreamRunLogsUseCase } from '@/application/port/usecases/runs/streamRunLogs.interface';

export class StreamRunLogsUseCase implements IStreamRunLogsUseCase {
	async *execute(data: StreamRunLogsInputDTO): AsyncGenerator<StreamRunLogsOutputDTO> {
		// db check TODO
		//
	}
}
