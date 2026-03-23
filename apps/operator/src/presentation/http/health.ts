import { createServer } from 'node:http';


export interface IHealthServer {
	markReady(): void;
	start(): void;
}

export class HealthServer implements IHealthServer {
	private ready = false;

	markReady() {
		this.ready = true;
	}

	start() {
		createServer((req, res) => {
			if (req.url === '/healthz') {
				res.writeHead(200).end('ok');
			} else if (req.url === '/readyz') {
				res.writeHead(this.ready ? 200 : 503).end(this.ready ? 'ready' : 'not ready');
			} else {
				res.writeHead(404).end();
			}
		})
			.listen(8080)
			.on('listening', () => {
				console.log('health server started on port 8080');
			});
	}
}
