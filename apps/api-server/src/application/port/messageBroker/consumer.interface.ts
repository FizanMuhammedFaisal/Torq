export interface IConsumer {
	start(): Promise<void>;
	stop(): void;
}
