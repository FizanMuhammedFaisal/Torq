export interface Steps {
    index: number,
    run: string,
}

export class V1AlphaTorqJob {

    constructor(
        public id: string,
        public workflowRunId: string,
        public workflowId: string,
        public versionId: string,
        public torqVersion: string,
        public image: string,
        public steps: Steps[],
        public needs: string[],
        public envs: Record<string, string>,
        public secrets: SecretRef[],
        public namespace: string,


    ) { }
}

export interface SecretRef {
    name: string,
    key: string,
    envVar: string,
}