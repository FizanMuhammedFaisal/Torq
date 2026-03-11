import {
	Book02Icon,
	CodeIcon,
	Settings01Icon,
} from '@hugeicons/core-free-icons';
import type { TorqVersion } from '@/store/version-store';
import { IntroductionDocs } from './introduction';
import { QuickStart } from './quickStart';

type DocsSection = {
	id: string;
	label: string;
	icon: any;
	component: any;
};

const v1alphaDocs: DocsSection[] = [
	{
		id: 'introduction',
		label: 'Introduction',
		icon: Book02Icon,
		component: IntroductionDocs,
	},
	{
		id: 'quickstart',
		label: 'Quick Start',
		icon: CodeIcon,
		component: QuickStart,
	},
	{
		id: 'triggers',
		label: 'Triggers (Events)',
		icon: Settings01Icon,
		component: () => (
			<div className="text-white/40 italic p-10">
				TBD: Event triggers documentation.
			</div>
		),
	},
];

const v1betaDocs: DocsSection[] = [
	{
		id: 'introduction',
		label: 'Introduction',
		icon: Book02Icon,
		component: IntroductionDocs,
	},
	{
		id: 'quickstart',
		label: 'Quick Start (Beta)',
		icon: CodeIcon,
		component: QuickStart,
	},
];

export const TORQ_DOCS_REGISTRY: Record<TorqVersion, DocsSection[]> = {
	v1alpha: v1alphaDocs,
	v1beta: v1betaDocs,
	latest: v1alphaDocs,
};
