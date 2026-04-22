import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { GetWorkflowByIdResponse } from '@/features/workflows/schema/api.dto';
import type { Run } from '@/features/runs/hooks/use-runs';

interface WorkflowContextType {
	workflow: GetWorkflowByIdResponse;
	runs: Run[];
	isLoading: boolean;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export function WorkflowProvider({ children, value }: { children: ReactNode; value: WorkflowContextType }) {
	return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflowDetail() {
	const context = useContext(WorkflowContext);
	if (context === undefined) {
		throw new Error('useWorkflowDetail must be used within a WorkflowProvider');
	}
	return context;
}
