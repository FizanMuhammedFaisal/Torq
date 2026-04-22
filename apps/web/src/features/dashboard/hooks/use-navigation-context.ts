import { useLocation, useParams } from 'react-router-dom';

export type NavContext = 'global' | 'workflow' | 'run';

export function useNavigationContext() {
	const { pathname } = useLocation();
	const { id, runId } = useParams<{ id: string; runId: string }>();

	// Specific Run View within a Workflow
	if (runId && pathname.includes(`/runs/${runId}`)) {
		return { context: 'run' as const, id, runId };
	}

	// Workflow Context
	if (id && pathname.startsWith('/dashboard/workflows/') && !pathname.includes('/create')) {
		return { context: 'workflow' as const, id };
	}

	return { context: 'global' as const };
}
