import { useQuery } from '@tanstack/react-query';
import { insightsApi } from '../api/insights';
import { queryKeys } from '@/config/query.keys';

export const useCartInsightsQuery = (page = 1, limit = 50, search = '') => {
	return useQuery({
		queryKey: [...queryKeys.cartInsights, page, limit, search],
		queryFn: () => insightsApi.getCartInsights(page, limit, search),
	});
};

export const useWishlistInsightsQuery = (page = 1, limit = 50, search = '') => {
	return useQuery({
		queryKey: [...queryKeys.wishlistInsights, page, limit, search],
		queryFn: () => insightsApi.getWishlistInsights(page, limit, search),
	});
};
