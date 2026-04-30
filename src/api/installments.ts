import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, PaginatedResult } from '@/types';
import type { ProductOrder } from './orders';
import type { Customer } from './customers';

export const INSTALLMENT_STATUS = {
	PENDING: 'PENDING',
	ACTIVE: 'ACTIVE',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
	OVERDUE: 'OVERDUE',
} as const;

export type INSTALLMENT_STATUS = (typeof INSTALLMENT_STATUS)[keyof typeof INSTALLMENT_STATUS];

export const INSTALLMENT_FREQUENCY = {
	WEEKLY: 'WEEKLY',
	MONTHLY: 'MONTHLY',
} as const;

export type INSTALLMENT_FREQUENCY = (typeof INSTALLMENT_FREQUENCY)[keyof typeof INSTALLMENT_FREQUENCY];

export interface InstallmentPlan {
	id: string;
	key: string;
	customer: Customer;
	order: ProductOrder;
	totalAmount: number;
	paidAmount: number;
	pendingBalance: number;
	installmentsCount: number;
	installmentsPaidCount: number;
	frequency: INSTALLMENT_FREQUENCY;
	status: INSTALLMENT_STATUS;
	nextPaymentDate: string | null;
	completedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface InstallmentHistory {
	id: string;
	key: string;
	amount: number;
	reference: string;
	paidAt: string;
}

export interface InstallmentDetails extends InstallmentPlan {
	history: InstallmentHistory[];
}

export const installmentsApi = {
	getInstallmentPlans: async (params?: {
		page?: number;
		limit?: number;
		status?: INSTALLMENT_STATUS;
	}): Promise<BaseAPIResponse & { data: PaginatedResult<InstallmentPlan> }> => {
		const response = await apiClient.get(API_ROUTES.INSTALLMENTS, { params });
		return response.data;
	},

	getInstallmentPlan: async (installmentId: string): Promise<BaseAPIResponse & { data: { plan: InstallmentDetails } }> => {
		const response = await apiClient.get(`${API_ROUTES.INSTALLMENTS}/${installmentId}`);
		return response.data;
	},

	cancelInstallmentPlan: async (installmentId: string): Promise<BaseAPIResponse & { data: { message: string; plan: InstallmentPlan } }> => {
		const response = await apiClient.patch(`${API_ROUTES.INSTALLMENTS}/${installmentId}/cancel`);
		return response.data;
	},
};
