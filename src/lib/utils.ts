import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getCloudFileURL = (url: string | undefined) => {
	if (url && typeof url !== 'string') return url;
	else if (url?.trim().startsWith('data:')) return url?.trim();
	else if (url && !url.startsWith('https')) return `https://d21lfik2kekss0.cloudfront.net/${url.trim()}`;
	else if (url && url.startsWith('https')) return url;
	else return undefined;
};

export const getFullName = (user: { firstName?: string; lastName?: string; otherNames?: string; email?: string }) =>
	[user?.firstName, user?.otherNames, user?.lastName].filter(Boolean).join(' ') || user?.email;
