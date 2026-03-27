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
	country: { label: string; value: string };
	state: { label: string; value: string };
	suspended: boolean;
	createdAt: string;
	updatedAt: string;
}

export const customersApi = {
	getCustomers: async (params?: { page?: number; limit?: number; search?: string }): Promise<BaseAPIResponse & { data: PaginatedResult<Customer> }> => {
		const response = await apiClient.get(API_ROUTES.CUSTOMERS, { params });
		return response.data;
	},

	createCustomer: async (data: Partial<Customer>): Promise<BaseAPIResponse & { data: { customer: Customer } }> => {
		const response = await apiClient.post(API_ROUTES.CUSTOMERS, data);
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

	updateCustomer: async (id: string, data: Partial<Customer>): Promise<BaseAPIResponse & { data: { customer: Customer } }> => {
		const response = await apiClient.patch(`${API_ROUTES.CUSTOMERS}/${id}`, data);
		return response.data;
	},

	// Addresses
	getAddresses: async (customerId: string): Promise<BaseAPIResponse & { data: { results: any[] } }> => {
		const response = await apiClient.get(`/addresses/customer/${customerId}`); // Adjust URL based on my route setup
		return response.data;
	},
	addAddress: async (customerId: string, data: any): Promise<BaseAPIResponse & { data: { address: any } }> => {
		const response = await apiClient.post(`/addresses/customer/${customerId}`, data);
		return response.data;
	},
	updateAddress: async (addressId: string, data: any): Promise<BaseAPIResponse & { data: { address: any } }> => {
		const response = await apiClient.patch(`/addresses/${addressId}`, data);
		return response.data;
	},
	deleteAddress: async (addressId: string): Promise<BaseAPIResponse> => {
		const response = await apiClient.delete(`/addresses/${addressId}`);
		return response.data;
	},

	// Cards
	getCards: async (customerId: string): Promise<BaseAPIResponse & { data: { results: any[] } }> => {
		const response = await apiClient.get(`/cards/customer/${customerId}`);
		return response.data;
	},
	addCard: async (customerId: string, data: any): Promise<BaseAPIResponse & { data: { card: any } }> => {
		const response = await apiClient.post(`/cards/customer/${customerId}`, data);
		return response.data;
	},
	updateCard: async (cardId: string, data: any): Promise<BaseAPIResponse & { data: { card: any } }> => {
		const response = await apiClient.patch(`/cards/${cardId}`, data);
		return response.data;
	},
	deleteCard: async (cardId: string): Promise<BaseAPIResponse> => {
		const response = await apiClient.delete(`/cards/${cardId}`);
		return response.data;
	},
};
