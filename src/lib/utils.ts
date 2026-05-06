import { PRODUCT_ORDER_STATUS } from '@/api/orders';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CheckCircle2, XCircle, Package, Clock, Loader2 } from 'lucide-react';

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

export const getFullName = (user: { name?: string; firstName?: string; lastName?: string; otherNames?: string; email?: string }) =>
	[user?.name, user?.firstName, user?.otherNames, user?.lastName].filter(Boolean).join(' ') || user?.email;

export const getOrderStatusStyles = (status: PRODUCT_ORDER_STATUS) => {
	switch (status) {
		case PRODUCT_ORDER_STATUS.COMPLETED:
			return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
		case PRODUCT_ORDER_STATUS.CANCELLED:
			return 'text-red-500 bg-red-500/10 border-red-500/20';
		case PRODUCT_ORDER_STATUS.SHIPPED:
			return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
		case PRODUCT_ORDER_STATUS.PROCESSING:
			return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
		case PRODUCT_ORDER_STATUS.PAID:
			return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
		default:
			return 'text-neutral-400 bg-neutral-400/10 border-neutral-400/20';
	}
};

export const getOrderStatusIcon = (status: PRODUCT_ORDER_STATUS) => {
	switch (status) {
		case PRODUCT_ORDER_STATUS.COMPLETED:
			return CheckCircle2;
		case PRODUCT_ORDER_STATUS.CANCELLED:
			return XCircle;
		case PRODUCT_ORDER_STATUS.SHIPPED:
			return Package;
		case PRODUCT_ORDER_STATUS.PROCESSING:
			return Loader2;
		case PRODUCT_ORDER_STATUS.PAID:
			return CheckCircle2;
		case PRODUCT_ORDER_STATUS.PENDING:
		default:
			return Clock;
	}
};
