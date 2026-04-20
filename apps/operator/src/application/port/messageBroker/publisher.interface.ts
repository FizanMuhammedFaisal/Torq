export interface IPublisher {
	/**
	 * Publish a message to a topic/stream.
	 *
	 * @param topic     - Stream / channel key (e.g. `state:{workflowRunName}`)
	 * @param message   - Payload to publish (any serialisable type)
	 * @param stringify - If true, the message is JSON-stringified into a single
	 *                    `data` field. If false, the message is spread as flat
	 *                    string key-value pairs (required for Redis Streams xAdd).
	 */
	publish<T>(topic: string, message: T, stringify: boolean): Promise<PublishResult>;
}

export type PublishResult = {
	success: boolean;
	error?: Error;
};
