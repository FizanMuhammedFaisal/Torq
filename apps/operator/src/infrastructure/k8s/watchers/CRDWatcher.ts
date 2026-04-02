import { inject, injectable } from 'tsyringe';
import * as k8s from '@kubernetes/client-node';
import { kubeConfig } from '../client';
import { Envconfig } from '@/config/envconfig';
import { logger } from '@/infrastructure/logger/logger';
import { BaseWatcher } from './baseWatcher';
import { toDomainWorkflowRun, type WorkflowRunK8s } from './mappers/workflowRunSnapshot.mapper';
import { TOKENS } from '@/config/di/tokens';
import type { IReconciler } from '@/application/port/reconciler/reconciler.interface';

// https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes
// workflow watcher should watch modified/created events

/**
 * the watcher loop, even when on crash will restart to watch for events from kuber-api-server
 * doing reconciliation
 */
@injectable()
export class CRDWatcher extends BaseWatcher {
	private readonly watch = new k8s.Watch(kubeConfig);
	constructor(@inject(TOKENS.Reconciler) private reconciler: IReconciler) {
		super();
	}

	async startWatch() {
		const { group, version, plural, namespace } = Envconfig.k8s;
		const path = `/apis/${group}/${version}/namespaces/${namespace}/${plural}`;
		logger.info({
			'[crd-watcher] starting watch': { path, resourceVersion: this.lastResourceVersion },
		});

		this.watch.watch(
			path,
			this.lastResourceVersion ? { resourceVersion: this.lastResourceVersion } : {},
			this.handler.bind(this),
			this.hanldeDisconnect.bind(this),
		);
	}

	/**
	 *
	 * Start of the reconciliation loop, each event and workflowrunCRD will be modified
	 * accordance with how we need to move currect status to given spec
	 */
	private async handler(phase: string, apiObj: unknown, _watchObj?: unknown) {
		console.log(phase, JSON.stringify(apiObj));
		if (!this.isWorkflowRunK8s(apiObj)) {
			logger.warn({
				'[crd - watcher] received unexpected object shape': apiObj,
			});
			return;
		}
		if (apiObj.metadata?.resourceVersion) {
			this.lastResourceVersion = apiObj.metadata.resourceVersion;
		}
		if (phase !== 'ADDED' && phase !== 'MODIFIED') return;
		try {
			const run = toDomainWorkflowRun(apiObj);
			await this.reconciler.reconcile(run);
		} catch (err) {
			logger.error({ '[crd-watcher] reconcile error': err });
			// never crash the watcher — log and continue
		}
	}
	private isWorkflowRunK8s(obj: unknown): obj is WorkflowRunK8s {
		if (typeof obj !== 'object' || obj === null) return false;

		const o = obj as Record<string, unknown>;

		if (typeof o.apiVersion !== 'string') return false;
		if (typeof o.kind !== 'string') return false;
		if (o.kind !== 'WorkflowRun') return false;

		const spec = o.spec as Record<string, unknown> | undefined;
		if (!spec) return false;
		if (typeof spec.workflowId !== 'string') return false;
		if (typeof spec.versionId !== 'string') return false;
		if (typeof spec.torqVersion !== 'string') return false;

		return true;
	}
}
