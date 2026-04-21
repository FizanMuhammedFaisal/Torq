
type Job = {
    needs?: string[];
}
/**
     * Kahn's BFS topological sort.
     * Returns job names grouped into execution waves:
     *   Wave 0 — no dependencies (run immediately)
     *   Wave N — all dependencies satisfied by waves 0..N-1
     */
export function topoSort(jobs: Record<string, Job>): string[][] {
    const names = Object.keys(jobs);
    if (names.length === 0) return [];

    const inDegree: Record<string, number> = {};
    const adj: Record<string, string[]> = {};
    for (const name of names) {
        inDegree[name] = 0;
        adj[name] = [];
    }

    for (const [name, job] of Object.entries(jobs)) {
        for (const dep of job.needs ?? []) {
            if (!(dep in adj)) {
                throw new Error(`Job "${name}" depends on unknown job "${dep}"`);
            }
            adj[dep].push(name);
            inDegree[name]++;
        }
    }

    let queue = names.filter((n) => inDegree[n] === 0);
    const waves: string[][] = [];

    while (queue.length > 0) {
        waves.push([...queue]);
        const next: string[] = [];
        for (const node of queue) {
            for (const neighbor of adj[node]) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] === 0) next.push(neighbor);
            }
        }
        queue = next;
    }

    // If not all nodes were processed, a cycle exists
    const processed = waves.reduce((sum, w) => sum + w.length, 0);
    if (processed < names.length) {
        const cycleNodes = names.filter((n) => inDegree[n] > 0);
        throw new Error(`Cyclic dependency detected involving: ${cycleNodes.join(', ')}`);
    }

    return waves;
}