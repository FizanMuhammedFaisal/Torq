
import type { TorqJob } from '@/domain/entities/job/job';
import { V1AlphaJobBuilder } from '@/infrastructure/k8s/jobs/handlers/v1Alpha.handler';
import { describe, expect, it } from 'bun:test';

const baseJob: TorqJob = {
	id: 'test',
	workflowRunId: 'run-abc123-uid',
	workflowRunName: 'run-my-workflow',
	torqVersion: 'v1alpha',
	workflowId: 'ULID',
	versionId: 'ULID',
	image: 'node:20-alpine',
	namespace: 'torq-system',
	steps: [
		{ index: 0, run: 'npm ci' },
		{ index: 1, run: 'npm test' },
	],
	needs: [],
	envs: { NODE_ENV: 'test' },
	secrets: [],
};
const builder = new V1AlphaJobBuilder();

describe('metadata', () => {
    it('sets managed-by label', () => {
        const job = builder.buildJob(baseJob);
        expect(job.metadata?.labels?.['app.kubernetes.io/managed-by']).toBe('torq');
    });

    it('name is DNS-1123 compliant', () => {
        const job = builder.buildJob(baseJob);
        expect(job.metadata?.name).toMatch(/^[a-z0-9-]{1,63}$/);
    });
});