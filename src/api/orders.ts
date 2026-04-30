import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, PaginatedResult } from '@/types';
import type { Product } from './products';
import type { Customer } from './customers';

export const PRODUCT_ORDER_STATUS = {
	PENDING: 'PENDING',
	PAID: 'PAID',
	PROCESSING: 'PROCESSING',
	SHIPPED: 'SHIPPED',
	COMPLETED: 'COMPLETED',
	CANCELLED: 'CANCELLED',
} as const;

export type PRODUCT_ORDER_STATUS = (typeof PRODUCT_ORDER_STATUS)[keyof typeof PRODUCT_ORDER_STATUS];

export interface ProductOrder {
	id: string;
	key: string;
	reference: string;
	email: string;
	product: Product;
	customer: Customer;
	currency: string;
	amount: number;
	quantity: number;
	checkoutAmount: number;
	coupon?: { id: string; code: string; key: string; type: string };
	paystackAccessCode?: string;
	paidAt?: string;
	paymentChannel?: string;
	paymentMethod?: string;
	status: PRODUCT_ORDER_STATUS;
	isPaid: boolean;
	isPaymentCompleted: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export const ordersApi = {
	getOrders: async (params?: {
		businessId: string;
		page?: number;
		limit?: number;
		productId?: string;
		customerId?: string;
		isPaid?: boolean;
		reference?: string;
	}): Promise<BaseAPIResponse & { data: PaginatedResult<ProductOrder> }> => {
		const response = await apiClient.get(`${API_ROUTES.ORDERS}/${params?.businessId}`, { params });
		return response.data;
	},

	getOrder: async (businessId: string, orderId: string): Promise<BaseAPIResponse & { data: { order: ProductOrder } }> => {
		const response = await apiClient.get(`${API_ROUTES.ORDERS}/${businessId}/item/${orderId}`);
		return response.data;
	},
};
