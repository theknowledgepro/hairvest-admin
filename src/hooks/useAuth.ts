import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, type AuthResponse, type LoginCredentials, type RegisterBusinessReq, type RegisterCustomerReq } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';
import { queryKeys } from '@/config/query.keys';
import { APP_ROUTES } from '@/config/routes.app';

export function useAuth() {
	const setAuth = useAuthStore((s) => s.setAuth);
	const query = useQuery({
		queryKey: queryKeys.refresh,
		queryFn: authApi.refresh,
		staleTime: 1000 * 60 * 60 * 1, // 1 hour(s)
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
	});

	useEffect(() => {
		if (query.data?.data) setAuth(query.data?.data?.accessToken, query.data?.data?.user);
	}, [query.data]);

	return {
		user: query.data?.data?.user ?? null,
		accessToken: query.data?.data?.accessToken ?? null,
		isAuthenticated: !!query.data?.data?.user && !!query?.data?.data?.accessToken,
		isLoading: query.isLoading,
		isError: query?.isError,
	};
}

const onLoginSuccess = (response: AuthResponse, queryClient: QueryClient, message: string) => {
	const token = response?.data?.accessToken;
	const user = response?.data?.user;
	if (token && user?.email) {
		queryClient.setQueryData(queryKeys.login, response?.data);
		useAuthStore.setState(() => ({ token, user }));
	}

	toast.success(message);

	// Invalidate all APIs that depends on auth
	// queryClient.invalidateQueries({ queryKey: ['dashboard'] });
	// queryClient.invalidateQueries({ queryKey: ['profile'] });
};

export const useLoginMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const location = useLocation();
	const from = (location.state as { from?: { pathname: string } })?.from?.pathname || APP_ROUTES.DASHBOARD;

	return useMutation({
		mutationFn: (data: LoginCredentials) => authApi.login(data),
		onSuccess: (response) => {
			onLoginSuccess(response, queryClient, 'Welcome back!');
			navigate(from, { replace: true });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
		},
	});
};

export const useRegisterBusinessMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const location = useLocation();
	const from = (location.state as { from?: { pathname: string } })?.from?.pathname || APP_ROUTES.DASHBOARD;

	return useMutation({
		mutationFn: (data: RegisterBusinessReq) => authApi.registerBusiness(data),
		onSuccess: (response) => {
			onLoginSuccess(response, queryClient, 'Business account created successfully!');
			navigate(from, { replace: true });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to register business.');
		},
	});
};

export const useRegisterCustomerMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const location = useLocation();
	const from = (location.state as { from?: { pathname: string } })?.from?.pathname || APP_ROUTES.DASHBOARD;

	return useMutation({
		mutationFn: (data: RegisterCustomerReq) => authApi.registerCustomer(data),
		onSuccess: (response) => {
			onLoginSuccess(response, queryClient, 'Account created successfully!');
			navigate(from, { replace: true });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to register. Please try again.');
		},
	});
};

export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationFn: (email: string) => authApi.forgotPassword(email),
		onSuccess: () => {
			toast.success('Reset instructions sent! Check your email inbox.');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
		},
	});
};

export const useVerifyPasswordResetOtpMutation = () => {
	return useMutation({
		mutationFn: (data: { email: string; otp: string }) => authApi.verifyPasswordResetOtp(data),
		onSuccess: () => {
			toast.success('OTP verified successfully!');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Invalid OTP. Please try again.');
		},
	});
};

export const useResetPasswordMutation = () => {
	return useMutation({
		mutationFn: (data: any) => authApi.resetPassword(data),
		onSuccess: () => {
			toast.success('Password reset successfully!');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
		},
	});
};

export const useLogoutMutation = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: authApi.logout,
		onSuccess: () => {
			// clear auth store
			useAuthStore.setState(() => ({ token: null, user: null }));
			useAuthStore.getState().clearAuth();

			// clear all cached queries
			queryClient.clear();

			toast.success('Logged out successfully');

			// redirect to login
			navigate(APP_ROUTES.LOGIN, { replace: true });
		},

		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to logout.');
		},
	});
};
