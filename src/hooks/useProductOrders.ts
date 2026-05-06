import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi, PRODUCT_ORDER_STATUS } from '../api/orders';
import { queryKeys } from '@/config/query.keys';
import { toast } from 'sonner';

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

export const useUpdateOrderTrackingMutation = (businessId: string, orderId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			status: string;
			location: string;
			isDelayed: boolean;
			estimatedArrival?: string;
			remarks?: string;
			orderStatus: PRODUCT_ORDER_STATUS;
		}) => ordersApi.updateOrderTracking(businessId, orderId, data),
		onSuccess: (response) => {
			toast.success(response.message || 'Order tracking updated!');
			queryClient.invalidateQueries({ queryKey: [...queryKeys.orders, businessId, orderId] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update tracking');
		},
	});
};
