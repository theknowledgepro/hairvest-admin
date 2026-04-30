import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse } from '@/types';
import type { Product } from './products';

export interface CartItem {
	key: string;
	quantity: number;
	product?: Partial<Product>;
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
