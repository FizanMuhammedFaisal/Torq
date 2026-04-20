export interface V1AlphaSteps {
	index: number;
	run: string;
}

export class V1AlphaTorqJob {
	constructor(
		public id: string,
		// K8s UID of the WorkflowRun CRD — used as the log-stream key
		public workflowRunId: string,
		// DNS name of the WorkflowRun CRD — used by JobWatcher to patch step status
		public workflowRunName: string,
		public workflowId: string,
		public versionId: string,
		public torqVersion: string,
		public identityId: string,
		public image: string,
		public steps: V1AlphaSteps[],
		public needs: string[],
		public envs: Record<string, string>,
		public secrets: SecretRef[],
		public namespace: string,
	) { }
}

export interface SecretRef {
	name: string;
	key: string;
	envVar: string;
}