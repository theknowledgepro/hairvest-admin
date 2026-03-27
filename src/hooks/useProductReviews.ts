import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../api/reviews';
import { toast } from 'sonner';
import { queryKeys } from '@/config/query.keys';

export const useProductReviewsQuery = (params?: {
	businessId?: string;
	page?: number;
	limit?: number;
	productId?: string;
	customerId?: string;
	rating?: number;
	published?: boolean;
}) => {
	return useQuery({
		queryKey: [...queryKeys.reviews, params],
		queryFn: () => reviewsApi.getReviews(params as any),
		enabled: !!params?.businessId,
	});
};

export const useProductReviewQuery = (id?: string) => {
	return useQuery({
		queryKey: [...queryKeys.reviews, id],
		queryFn: () => reviewsApi.getReview(id!),
		enabled: !!id,
	});
};

export const useReviewLikesQuery = (reviewId: string, params?: { page?: number; limit?: number }) => {
	return useQuery({
		queryKey: [...queryKeys.reviews, reviewId, 'likes', params],
		queryFn: () => reviewsApi.getReviewLikes(reviewId, params),
		enabled: !!reviewId,
	});
};

export const useAddProductReviewMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { productId: string; customerId: string; rating: number; comment: string; published: boolean }) => reviewsApi.addReview(data),
		onSuccess: (response) => {
			toast.success(response.message || 'Review added successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to add review');
		},
	});
};

export const useUpdateProductReviewMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: { rating?: number; comment?: string; published?: boolean } }) => reviewsApi.updateReview(id, data),
		onSuccess: (response) => {
			toast.success(response.message || 'Review updated successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update review');
		},
	});
};

export const useDeleteProductReviewMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => reviewsApi.deleteReview(id),
		onSuccess: () => {
			toast.success('Review deleted successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.reviews });
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to delete review');
		},
	});
};
