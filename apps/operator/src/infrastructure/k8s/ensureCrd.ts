import { ApiException } from '@kubernetes/client-node';
import { apiExtensionsClient } from './client';
import { CRD_DEFINITION, CRDName } from './CrdDefenition';
import { logger } from '../logger/logger';

export async function EnsureCrd() {
	try {
		// https://kubernetes-client.github.io/javascript/classes/ApiextensionsV1Api.html#readCustomResourceDefinition
		await apiExtensionsClient.readCustomResourceDefinition({
			name: CRDName,
		});
		logger.info('CRD already exists, skipping creation');
	} catch (err) {
		if (err instanceof ApiException) {
			logger.error({ 'CRD Ensure Error': err });
			if (err.code !== 404) {
				// something other than not-found — real error
				throw err;
			}
		}
		throw err;
	}
	logger.info('Registering WorkflowRun CRD...');
	await apiExtensionsClient.createCustomResourceDefinition(CRD_DEFINITION);

	await waitForCRDReady();
}
async function waitForCRDReady() {
	const start = Date.now();
	const maxWaitMs = 30_000;
	while (Date.now() - start < maxWaitMs) {
		const { status } = await apiExtensionsClient.readCustomResourceDefinitionStatus({
			name: CRDName,
		});

		const established = status?.conditions?.find(
			(c) => c.type === 'Established' && c.status === 'True',
		);

		if (established) return;

		await sleep(500);
	}

	throw new Error('CRD did not become ready within 30 seconds');
}

function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
