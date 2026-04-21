import { DomainError } from './domainError.abstract';
import { DOMAIN_ERROR_CODES } from './DOMAIN_ERROR_CODES';

export class BadRequst extends DomainError {
    constructor(entity: string) {
        super(DOMAIN_ERROR_CODES.BAD_REQUST, `${entity} not found`);
    }
    serialize() {
        return [{ message: this.message }];
    }
}
