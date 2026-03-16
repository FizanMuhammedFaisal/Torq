export * from './detectCycles';
export function isObject(raw: unknown): raw is Record<string, unknown> {
	return typeof raw === 'object' && raw !== null && !Array.isArray(raw);
}

export function isString(raw: unknown): raw is string {
	return typeof raw === 'string';
}

export function isNumber(raw: unknown): raw is number {
	return typeof raw === 'number';
}

export function isBoolean(raw: unknown): raw is boolean {
	return typeof raw === 'boolean';
}

export function isNull(raw: unknown): raw is null {
	return raw === null;
}

export function isUndefined(raw: unknown): raw is undefined {
	return typeof raw === 'undefined';
}
export function isNonEmptyString(val: unknown): val is string {
	return typeof val === 'string' && val.trim().length > 0;
}

export function isKebabCase(val: string): boolean {
	return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(val);
}
export function isValidEnvKey(val: string): boolean {
	return /^[A-Z_][A-Z0-9_]*$/.test(val);
}
