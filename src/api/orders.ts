import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, PaginatedResult, ImageType } from '@/types';
import type { Product } from './products';
import type { Customer } from './customers';

export const PRODUCT_ORDER_STATUS = {
	PENDING: 'PENDING', // Pending payment
	PAID: 'PAID', // Customer has paid
	PROCESSING: 'PROCESSING', // Business is processing the order
	SHIPPED: 'SHIPPED', // Order has been shipped
	COMPLETED: 'COMPLETED', // Order has been completed/delivered
	CANCELLED: 'CANCELLED', // Order has been cancelled
} as const;

export type PRODUCT_ORDER_STATUS = (typeof PRODUCT_ORDER_STATUS)[keyof typeof PRODUCT_ORDER_STATUS];

export interface ProductOrderItem {
	product: Product;
	quantity: number;
	amount: number;
	checkoutAmount: number;
	discountPercent: number;
}

export interface OrderAddress {
	id: string;
	key: string;
	phone: {
		international: string;
		national: string;
		uri: string;
	};
	country: {
		label: string;
		value: string;
	};
	state: {
		label: string;
		value: string;
	};
	firstName: string;
	lastName: string;
	addressLine1: string;
	addressLine2?: string;
	apartment?: string;
	city: string;
	zipCode: string;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProductOrder {
	id: string;
	key: string;
	reference: string;
	email: string;
	address: OrderAddress;
	items: ProductOrderItem[];
	customer: Customer;
	currency: string;
	quantity: number;
	itemsAmount: number;
	itemsCheckoutAmount: number;
	discountPercent: number;
	shippingFee: number;
	shippingProtectionFee: number;
	checkoutAmount: number;
	paymentMethod?: string;
	paymentChannel?: string;
	completedPaymentAt?: string;
	coupon?: { id: string; code: string; key: string; type: string };
	isPaid: boolean;
	isPaymentCompleted: boolean;
	status: PRODUCT_ORDER_STATUS;
	paystackAccessCode?: string;
	trackingHistory?: OrderTracking[];
	createdAt: string;
	updatedAt: string;
}

export interface OrderTracking {
	id: string;
	key: string;
	status: string;
	location?: string;
	isDelayed: boolean;
	estimatedArrival?: string;
	remarks?: string;
	orderStatus: PRODUCT_ORDER_STATUS;
	updatedBy: {
		key: string;
		firstName: string;
		lastName: string;
		otherNames: string;
		email: string;
		avatar?: ImageType;
	};
	createdAt: string;
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

	updateOrderTracking: async (
		_businessId: string,
		orderId: string,
		data: {
			status: string;
			location: string;
			isDelayed: boolean;
			estimatedArrival?: string;
			remarks?: string;
			orderStatus: PRODUCT_ORDER_STATUS;
		},
	): Promise<BaseAPIResponse & { data: { tracking: OrderTracking } }> => {
		const response = await apiClient.put(`${API_ROUTES.ORDERS}/${orderId}/tracking`, data);
		return response.data;
	},
};
