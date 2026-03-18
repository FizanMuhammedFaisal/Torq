// https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
// https://kubernetes.io/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/
import {
	ApiException,
	type ApiextensionsV1ApiCreateCustomResourceDefinitionRequest,
} from '@kubernetes/client-node'
import { apiExtensionsClient } from './client'

import { logger } from '../logger/logger'
import { injectable } from 'tsyringe'
import { Envconfig } from '@/config/envconfig'
import { CRD_DEFINITION, CRD_NAME } from './CrdDefenition'

export interface ICRDManager {
	ensureCrd(): Promise<void>
}

@injectable()
export class CRDManager implements ICRDManager {
	// https://kubernetes-client.github.io/javascript/classes/ApiextensionsV1Api.html#readCustomResourceDefinition

	async ensureCrd(): Promise<void> {
		const exists = await this.crdExists()

		if (exists) {
			logger.info('[crd] already exists — skipping creation')
			await this.waitForCRDReady()
			return
		}

		await this.createCRD()
		await this.waitForCRDReady()
	}

	private async crdExists(): Promise<boolean> {
		try {
			await apiExtensionsClient.readCustomResourceDefinition({ name: CRD_NAME })
			return true
		} catch (err) {
			if (err instanceof ApiException && err.code === 404) {
				return false
			}
			throw err  // unexpected error — propagate up
		}
	}

	private async createCRD(): Promise<void> {
		try {
			const request: ApiextensionsV1ApiCreateCustomResourceDefinitionRequest = {
				body: CRD_DEFINITION,
				pretty: undefined,
				dryRun: undefined,
				fieldManager: Envconfig.app.name,
			}
			await apiExtensionsClient.createCustomResourceDefinition(request)
			logger.info('[crd] created WorkflowRun CRD')

		} catch (err) {
			if (err instanceof ApiException && err.code === 409) {
				// another operator replica created it between our read and create — fine
				logger.info('[crd] created by another instance, continuing')
				return
			}
			throw err
		}
	}

	private async waitForCRDReady(maxWaitMs = 30_000): Promise<void> {
		const start = Date.now()

		while (Date.now() - start < maxWaitMs) {
			const { status } = await apiExtensionsClient
				.readCustomResourceDefinitionStatus({ name: CRD_NAME })

			const established = status?.conditions?.find(
				c => c.type === 'Established' && c.status === 'True'
			)
			const namesAccepted = status?.conditions?.find(
				c => c.type === 'NamesAccepted' && c.status === 'True'
			)

			if (established && namesAccepted) {
				logger.info('[crd] ready')
				return
			}

			await this.sleep(500)
		}

		throw new Error('[crd] did not become ready within 30 seconds')
	}

	private sleep(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}