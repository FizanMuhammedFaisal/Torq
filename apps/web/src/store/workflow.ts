import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
// https://github.com/pmndrs/zustand/issues/83
export type WorkflowEntry = {
    workflowId: string
    versionId: string
    spec: string
    editingSpec: string
    saved: boolean
}

interface WorkflowStore {
    state: {
        workflows: Record<string, WorkflowEntry>;
    }
    actions: {
        addWorkflow(id: string, payload: WorkflowEntry): void
        setEditingSpecContent(id: string, spec: string): void
        setSaved: (id: string, saved: boolean) => void
    }
}

type SetState = (fn: (store: WorkflowStore) => void) => void;
const workflowStore = create<WorkflowStore>()(
    immer(
        (set: SetState, get) => ({
            state: {
                workflows: {}
            },
            actions: {
                addWorkflow: (id: string, payload: WorkflowEntry) => {
                    set(
                        (store) => {
                            store.state.workflows[id] = payload
                        }
                    )
                },
                setEditingSpecContent: (id: string, spec: string) => {
                    set(
                        (store) => {
                            store.state.workflows[id].editingSpec = spec
                        }
                    )
                },
                setSaved: (id: string, saved: boolean) => {
                    set((store) => {
                        store.state.workflows[id].saved = saved
                    })
                }
            }
        })
    )
);

export const useWorkFlowStore = () => workflowStore(state => state.state)
export const useWorkFlowActions = () => workflowStore(state => state.actions)