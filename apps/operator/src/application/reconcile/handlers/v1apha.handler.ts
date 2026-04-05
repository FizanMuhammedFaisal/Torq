import type { IReconciliationHandler } from '@/application/port/reconciler/reconciliationHandler.interface';
import type { ISpecRepository } from '@/application/port/repository/spec.interface';
import { TOKENS } from '@/config/di/tokens';
import type { WorkflowRunSnapshot } from '@/domain/entities/workflowRunSnapshot';
import { logger } from '@/infrastructure/logger/logger';
import { inject, injectable } from 'tsyringe';

@injectable()
export class V1AlphaReconciliationHandler implements IReconciliationHandler {
	constructor(@inject(TOKENS.SpecRepository) private specRepository: ISpecRepository) { }
	async reconcile(run: WorkflowRunSnapshot): Promise<void> {
		// get the spec from api server
		const spec = await this.specRepository.getSpec(run.spec.workflowId, run.spec.versionId);
		if (!spec) {
			// TODO: Retry mechanish and updation of status to failed after retry
			logger.error({ workflowRunId: run.spec.versionId }, 'Failed to fetch spec from repository');
		} else {

			//  sort them topologically , get the steps that i can run without
			// depedecy run them in parallell. 
			//

		}
		// make secret and schedule jobs
	}
}
