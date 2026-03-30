import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';
import type { IReconciler } from '../port/reconciler/reconciler.interface';
/**
 * The root reconciler refer Loop1 from core.md
 */
export class Reconciler implements IReconciler {
    reconcile(run: WorkflowRunSnapshot): Promise<void> {



    }
}
