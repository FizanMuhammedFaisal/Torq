import { injectable } from 'tsyringe';
import type { IResourceWatcher } from '@/application/port/k8s/watcher.interface';


@injectable()
export class JobWatcher implements IResourceWatcher {
	constructor(

	) { }
	start(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	stop(): Promise<void> {
		throw new Error('Method not implemented.');
	}

}
