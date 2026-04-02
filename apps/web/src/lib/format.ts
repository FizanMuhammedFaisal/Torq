/**
 * Formats a duration in milliseconds to a human-readable string.
 * e.g. 500 → "500ms", 3500 → "3s", 90000 → "1m 30s"
 */
export function formatDuration(ms?: number | null): string {
	if (ms == null) return '—';
	if (ms < 1000) return `${ms}ms`;
	const seconds = Math.floor(ms / 1000);
	if (seconds < 60) return `${seconds}s`;
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
}

/**
 * Formats an ISO date string to a relative time label.
 * e.g. "Just now", "5m ago", "2h ago", "3d ago"
 */
export function formatRelativeTime(iso?: string | null): string {
	if (!iso) return '—';
	const date = new Date(iso);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffMins = Math.floor(diffMs / 60000);
	if (diffMins < 1) return 'Just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays}d ago`;
}

/**
 * Formats an ISO date string to a short clock time.
 * e.g. "14:32"
 */
export function formatTime(iso?: string | null): string {
	if (!iso) return '—';
	return new Date(iso).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});
}

/**
 * Formats an ISO date string to a short date.
 * e.g. "Apr 2, 2026"
 */
export function formatDate(iso?: string | null): string {
	if (!iso) return '—';
	return new Date(iso).toLocaleDateString(undefined, {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

/**
 * Formats an ISO date string to date + time.
 * e.g. "Apr 2, 14:32"
 */
export function formatDateTime(iso?: string | null): string {
	if (!iso) return '—';
	return new Date(iso).toLocaleString(undefined, {
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
}
