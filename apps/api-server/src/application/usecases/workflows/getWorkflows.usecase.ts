import { inject, injectable } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { IWorkflowRepository } from '@/application/port/repositories/workflowRepository.interface';
import type { IGetWorkflowsUseCase } from '@/application/port/usecases/workflows/getWorkflows.interface';
import type {
	GetWorkflowsInputDto,
	GetWorkflowsOutputDto,
	WorkflowRunStatus,
} from '@/application/dto/worflows/getWorkflows.dto';

@injectable()
export class GetWorkflowsUseCase implements IGetWorkflowsUseCase {
	constructor(
		@inject(TOKENS.WorkflowRepository)
		private readonly workflowRepository: IWorkflowRepository,
	) {}

	async execute(data: GetWorkflowsInputDto): Promise<GetWorkflowsOutputDto[]> {
		const workflows = await this.workflowRepository.getWorkflowsWithRuns(data.req.id, 10);

		return workflows.map((wf) => {
			// Runs fetched sorted by startedAt DESC
			const runs = wf.runs;
			const lastRun = runs.length > 0 ? runs[0] : null;

			let status: WorkflowRunStatus = 'idle';
			if (lastRun) {
				status = lastRun.status;
			}

			const health = runs.map((run) => {
				if (run.status === 'success') return true;
				if (run.status === 'failed') return false;
				return null;
			});

			return {
				id: wf.id,
				name: wf.name,
				description: wf.description,
				createdAt: wf.createdAt,
				health,
				lastRun: lastRun
					? {
							status: lastRun.status,
							startedAt: lastRun.startedAt,
							completedAt: lastRun.completedAt,
							duration: lastRun.duration,
							steps: lastRun.steps,
						}
					: null,
				status,
			};
		});
	}
}
