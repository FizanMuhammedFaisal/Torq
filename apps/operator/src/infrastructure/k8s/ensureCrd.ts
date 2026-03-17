import { ApiException } from '@kubernetes/client-node';
import { apiExtensionsClient } from './client';
import { CRD_DEFINITION, CRDName } from './CrdDefenition';
import { logger } from '../logger/logger';
import { injectable } from 'tsyringe';


interface ICRDManager {
	ensureCrd(): Promise<void>
}
@injectable()
export class CRDManager implements ICRDManager {

	async ensureCrd() {
		try {
			// https://kubernetes-client.github.io/javascript/classes/ApiextensionsV1Api.html#readCustomResourceDefinition
			await apiExtensionsClient.readCustomResourceDefinition({
				name: CRDName,
			});
			logger.info('CRD already exists, skipping creation');
		} catch (err) {
			if (err instanceof ApiException && err.code === 404) {
				logger.info('CRD not found, creating...');
			} else {
				throw err; // real error
			}
		}
		try {
			await apiExtensionsClient.createCustomResourceDefinition(CRD_DEFINITION);
		} catch (err) {
			if (err instanceof ApiException && err.code === 409) {
				logger.info('CRD already created by another instance');
			} else {
				throw err;
			}
		}

		await this.waitForCRDReady();
	}
	private async waitForCRDReady() {
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

			await this.sleep(500);
		}

		throw new Error('CRD did not become ready within 30 seconds');
	}

	private sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
}