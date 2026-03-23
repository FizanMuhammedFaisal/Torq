import { injectable } from 'tsyringe';
import type { IResourceWatcher } from '@/application/port/k8s/watcher.interface';
import * as k8s from '@kubernetes/client-node'
import { kubeConfig } from '../client';
import { Envconfig } from '@/config/envconfig';
import { logger } from '@/infrastructure/logger/logger';
import { BaseWatcher } from './baseWatcher';

// https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes
// workflow watcher should watch modified/created events
@injectable()
export class CRDWatcher extends BaseWatcher {

	private readonly watch = new k8s.Watch(kubeConfig)
	constructor() {
		super()
	}

	async startWatch() {
		const { group, version, plural, namespace } = Envconfig.k8s
		const path = `/apis/${group}/${version}/namespaces/${namespace}/${plural}`
		logger.info({ '[crd-watcher] starting watch': { path, resourceVersion: this.lastResourceVersion } })

		this.watch.watch(path, this.lastResourceVersion
			? { resourceVersion: this.lastResourceVersion }
			: {}, this.handler, this.hanldeDisconnect)


	}
	private async handler(phase: string, apiObj: any, _watchObj?: unknown) {
		if (apiObj.metadata?.resourceVersion) {
			this.lastResourceVersion = apiObj.metadata.resourceVersion
		}
		if (phase !== 'ADDED' && phase !== 'MODIFIED') return
		try {
			const run = toDomainWorkflowRun(apiObj)
			await this.reconciler.reconcile(run)
		} catch (err) {
			logger.error({ '[crd-watcher] reconcile error': err })
			// never crash the watcher — log and continue
		}
	}
}
