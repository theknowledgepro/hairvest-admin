import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, User } from '@/types';

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

export type AuthResponse = BaseAPIResponse & {
	data: {
		accessToken: string;
		user: User;
	};
};

export const authApi = {
	refresh: async (): Promise<AuthResponse> => {
		const response = await apiClient.get<AuthResponse>(API_ROUTES.REFRESH);
		return response.data;
	},

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
		await apiClient.post(API_ROUTES.SEND_PASSWORD_RESET_INSTRUCTIONS, { email });
	},

	verifyPasswordResetOtp: async (data: { email: string; otp: string }): Promise<void> => {
		await apiClient.post(API_ROUTES.VERIFY_PASSWORD_RESET_OTP, data);
	},

	resetPassword: async (data: any): Promise<void> => {
		await apiClient.post(API_ROUTES.RESET_PASSWORD, data);
	},

	logout: async (): Promise<BaseAPIResponse> => {
		const response = await apiClient.delete<BaseAPIResponse>(API_ROUTES.LOGOUT);
		return response.data;
	},
};
