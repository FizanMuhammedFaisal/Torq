export abstract class InfraError extends Error {
    constructor(
        public readonly code: string,
        message: string,
        public readonly retriable: boolean = false
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, new.target.prototype);
    }

    abstract serialize(): { message: string; field?: string, reason?: string }[];
}


