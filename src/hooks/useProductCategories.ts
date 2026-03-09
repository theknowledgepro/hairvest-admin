import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productCategoriesApi } from '../api/productCategories';
import { toast } from 'sonner';
import { queryKeys } from '@/config/query.keys';

export const useProductCategoriesQuery = (businessId?: string) => {
	return useQuery({
		queryKey: [...queryKeys.productCategories, businessId],
		queryFn: () => productCategoriesApi.getProductCategories(businessId!),
		enabled: !!businessId,
	});
};

export const useCreateCategoryMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: FormData) => productCategoriesApi.addProductCategory(data),
		onSuccess: (response) => {
			toast.success(response.message || 'Category created successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.productCategories });
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to create category');
		},
	});
};

export const useUpdateCategoryMutation = (onSuccess?: () => void) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: FormData }) => productCategoriesApi.updateProductCategory(id, data),
		onSuccess: (response) => {
			toast.success(response.message || 'Category updated successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.productCategories });
			if (onSuccess) onSuccess();
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update category');
		},
	});
};

export const useDeleteCategoryMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => productCategoriesApi.deleteProductCategory(id),
		onSuccess: () => {
			toast.success('Category deleted successfully');
			queryClient.invalidateQueries({ queryKey: queryKeys.productCategories });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to delete category');
		},
	});
};

export const useToggleCategoryAvailabilityMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => productCategoriesApi.toggleProductCategoryAvailability(id),
		onSuccess: (response) => {
			toast.success(response.message || 'Category status updated');
			queryClient.invalidateQueries({ queryKey: queryKeys.productCategories });
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || 'Failed to update category status');
		},
	});
};
