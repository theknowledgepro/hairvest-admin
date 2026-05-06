import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { toast } from 'sonner';
import { queryKeys } from '@/config/query.keys';

export const useProductsQuery = (params?: { businessId: string; page?: number; limit?: number; search?: string }) => {
	return useQuery({
		queryKey: [...queryKeys.products, params],
		queryFn: () => productsApi.getProducts(params!),
		enabled: !!params?.businessId,
	});
};

export const useProductsInfiniteQuery = (params?: { businessId: string; limit?: number; search?: string }) => {
	return useInfiniteQuery({
		queryKey: [...queryKeys.products, 'infinite', params],
		queryFn: ({ pageParam }) => productsApi.getProducts({ ...params!, page: pageParam as number }),
		getNextPageParam: (lastPage) => (lastPage.data?.hasNextPage ? lastPage.data.currentPage + 1 : undefined),
		initialPageParam: 1,
		enabled: !!params?.businessId,
	});
};

export const useProductQuery = (id?: string) => {
	return useQuery({
		queryKey: [...queryKeys.products, id],
		queryFn: () => productsApi.getProduct(id!),
		enabled: !!id,
	});
};

export const useCreateProductMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: FormData) => productsApi.addProduct(data),
		onSuccess: (response) => {
			toast.success(response.message || 'Product created successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to create product');
		},
	});
};

export const useUpdateProductMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: FormData }) => productsApi.updateProduct(id, data),
		onSuccess: (response) => {
			toast.success(response.message || 'Product updated successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update product');
		},
	});
};

export const useDeleteProductMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => productsApi.deleteProduct(id),
		onSuccess: () => {
			toast.success('Product deleted successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to delete product');
		},
	});
};

export const useToggleProductAvailabilityMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => productsApi.toggleProductAvailability(id),
		onSuccess: (response) => {
			toast.success(response.message || 'Product status updated');
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update product status');
		},
	});
};

export const useToggleProductFlashSaleMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => productsApi.toggleProductFlashSale(id),
		onSuccess: (response) => {
			toast.success(response.message || 'Product flash sale status updated');
			queryClient.invalidateQueries({ queryKey: queryKeys.products });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update product flash sale status');
		},
	});
};
