import { InfraError } from "./infrastructure.error";


export class DatabaseInternalError extends InfraError {
    constructor(message: string) {
        super('DATABASE_INTERNAL_ERROR', message, false);
    }
    serialize() {
        return [{ message: this.message }];
    }
}