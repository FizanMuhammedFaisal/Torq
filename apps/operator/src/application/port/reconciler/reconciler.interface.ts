import type { WorkflowRunSnapshot } from "@/domain/entities/WorkflowRunSnapshot";

export interface IReconciler {
    reconcile(run: WorkflowRunSnapshot): Promise<void>
}