import { InfraError } from "./infrastructure.error";

export class ReconcilerFailureError extends InfraError {
    constructor(
        message: string,
        public reason?: string,

    ) {
        super("RECONCILER_FAILURE", message, false);

    }
    serialize(): { message: string; field?: string; reason?: string; }[] {
        return [
            {
                message: this.message,
                reason: this.reason,
            },
        ];
    }
}