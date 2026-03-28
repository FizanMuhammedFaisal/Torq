import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';
import type { IReconciler } from '../port/reconciler/reconciler.interface';

export class Reconciler implements IReconciler {
    reconcile(run: WorkflowRunSnapshot): Promise<void> {



    }
}
