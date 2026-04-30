import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse } from '@/types';
import type { Product } from './products';

export interface WishlistItem {
	key: string;
	quantity: number;
	product?: Partial<Product>;
}

export const wishlistApi = {
	getWishlist: async (customerId: string): Promise<BaseAPIResponse & { data: { results: WishlistItem[] } }> => {
		const response = await apiClient.get(`${API_ROUTES.WISHLISTS}/customer/${customerId}`);
		return response.data;
	},
	removeFromWishlist: async (itemId: string): Promise<BaseAPIResponse> => {
		const response = await apiClient.delete(`${API_ROUTES.WISHLISTS}/item/${itemId}`);
		return response.data;
	},
	clearWishlist: async (customerId: string): Promise<BaseAPIResponse> => {
		const response = await apiClient.delete(`${API_ROUTES.WISHLISTS}/customer/${customerId}/clear`);
		return response.data;
	},
};
