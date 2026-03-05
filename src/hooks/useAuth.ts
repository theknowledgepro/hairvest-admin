import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi, type LoginCredentials, type RegisterBusinessReq, type RegisterCustomerReq } from '../api/auth';
import { useAuthStore } from '../store/useAuthStore';

export const useLoginMutation = () => {
	const setAuth = useAuthStore((s) => s.setAuth);
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: LoginCredentials) => authApi.login(data),
		onSuccess: (response) => {
			console.log({ response });
			setAuth(response.token, response.user);
			toast.success('Welcome back!');
			navigate('/admin');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to login. Please try again.');
		},
	});
};

export const useForgotPasswordMutation = () => {
	return useMutation({
		mutationFn: (email: string) => authApi.forgotPassword(email),
		onSuccess: () => {
			toast.success('Reset link sent! Check your email inbox.');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to send reset email. Please try again.');
		},
	});
};

export const useRegisterBusinessMutation = () => {
	const setAuth = useAuthStore((s) => s.setAuth);
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: RegisterBusinessReq) => authApi.registerBusiness(data),
		onSuccess: (response) => {
			setAuth(response.token, response.user);
			toast.success('Business account created successfully!');
			navigate('/admin');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to register business.');
		},
	});
};

export const useRegisterCustomerMutation = () => {
	const setAuth = useAuthStore((s) => s.setAuth);
	const navigate = useNavigate();

	return useMutation({
		mutationFn: (data: RegisterCustomerReq) => authApi.registerCustomer(data),
		onSuccess: (response) => {
			setAuth(response.token, response.user);
			toast.success('Account created successfully!');
			navigate('/admin');
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || 'Failed to register. Please try again.');
		},
	});
};
