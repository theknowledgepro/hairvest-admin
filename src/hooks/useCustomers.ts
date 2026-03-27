import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { customersApi } from '../api/customers';
import type { Customer } from '../api/customers';
import { queryKeys } from '@/config/query.keys';

export const useCustomersQuery = (params?: { page?: number; limit?: number; search?: string }) => {
	return useQuery({
		queryKey: [...queryKeys.customers, params?.page, params?.limit, params?.search],
		queryFn: () => customersApi.getCustomers(params),
	});
};

export const useCreateCustomerMutation = (onSuccess?: (customer: Customer) => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: Partial<Customer>) => customersApi.createCustomer(data),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.customers });
			toast.success(res.message);
			if (onSuccess && res.data?.customer) onSuccess(res.data.customer);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to create customer');
		},
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

export const useUpdateCustomerMutation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) => customersApi.updateCustomer(id, data),
		onSuccess: (res, variables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.customerDetails(variables.id) });
			queryClient.invalidateQueries({ queryKey: queryKeys.customers });
			toast.success(res.message || 'Profile updated');
		},
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to update profile'),
	});
};

// Addresses
export const useCustomerAddressesQuery = (customerId: string) => {
	return useQuery({
		queryKey: ['customer', customerId, 'addresses'],
		queryFn: () => customersApi.getAddresses(customerId),
		enabled: !!customerId,
	});
};

export const useAddAddressMutation = (customerId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => customersApi.addAddress(customerId, data),
		onSuccess: () => {
			toast.success('Address added');
			queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'addresses'] });
		},
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to add address'),
	});
};

export const useUpdateAddressMutation = (customerId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ addressId, data }: { addressId: string; data: any }) => customersApi.updateAddress(addressId, data),
		onSuccess: () => {
			toast.success('Address updated');
			queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'addresses'] });
		},
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to update address'),
	});
};

export const useDeleteAddressMutation = (customerId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (addressId: string) => customersApi.deleteAddress(addressId),
		onSuccess: () => {
			toast.success('Address deleted');
			queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'addresses'] });
		},
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to delete address'),
	});
};

// Cards
export const useCustomerCardsQuery = (customerId: string) => {
	return useQuery({
		queryKey: ['customer', customerId, 'cards'],
		queryFn: () => customersApi.getCards(customerId),
		enabled: !!customerId,
	});
};

export const useAddCardMutation = (customerId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: any) => customersApi.addCard(customerId, data),
		onSuccess: () => {
			toast.success('Card added');
			queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'cards'] });
		},
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to add card'),
	});
};

export const useUpdateCardMutation = (customerId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ cardId, data }: { cardId: string; data: any }) => customersApi.updateCard(cardId, data),
		onSuccess: () => {
			toast.success('Card updated');
			queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'cards'] });
		},
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to update card'),
	});
};

export const useDeleteCardMutation = (customerId: string) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (cardId: string) => customersApi.deleteCard(cardId),
		onSuccess: () => {
			toast.success('Card deleted');
			queryClient.invalidateQueries({ queryKey: ['customer', customerId, 'cards'] });
		},
		onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to delete card'),
	});
};
