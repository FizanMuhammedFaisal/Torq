import type http from 'http';
export class HttpError extends Error {
	constructor(
		public response: http.IncomingMessage,
		// biome-ignore lint/suspicious/noExplicitAny: from docs
		public body: any,
		public code?: number,

	) {
		super('HTTP request failed');
		this.name = 'HttpError';
	}
}
// https://github.com/kubernetes-client/javascript/blob/8151bff1b27267ef02301998a0d02d13a0ce495b/src/gen/api/apis.ts
