import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { installmentsApi, INSTALLMENT_STATUS } from '../api/installments';
import { toast } from 'sonner';
import { queryKeys } from '@/config/query.keys';

export const useInstallmentsQuery = (params?: {
	page?: number;
	limit?: number;
	status?: INSTALLMENT_STATUS;
}) => {
	return useQuery({
		queryKey: [...queryKeys.installments, params],
		queryFn: () => installmentsApi.getInstallmentPlans(params),
	});
};

export const useInstallmentPlanQuery = (installmentId: string) => {
	return useQuery({
		queryKey: [...queryKeys.installments, installmentId],
		queryFn: () => installmentsApi.getInstallmentPlan(installmentId),
		enabled: !!installmentId,
	});
};

export const useCancelInstallmentMutation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (installmentId: string) => installmentsApi.cancelInstallmentPlan(installmentId),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.installments });
			toast.success(res.data.message || 'Installment plan cancelled successfully!');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to cancel installment plan.');
		},
	});
};
