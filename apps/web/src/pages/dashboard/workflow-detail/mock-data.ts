import type { Run, WorkflowStatus } from './types';

export const MOCK_YAML = `name: ci-build-test
description: Install dependencies, lint, type-check, and run tests

triggers:
  - type: push
    branches: [main, develop]
  - type: pull_request
    branches: [main]

steps:
  - name: install-deps
    run: npm ci
    timeout: 120s

  - name: lint
    run: npm run lint
    depends_on: [install-deps]

  - name: type-check
    run: npm run typecheck
    depends_on: [install-deps]

  - name: unit-tests
    run: npm run test
    depends_on: [lint, type-check]
    retry:
      max_attempts: 2
      delay: 5s

  - name: build
    run: npm run build
    depends_on: [unit-tests]
    artifacts:
      - dist/**
`;

export const MOCK_RUNS: Run[] = [
	{
		id: 'run-1',
		status: 'success',
		trigger: 'push to main',
		date: '12 min ago',
		duration: '2m 34s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '32s' },
			{ name: 'Lint', status: 'success', duration: '18s' },
			{ name: 'Type check', status: 'success', duration: '24s' },
			{ name: 'Unit tests', status: 'success', duration: '58s' },
			{ name: 'Build', status: 'success', duration: '22s' },
		],
	},
	{
		id: 'run-2',
		status: 'failed',
		trigger: 'push to develop',
		date: '2 hr ago',
		duration: '1m 12s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '30s' },
			{ name: 'Lint', status: 'success', duration: '16s' },
			{ name: 'Type check', status: 'failed', duration: '26s' },
			{ name: 'Unit tests', status: 'idle', duration: '—' },
			{ name: 'Build', status: 'idle', duration: '—' },
		],
	},
	{
		id: 'run-3',
		status: 'success',
		trigger: 'PR #42',
		date: 'Yesterday',
		duration: '2m 50s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '34s' },
			{ name: 'Lint', status: 'success', duration: '20s' },
			{ name: 'Type check', status: 'success', duration: '28s' },
			{ name: 'Unit tests', status: 'success', duration: '1m 06s' },
			{ name: 'Build', status: 'success', duration: '22s' },
		],
	},
	{
		id: 'run-4',
		status: 'success',
		trigger: 'push to main',
		date: '2 days ago',
		duration: '2m 28s',
		steps: [
			{ name: 'Install deps', status: 'success', duration: '31s' },
			{ name: 'Lint', status: 'success', duration: '17s' },
			{ name: 'Type check', status: 'success', duration: '22s' },
			{ name: 'Unit tests', status: 'success', duration: '56s' },
			{ name: 'Build', status: 'success', duration: '22s' },
		],
	},
];

export const MOCK_WORKFLOW = {
	id: 'wf-1',
	name: 'CI / Build & Test',
	description:
		'Install dependencies, lint, type-check, and run unit tests on every push to main and develop',
	status: 'success' as WorkflowStatus,
	lastRun: '12 min ago',
	duration: '2m 34s',
	totalRuns: 128,
	successRate: 94,
	avgDuration: '2m 41s',
};

export const statusMap: Record<WorkflowStatus, { label: string; color: string }> = {
	idle: { label: 'Idle', color: 'rgba(161,161,170,0.5)' },
	queued: { label: 'Queued', color: 'rgba(234,179,8,1)' },
	running: { label: 'Running', color: 'rgba(59,130,246,1)' },
	success: { label: 'Passed', color: 'oklch(0.60 0.13 163)' },
	failed: { label: 'Failed', color: 'rgba(239,68,68,1)' },
};
