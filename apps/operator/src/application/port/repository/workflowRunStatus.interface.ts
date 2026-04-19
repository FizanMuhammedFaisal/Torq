import type { RunPhase, StepState } from '@/domain/entities/workflowRunSnapshot';

export interface IWorkflowRunStatusRepository {
	/**
	 * Patch the full status subresource of a WorkflowRun CRD.
	 * Called by V1AlphaReconciliationHandler after each scheduling pass.
	 */
	patchStatus(params: {
		name: string;
		namespace: string;
		phase: RunPhase;
		steps: Record<string, StepState>;
		startedAt?: string;
		completedAt?: string;
		reason?: string;
		observedGeneration: number;
	}): Promise<void>;

	/**
	 * Patch a single step inside status.steps via read-modify-write.
	 * Called by JobWatcher when a K8s Job transitions to Complete or Failed.
	 * Triggers a CRD MODIFIED event → CRDWatcher → Reconciler re-runs.
	 */
	patchStepStatus(params: {
		name: string;
		namespace: string;
		stepName: string;
		stepState: StepState;
	}): Promise<void>;

	/**
	 * Remove a named finalizer from a WorkflowRun CRD.
	 * Called by CleanUpService once all cleanup is done.
	 * Allows Kubernetes to proceed with actual deletion.
	 */
	removeFinalizer(name: string, namespace: string, finalizerName: string): Promise<void>;
}
