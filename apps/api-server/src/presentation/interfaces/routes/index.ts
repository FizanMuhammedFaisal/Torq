/**
 * Router contract.
 *
 * NOTE: We intentionally don't constrain the return type of register().
 * Elysia's type system uses 7 generic parameters that change with every
 * .get()/.post() chain — any abstract return type would require `any`.
 * Instead, we let TypeScript infer the exact return type per-router,
 * and Elysia's .use() method handles the type compatibility.
 */
export interface Router {
	readonly prefix?: string;
	register(): unknown;
}
