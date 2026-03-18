// src/infrastructure/grpc/constants/AppErrorCodeForConnectCode.ts
import { Code } from "@connectrpc/connect";
import { DOMAIN_ERROR_CODES } from "@/domain/errors/DOMAIN_ERROR_CODES";

export const AppErrorCodeForConnectCode: Record<number, string> = {
    [Code.NotFound]: DOMAIN_ERROR_CODES.NOT_FOUND,
    [Code.AlreadyExists]: DOMAIN_ERROR_CODES.CONFLICT,
    [Code.InvalidArgument]: DOMAIN_ERROR_CODES.INVALID_ARGUMENT,
    [Code.FailedPrecondition]: DOMAIN_ERROR_CODES.SEMANTIC_VALIDATION_ERROR,
    [Code.Unauthenticated]: DOMAIN_ERROR_CODES.UNAUTHENTICATED,
    [Code.PermissionDenied]: DOMAIN_ERROR_CODES.FORBIDDEN,
    [Code.Internal]: DOMAIN_ERROR_CODES.INTERNAL_SERVER_ERROR,
};