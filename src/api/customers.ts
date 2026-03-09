import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, ImageType, PaginatedResult } from '@/types';

export interface Customer {
	id: string;
	key: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: {
		international: string;
		national: string;
		uri: string;
	};
	avatar?: ImageType;
	gender: string;
	signUpMethod: string;
	suspended: boolean;
	createdAt: string;
	updatedAt: string;
}

export const customersApi = {
	getCustomers: async (params?: { page?: number; limit?: number }): Promise<BaseAPIResponse & { data: PaginatedResult<Customer> }> => {
		const response = await apiClient.get(API_ROUTES.CUSTOMERS, { params });
		return response.data;
	},

	getCustomerDetails: async (id: string): Promise<BaseAPIResponse & { data: { customer: Customer } }> => {
		const response = await apiClient.get(`${API_ROUTES.CUSTOMERS}/${id}`);
		return response.data;
	},

	toggleSuspension: async (id: string): Promise<BaseAPIResponse & { data: { customer: Customer } }> => {
		const response = await apiClient.patch(`${API_ROUTES.CUSTOMERS}/${id}/suspend`);
		return response.data;
	},
};
