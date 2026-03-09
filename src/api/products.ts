import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, ImageType, PaginatedResult, VideoType } from '@/types';
import type { ProductCategory } from './productCategories';

export interface Product {
	id: string;
	key: string;
	title: string;
	slug: string;
	summary: string;
	amount: number;
	discountPercent: number;
	availableStock: number;
	currency: string;
	isAvailable: boolean;
	isFlashSale: boolean;
	category: ProductCategory;
	images: ImageType[];
	videos?: VideoType[];

	videosProcessingId?: string;
	videosExpectedCount?: number;
	videosCompletedCount?: number;
	videosProcessingError?: string;

	hairLengthInches?: string[];
	laceSizes?: string[];

	createdAt?: string;
	updatedAt?: string;

	// Aggregated fields
	salesCount: number;
	cartCount: number;
	reviewsCount: number;
	avgRating: number;
}

export const productsApi = {
	getProducts: async (params?: {
		businessId: string;
		page?: number;
		limit?: number;
		search?: string;
	}): Promise<BaseAPIResponse & { data: PaginatedResult<Product> }> => {
		const response = await apiClient.get(`${API_ROUTES.PRODUCTS}/${params?.businessId}`, { params });
		return response.data;
	},

	getProduct: async (productId: string): Promise<BaseAPIResponse & { data: { product: Product } }> => {
		const response = await apiClient.get(`${API_ROUTES.PRODUCTS}/item/${productId}`);
		return response.data;
	},

	addProduct: async (data: FormData): Promise<BaseAPIResponse & { data: { product: Product } }> => {
		const response = await apiClient.post(`${API_ROUTES.PRODUCTS}/new`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	},

	updateProduct: async (productId: string, data: FormData): Promise<BaseAPIResponse & { data: { product: Product } }> => {
		const response = await apiClient.patch(`${API_ROUTES.PRODUCTS}/${productId}`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	},

	deleteProduct: async (productId: string): Promise<void> => {
		await apiClient.delete(`${API_ROUTES.PRODUCTS}/${productId}`);
	},

	toggleProductAvailability: async (productId: string): Promise<BaseAPIResponse & { data: { product: Product } }> => {
		const response = await apiClient.patch(`${API_ROUTES.PRODUCTS}/${productId}/availability`);
		return response.data;
	},

	toggleProductFlashSale: async (productId: string): Promise<BaseAPIResponse & { data: { product: Product } }> => {
		const response = await apiClient.patch(`${API_ROUTES.PRODUCTS}/${productId}/flash-sale`);
		return response.data;
	},
};
