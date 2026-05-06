import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, PaginatedResult } from '@/types';
import type { Product } from './products';

export interface InsightItem {
	key: string;
	quantity: number;
	product: Product;
	customer: {
		key: string;
		firstName: string;
		lastName: string;
		email: string;
		avatar?: any;
		phone?: any;
	};
	createdAt: string;
	updatedAt: string;
}

export interface MainStats {
	stats: {
		totalRevenue: number;
		totalOrders: number;
		totalItemsSold: number;
		totalCustomers: number;
	};
	revenueTrends: {
		date: string;
		revenue: number;
		orderCount: number;
	}[];
	categoryDistribution: {
		name: string;
		value: number;
	}[];
}

export const insightsApi = {
	getMainStats: async (): Promise<BaseAPIResponse & { data: MainStats }> => {
		const response = await apiClient.get(`${API_ROUTES.BUSINESS_INSIGHTS}/main-stats`);
		return response.data;
	},
	getCartInsights: async (page = 1, limit = 50, search?: string): Promise<BaseAPIResponse & { data: PaginatedResult<InsightItem> }> => {
		const response = await apiClient.get(`${API_ROUTES.BUSINESS_INSIGHTS}/carts`, {
			params: { page, limit, search },
		});
		return response.data;
	},
	getWishlistInsights: async (page = 1, limit = 50, search?: string): Promise<BaseAPIResponse & { data: PaginatedResult<InsightItem> }> => {
		const response = await apiClient.get(`${API_ROUTES.BUSINESS_INSIGHTS}/wishlists`, {
			params: { page, limit, search },
		});
		return response.data;
	},
};
