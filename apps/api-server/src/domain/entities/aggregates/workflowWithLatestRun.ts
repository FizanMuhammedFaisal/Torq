import type { Workflow } from '../workflow';
import type { WorkflowRun } from '../workflowRun';

/**
 * Domain Aggregate that combines a Workflow with its latest execution state.
 */
export class WorkflowWithLatestRun {
	private constructor(
		public readonly workflow: Workflow,
		public readonly latestRun: WorkflowRun | null,
	) { }

	static create({ workflow, latestRun }: { workflow: Workflow, latestRun: WorkflowRun | null }) {
		return new WorkflowWithLatestRun(workflow, latestRun)
	}
}
