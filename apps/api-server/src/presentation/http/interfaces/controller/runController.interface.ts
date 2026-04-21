import type { GetRunsOutputDto } from '@/application/dto/runs/getRuns.dto';
import type { AuthenticatedContext } from '../../macros/auth.macro';
import type { StreamRunLogsOutputDTO } from '@/application/dto/runs/streamRunLogs';

export interface IRunController {
	getRuns: (ctx: AuthenticatedContext) => Promise<GetRunsOutputDto>;
	streamRunLogs: (ctx: AuthenticatedContext) => AsyncGenerator<StreamRunLogsOutputDTO>;
}
