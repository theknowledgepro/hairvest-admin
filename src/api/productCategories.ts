import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, ImageType } from '@/types';

export interface ProductCategory {
	id: string;
	key: string;
	title: string;
	slug: string;
	summary?: string;
	image?: ImageType;
	isAvailable: boolean;
}

export const productCategoriesApi = {
	getProductCategories: async (businessId: string): Promise<BaseAPIResponse & { data: { categories: ProductCategory[] } }> => {
		const response = await apiClient.get(`${API_ROUTES.PRODUCT_CATEGORIES}/${businessId}`);
		return response.data;
	},

	addProductCategory: async (data: FormData): Promise<BaseAPIResponse & { data: { category: ProductCategory } }> => {
		const response = await apiClient.post(`${API_ROUTES.PRODUCT_CATEGORIES}/new`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	},

	updateProductCategory: async (categoryId: string, data: FormData): Promise<BaseAPIResponse & { data: { category: ProductCategory } }> => {
		const response = await apiClient.patch(`${API_ROUTES.PRODUCT_CATEGORIES}/${categoryId}`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	},

	deleteProductCategory: async (categoryId: string): Promise<void> => {
		await apiClient.delete(`${API_ROUTES.PRODUCT_CATEGORIES}/${categoryId}`);
	},

	toggleProductCategoryAvailability: async (categoryId: string): Promise<BaseAPIResponse & { data: { category: ProductCategory } }> => {
		const response = await apiClient.patch(`${API_ROUTES.PRODUCT_CATEGORIES}/${categoryId}/availability`);
		return response.data;
	},
};
