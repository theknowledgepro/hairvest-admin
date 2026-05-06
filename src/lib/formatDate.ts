import dayjs from 'dayjs';

/**
 * Formats a date string into a full human-readable format.
 * Output: "Fri, 06 Mar 2026 at 08:07"
 */
export const formatDate = (date: string | Date | null | undefined): string => {
	if (!date) return '—';
	return dayjs(date).format('ddd, DD MMM YYYY [at] hh:mm a');
};

/**
 * Formats a date string into a compact date-only format.
 * Output: "06 Mar 2026"
 */
export const formatDateShort = (date: string | Date | null | undefined): string => {
	if (!date) return '—';
	return dayjs(date).format('DD MMM YYYY');
};

/**
 * Returns how long ago a date was in relative terms.
 * Output: "3 hours ago"
 */
export const formatRelative = (date: string | Date | null | undefined): string => {
	if (!date) return '—';
	const now = dayjs();
	const d = dayjs(date);
	const diffMins = now.diff(d, 'minute');
	if (diffMins < 1) return 'just now';
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHrs = now.diff(d, 'hour');
	if (diffHrs < 24) return `${diffHrs}h ago`;
	const diffDays = now.diff(d, 'day');
	if (diffDays < 7) return `${diffDays}d ago`;
	return formatDateShort(date);
};
