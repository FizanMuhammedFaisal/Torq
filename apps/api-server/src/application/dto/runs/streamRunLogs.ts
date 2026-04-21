import z from 'zod';

export const StreamRunLogsSchema = z.object({
	runId: z.string(),
	cursorId: z.string().optional(),
	jobId: z.string(),
	type: z.enum(['READ_FULL', "READ_FROM", "READ_BEFORE"])
});

export type StreamRunLogsInputDTO = z.infer<typeof StreamRunLogsSchema> & {
	abort: AbortSignal;
};
export type StreamRunLogsOutputDTO = {
	event: 'LOG' | 'STATUS';
	id: string;
	data: string;
};
