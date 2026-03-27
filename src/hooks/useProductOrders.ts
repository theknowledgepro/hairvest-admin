import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../api/orders';
import { queryKeys } from '@/config/query.keys';

export const useProductOrdersQuery = (params?: {
	businessId?: string;
	page?: number;
	limit?: number;
	productId?: string;
	customerId?: string;
	isPaid?: boolean;
	reference?: string;
}) => {
	return useQuery({
		queryKey: [...queryKeys.orders, params],
		queryFn: () => ordersApi.getOrders(params as any),
		enabled: !!params?.businessId,
	});
};

export const useProductOrderQuery = (businessId?: string, orderId?: string) => {
	return useQuery({
		queryKey: [...queryKeys.orders, businessId, orderId],
		queryFn: () => ordersApi.getOrder(businessId!, orderId!),
		enabled: !!businessId && !!orderId,
	});
};
