import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, PaginatedResult } from '@/types';
import type { Product } from './products';
import type { Customer } from './customers';

export interface ProductReviewLike {
	id: string;
	key: string;
	customer: Partial<Customer>;
	createdAt: string;
}

export interface ProductReview {
	id: string;
	key: string;
	rating: number;
	comment: string;
	published: boolean;
	product: Partial<Product>;
	customer: Partial<Customer>;
	likesCount?: number;
	createdAt?: string;
	updatedAt?: string;
}

export const reviewsApi = {
	getReviews: async (params?: {
		businessId: string;
		page?: number;
		limit?: number;
		productId?: string;
		customerId?: string;
		rating?: number;
	}): Promise<BaseAPIResponse & { data: PaginatedResult<ProductReview> }> => {
		const response = await apiClient.get(`${API_ROUTES.REVIEWS}/${params?.businessId}`, { params });
		return response.data;
	},

	getReview: async (reviewId: string): Promise<BaseAPIResponse & { data: { review: ProductReview } }> => {
		const response = await apiClient.get(`${API_ROUTES.REVIEWS}/item/${reviewId}`);
		return response.data;
	},

	getReviewLikes: async (
		reviewId: string,
		params?: { page?: number; limit?: number },
	): Promise<BaseAPIResponse & { data: PaginatedResult<ProductReviewLike> }> => {
		const response = await apiClient.get(`${API_ROUTES.REVIEWS}/item/${reviewId}/likes`, { params });
		return response.data;
	},

	addReview: async (data: {
		productId: string;
		customerId: string;
		rating: number;
		comment: string;
		published: boolean;
	}): Promise<BaseAPIResponse & { data: { review: ProductReview } }> => {
		const response = await apiClient.post(`${API_ROUTES.REVIEWS}/new`, data);
		return response.data;
	},

	updateReview: async (
		reviewId: string,
		data: { rating?: number; comment?: string; published?: boolean },
	): Promise<BaseAPIResponse & { data: { review: ProductReview } }> => {
		const response = await apiClient.patch(`${API_ROUTES.REVIEWS}/${reviewId}`, data);
		return response.data;
	},

	deleteReview: async (reviewId: string): Promise<void> => {
		await apiClient.delete(`${API_ROUTES.REVIEWS}/${reviewId}`);
	},
};
