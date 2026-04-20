import { injectable, inject } from 'tsyringe';
import { TOKENS } from '@/config/di/tokens';
import type { CRDWatcher } from './watchers/CRDWatcher';
import type { JobWatcher } from './watchers/jobWatcher';

@injectable()
export class K8sWatchManager {
	constructor(
		@inject(TOKENS.CRDWatcher)
		private readonly workflowRunWatcher: CRDWatcher,
		@inject(TOKENS.JobWatcher)
		private readonly jobWatcher: JobWatcher,
	) {}

	async startWatchers(): Promise<void> {
		console.log('Initializing K8s resource watchers...');

		try {
			await Promise.all([
				this.workflowRunWatcher.start(),
				// this.jobWatcher.start(),
			]);

			console.log('All configured K8s watchers are running.');
		} catch (error) {
			console.error('Failed to start K8s watchers:', error);
			throw error;
		}
	}
	async stopWatchers(): Promise<void> {
		console.log('Stopping K8s resource watchers...');
		await Promise.allSettled([this.workflowRunWatcher.stop(), this.jobWatcher.stop()]);
	}
}
