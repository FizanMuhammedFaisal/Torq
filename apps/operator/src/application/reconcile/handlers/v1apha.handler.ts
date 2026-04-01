import type { IReconciliationHandler } from '@/application/port/reconciler/reconciliationHandler.interface';
import type { ISpecRepository } from '@/application/port/repository/spec.interface';
import { TOKENS } from '@/config/di/tokens';
import type { WorkflowRunSnapshot } from '@/domain/entities/WorkflowRunSnapshot';
import { inject } from 'tsyringe';

export class V1AlphaReconciliationHandler implements IReconciliationHandler {
    constructor(@inject(TOKENS.SpecRepository) private specRepository: ISpecRepository) { }
    reconcile(run: WorkflowRunSnapshot): Promise<void> {
        // get the speac ffom api server
        // TODO might need ot update here
        const spec = this.specRepository.getSpec(run.metadata.uid)
        // make secrect and schedule jobs
    }
}
