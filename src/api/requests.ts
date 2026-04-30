import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, PaginatedResult } from '@/types';

export interface CustomerRequest {
	key: string;
	description: string;
	images: string[];
	customer: {
		key: string;
		firstName: string;
		lastName: string;
		email: string;
		avatar?: string;
	};
	business: {
		key: string;
		name: string;
		email: string;
		phone: any;
	};
	createdAt: string;
	updatedAt: string;
}

export const requestsApi = {
	getRequests: async (
		businessId: string,
		page = 1,
		limit = 20,
		search?: string,
	): Promise<BaseAPIResponse & { data: PaginatedResult<CustomerRequest> }> => {
		const response = await apiClient.get(`${API_ROUTES.CUSTOMER_REQUESTS}/${businessId}`, {
			params: { page, limit, search },
		});
		return response.data;
	},
	getRequestDetail: async (requestId: string): Promise<BaseAPIResponse & { data: { request: CustomerRequest } }> => {
		const response = await apiClient.get(`${API_ROUTES.CUSTOMER_REQUESTS}/${requestId}`);
		return response.data;
	},
};
