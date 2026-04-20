import { Code } from '@connectrpc/connect';

export const ConnectCodeForAppErrorCode: Record<string, Code> = {
	// Domain Error Codes
	NOT_AUTHENTICATED: Code.PermissionDenied,
};
