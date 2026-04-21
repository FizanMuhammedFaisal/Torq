import z from 'zod';

export const StreamRunLogsSchema = z.object({
	runId: z.string(),
});

export type StreamRunLogsInputDTO = z.infer<typeof StreamRunLogsSchema> & {
	abort: AbortSignal;
};
export type StreamRunLogsOutputDTO = {
	event: 'LOG' | 'STATUS';
	id: string;
	data: string;
};
