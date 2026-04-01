import type { TriggerRunInput, TriggerRunOutput } from '@/application/dto/triggerRun';

export interface ITriggerRunUseCase {
    execute(input: TriggerRunInput): Promise<TriggerRunOutput>;
}
