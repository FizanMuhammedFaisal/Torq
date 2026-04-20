import type { Workflow } from '../workflow';
import type { WorkflowRun } from '../workflowRun';

/**
 * Domain Aggregate that combines a Workflow with its latest execution state.
 */
export class WorkflowWithLatestRun {
	private constructor(
		public readonly workflow: Workflow,
		public readonly latestRun: WorkflowRun | null,
		public readonly latestSpec: Record<string, unknown> | null = null,
	) {}

	static create({
		workflow,
		latestRun,
		latestSpec,
	}: {
		workflow: Workflow;
		latestRun: WorkflowRun | null;
		latestSpec?: Record<string, unknown> | null;
	}) {
		return new WorkflowWithLatestRun(workflow, latestRun, latestSpec ?? null);
	}
}
