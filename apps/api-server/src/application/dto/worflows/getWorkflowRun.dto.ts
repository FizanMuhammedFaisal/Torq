import { RunStatus, TriggerType } from "@/domain/entities/workflowRun";
import { AuthUser } from "@/presentation/http/macros/auth.macro";
import z from "zod";


export const GetWorkflowRunInputQuerySchema = z.object({
    expand: z.preprocess(
        // The Preprocessor: If it's a string, wrap it in an array.
        (val) => (typeof val === 'string' ? [val] : val),
        z.array(z.enum(['latestRun', 'totalRuns', 'averageDuration'])).optional(),
    ),
});

export interface GetWorkflowRunInputDto {
    expand?: z.infer<typeof GetWorkflowRunInputQuerySchema>['expand'];
    req: AuthUser;
}

export interface GetWorkflowRunOutputDto {
    data: {
        id: string,
        workflowId: string,
        status: RunStatus,
        workflowName?: string,
        trigger: TriggerType,
        steps: number,
        completedAt?: Date,
        durationMs?: number,
    }
    meta: {
        totalItems: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
}


