import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';

export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterBusinessReq {
	businessName: string;
	email: string;
	password: string;
}

export interface RegisterCustomerReq {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

export interface AuthResponse {
	token: string;
	user: {
		id: string;
		email: string;
		role: string;
	};
}

export const authApi = {
	login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
		const response = await apiClient.post<AuthResponse>(API_ROUTES.LOGIN, credentials);
		return response.data;
	},

	registerBusiness: async (data: RegisterBusinessReq): Promise<AuthResponse> => {
		const response = await apiClient.post<AuthResponse>('/auth/register/business', data);
		return response.data;
	},

	registerCustomer: async (data: RegisterCustomerReq): Promise<AuthResponse> => {
		const response = await apiClient.post<AuthResponse>('/auth/register/customer', data);
		return response.data;
	},

	forgotPassword: async (email: string): Promise<void> => {
		await apiClient.post('/auth/forgot-password', { email });
	},
};
