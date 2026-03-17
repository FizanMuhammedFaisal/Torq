import {
	ContainerTruck02Icon,
	File01Icon,
	GitMergeIcon,
} from '@hugeicons/core-free-icons';
import type { IconSvgElement } from '@hugeicons/react';
import type { TorqVersion } from '@/store/version-store';

export interface WorkflowTemplate {
	id: string;
	name: string;
	description: string;
	icon: IconSvgElement;
	color: string;
	accent: string;
	code: string;
}

const v1alphaTemplates: WorkflowTemplate[] = [
	{
		id: 'blank',
		name: 'Blank Canvas',
		description: 'Start from scratch with an empty workflow file.',
		icon: File01Icon,
		color: 'from-white/10 to-white/5',
		accent: 'text-white',
		code: `workflow: my-workflow
version: v1alpha
jobs:
  hello:
    image: alpine:latest
    steps:
      - run: echo "Hello, Torq!"
`,
	},
	{
		id: 'docker',
		name: 'Docker Publish',
		description: 'Build and push Docker images to your registry.',
		icon: ContainerTruck02Icon,
		color: 'from-blue-500/20 to-blue-500/5',
		accent: 'text-blue-400',
		code: `workflow: docker-publish
version: v1alpha
jobs:
  build:
    image: docker:latest
    steps:
      - run: docker build -t my-app .
      - run: docker push my-app:latest
`,
	},
	{
		id: 'ci',
		name: 'CI Pipeline',
		description: 'Test and build a Node.js project.',
		icon: GitMergeIcon,
		color: 'from-emerald-500/20 to-emerald-500/5',
		accent: 'text-emerald-400',
		code: `workflow: ci-pipeline
version: v1alpha
jobs:
  install:
    image: node:20-alpine
    steps:
      - run: npm ci
  test:
    image: node:20-alpine
    needs: [install]
    steps:
      - run: npm test
  build:
    image: node:20-alpine
    needs: [test]
    steps:
      - run: npm run build
`,
	},
];

const v1betaTemplates: WorkflowTemplate[] = [
	{
		id: 'blank',
		name: 'Blank Canvas (Beta)',
		description:
			'Start from scratch with an empty workflow file using v1beta features.',
		icon: File01Icon,
		color: 'from-white/10 to-white/5',
		accent: 'text-white',
		code: `workflow: my-workflow
version: v1beta
jobs:
  hello:
    image: alpine:latest
    steps:
      - run: echo "Hello, Torq Beta!"
`,
	},
];

export const WORKFLOW_TEMPLATES: Record<TorqVersion, WorkflowTemplate[]> = {
	v1alpha: v1alphaTemplates,
	v1beta: v1betaTemplates,
	latest: v1betaTemplates,
};
