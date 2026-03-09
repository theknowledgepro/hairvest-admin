import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customersApi } from '../api/customers';
import { queryKeys } from '@/config/query.keys';

export const useCustomersQuery = (params?: { page?: number; limit?: number }) => {
	return useQuery({
		queryKey: [...queryKeys.customers, params?.page, params?.limit],
		queryFn: () => customersApi.getCustomers(params),
	});
};

export const useCustomerDetailsQuery = (id?: string) => {
	return useQuery({
		queryKey: queryKeys.customerDetails(id || ''),
		queryFn: () => customersApi.getCustomerDetails(id!),
		enabled: !!id,
	});
};

export const useToggleCustomerSuspensionMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => customersApi.toggleSuspension(id),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.customers });
			// Ensure detail pages are invalidated/updated as well
			if (res.data?.customer?.key) {
				queryClient.invalidateQueries({ queryKey: queryKeys.customerDetails(res.data.customer.key) });
			}
			toast.success(res.message);
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update customer status');
		},
	});
};
