import type { Job } from '../v1apha/schema';

export function detectCycles(jobs: Record<string, Job>): string[] {
	const inDegree: Record<string, number> = {};
	const adj: Record<string, string[]> = {};
	for (const name of Object.keys(jobs)) {
		inDegree[name] = 0;
		adj[name] = [];
	}
	for (const [name, job] of Object.entries(jobs)) {
		for (const dep of job.needs ?? []) {
			if (adj[dep]) {
				adj[dep].push(name);
				inDegree[name]++;
			}
		}
	}

	const queue = Object.keys(jobs).filter((n) => inDegree[n] === 0);
	const visited = new Set<string>();

	while (queue.length > 0) {
		const node = queue.shift();
		if (!node) continue;
		visited.add(node);
		for (const neighbor of adj[node]) {
			if (--inDegree[neighbor] === 0) queue.push(neighbor);
		}
	}
	return Object.keys(jobs).filter((n) => !visited.has(n));
}
