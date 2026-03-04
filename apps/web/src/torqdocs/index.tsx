import { Book02Icon, CodeIcon, Settings01Icon } from '@hugeicons/core-free-icons';
import { IntroductionDocs } from './introduction';

export const TORQ_DOCS_REGISTRY = [
	{
		id: 'introduction',
		label: 'Introduction to YAML',
		icon: Book02Icon,
		component: IntroductionDocs,
	},
	{
		id: 'triggers',
		label: 'Triggers (Events)',
		icon: Settings01Icon,
		component: () => <div className="text-white/40 italic p-10">TBD: Event triggers documentation.</div>,
	},
	{
		id: 'steps',
		label: 'Steps & Execution',
		icon: CodeIcon,
		component: () => <div className="text-white/40 italic p-10">TBD: Execution steps documentation.</div>,
	},
];
