// import { ConnectError, Code, type HandlerContext } from '@connectrpc/connect';
// import type { IAccountContext } from '@application/types/account-context.interface';
// import type { AccountRole } from ;

// /**
//  * Extracts account context from RPC request headers.
//  * throws error if headers missing.
//  *
//  * Expected headers:
//  * - x-jwt-accountid: string
//  * - x-jwt-fullname: string
//  * - x-jwt-role: string (optional)
//  */
// export function extractAccountContext(context: HandlerContext): IAccountContext {
// 	const headers = context.requestHeader;

// 	const accountId = headers.get('x-jwt-accountid');
// 	const fullname = headers.get('x-jwt-fullname');
// 	const role = headers.get('x-jwt-role') as AccountRole | undefined;

// 	if (!accountId || !fullname) {
// 		throw new ConnectError('Missing required authentication headers', Code.Unauthenticated);
// 	}

// 	return {
// 		accountId,
// 		fullname,
// 		role,
// 	};
// }

// /**
//  * Safely extracts account context, returns undefined if headers missing.
//  * Use this for optional auth scenarios.
//  */
// export function extractAccountContextOptional(
// 	context: HandlerContext,
// ): IAccountContext | undefined {
// 	const headers = context.requestHeader;

// 	const accountId = headers.get('x-jwt-accountid');
// 	const fullname = headers.get('x-jwt-fullname');
// 	const role = headers.get('x-jwt-role') as AccountRole | undefined;

// 	if (!accountId || !fullname) {
// 		return undefined;
// 	}

// 	return {
// 		accountId,
// 		fullname,
// 		role,
// 	};
// }
