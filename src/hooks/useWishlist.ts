import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlist';
import { toast } from 'sonner';

export const useCustomerWishlistQuery = (customerId: string) => {
	return useQuery({
		queryKey: ['wishlist', customerId],
		queryFn: () => wishlistApi.getWishlist(customerId),
		enabled: !!customerId,
	});
};

export const useRemoveFromWishlistMutation = (customerId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (itemId: string) => wishlistApi.removeFromWishlist(itemId),
		onSuccess: () => {
			toast.success('Item removed from wishlist');
			queryClient.invalidateQueries({ queryKey: ['wishlist', customerId] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to remove item');
		},
	});
};

export const useClearWishlistMutation = (customerId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: () => wishlistApi.clearWishlist(customerId),
		onSuccess: () => {
			toast.success('Wishlist cleared');
			queryClient.invalidateQueries({ queryKey: ['wishlist', customerId] });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to clear wishlist');
		},
	});
};
