import z from 'zod';
import type { AuthUser } from '@/presentation/http/macros/auth.macro';

export const TriggerWorkflowRunSchema = z.object({
	version: z.number().int().optional(),
});

export type TriggerWorkflowRunInputDto = z.infer<typeof TriggerWorkflowRunSchema> & {
	workflowId: string;
	req: AuthUser;
};

export interface TriggerWorkflowRunOutputDto {
	runId: string;
	workflowId: string;
	status: string;
}
