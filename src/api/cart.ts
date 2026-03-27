import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse } from '@/types';

export interface CartItem {
	key: string;
	product: string;
	quantity: number;
	productDetails?: any;
}

export const cartApi = {
	getCart: async (customerId: string): Promise<BaseAPIResponse & { data: { results: CartItem[] } }> => {
		const response = await apiClient.get(`${API_ROUTES.CARTS}/customer/${customerId}`);
		return response.data;
	},
	removeFromCart: async (itemId: string): Promise<BaseAPIResponse> => {
		const response = await apiClient.delete(`${API_ROUTES.CARTS}/item/${itemId}`);
		return response.data;
	},
	clearCart: async (customerId: string): Promise<BaseAPIResponse> => {
		const response = await apiClient.delete(`${API_ROUTES.CARTS}/customer/${customerId}/clear`);
		return response.data;
	},
};
