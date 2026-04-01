import type { TriggerRunInput } from '@/application/dto/triggerRun';

export interface ITriggerRunUseCase {
    execute(input: TriggerRunInput): Promise<void>;
}
