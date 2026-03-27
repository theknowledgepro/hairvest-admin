import { BASE_CURRENCY } from '@/config';

export const formatCurrency = (amount: number, currency: string = BASE_CURRENCY): string => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currency,
	}).format(amount);
};
