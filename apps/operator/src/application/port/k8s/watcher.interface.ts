/**
 * This abstracts away the Kubernetes client logic from the application.
 */
export interface IResourceWatcher {
	start(): Promise<void>;
	stop(): Promise<void>;
}
