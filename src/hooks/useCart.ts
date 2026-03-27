import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartApi } from '../api/cart';
import { toast } from 'sonner';

export const useCustomerCartQuery = (customerId: string) => {
	return useQuery({
		queryKey: ['cart', customerId],
		queryFn: () => cartApi.getCart(customerId),
		enabled: !!customerId,
	});
};

export const useRemoveFromCartMutation = (customerId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (itemId: string) => cartApi.removeFromCart(itemId),
		onSuccess: () => {
			toast.success('Item removed from cart');
			queryClient.invalidateQueries({ queryKey: ['cart', customerId] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to remove item');
		},
	});
};

export const useClearCartMutation = (customerId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => cartApi.clearCart(customerId),
		onSuccess: () => {
			toast.success('Cart cleared');
			queryClient.invalidateQueries({ queryKey: ['cart', customerId] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to clear cart');
		},
	});
};
