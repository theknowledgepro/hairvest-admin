import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../api/requests';
import { queryKeys } from '@/config/query.keys';

export const useCustomerRequestsQuery = (businessId: string, page = 1, limit = 20, search = '') => {
	return useQuery({
		queryKey: [...queryKeys.customerRequests, businessId, page, limit, search],
		queryFn: () => requestsApi.getRequests(businessId, page, limit, search),
	});
};

export const useCustomerRequestDetailQuery = (requestId: string) => {
	return useQuery({
		queryKey: [...queryKeys.customerRequests, 'detail', requestId],
		queryFn: () => requestsApi.getRequestDetail(requestId),
		enabled: !!requestId,
	});
};
