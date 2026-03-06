import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../config/routes.app';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../../lib/schemas/auth.schemas';
import { useForgotPasswordMutation, useVerifyPasswordResetOtpMutation, useResetPasswordMutation } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Loader2, ArrowLeft, Key, Mail, Lock } from 'lucide-react';

type Step = 'email' | 'otp' | 'reset';

export const ForgotPassword: React.FC = () => {
	const navigate = useNavigate();
	const [step, setStep] = useState<Step>('email');
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');

	const { mutate: sendInstructions, isPending: isSending } = useForgotPasswordMutation();
	const { mutate: verifyOtp, isPending: isVerifying } = useVerifyPasswordResetOtpMutation();
	const { mutate: resetPassword, isPending: isResetting } = useResetPasswordMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
	});

	const onEmailSubmit = (data: { email: string }) => {
		sendInstructions(data.email, {
			onSuccess: () => {
				setEmail(data.email);
				setStep('otp');
			},
		});
	};

	const onOtpSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!otp) return;
		verifyOtp(
			{ email, otp },
			{
				onSuccess: () => setStep('reset'),
			},
		);
	};

	const onResetSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const password = (e.target as any).password.value;
		const confirmPassword = (e.target as any).confirmPassword.value;
		if (password !== confirmPassword) return; // Should use zod for this in a real app

		resetPassword(
			{ email, otp, password },
			{
				onSuccess: () => navigate(APP_ROUTES.LOGIN),
			},
		);
	};

	return (
		<div className='animate-in fade-in slide-in-from-right-4 duration-500'>
			<div className='mb-6'>
				<Link to={APP_ROUTES.LOGIN} className='inline-flex items-center text-xs text-neutral-400 hover:text-white transition-colors mb-4'>
					<ArrowLeft className='mr-1 h-3 w-3' /> Back to Login
				</Link>
				<h2 className='text-2xl font-bold text-white tracking-tight'>
					{step === 'email' && 'Reset Password'}
					{step === 'otp' && 'Verify OTP'}
					{step === 'reset' && 'Create New Password'}
				</h2>
				<p className='text-neutral-400 text-sm mt-1'>
					{step === 'email' && "Enter your email and we'll send you a reset link."}
					{step === 'otp' && `Enter the 4-digit code sent to ${email}`}
					{step === 'reset' && 'Enter your new password below.'}
				</p>
			</div>

			{step === 'email' && (
				<form onSubmit={handleSubmit(onEmailSubmit)} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='email' className='text-neutral-300'>
							Email Address
						</Label>
						<div className='relative'>
							<Mail className='absolute left-3 top-2.5 h-4 w-4 text-neutral-500' />
							<Input
								id='email'
								type='email'
								placeholder='admin@hairvest.com'
								{...register('email')}
								className='bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500 pl-10'
							/>
						</div>
						{errors.email && <p className='text-xs text-red-400'>{errors.email.message}</p>}
					</div>

					<Button
						type='submit'
						className='w-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20'
						disabled={isSending}>
						{isSending ?
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						:	'Send Reset Link'}
					</Button>
				</form>
			)}

			{step === 'otp' && (
				<form onSubmit={onOtpSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='otp' className='text-neutral-300'>
							Verification Code
						</Label>
						<div className='relative'>
							<Key className='absolute left-3 top-2.5 h-4 w-4 text-neutral-500' />
							<Input
								id='otp'
								type='text'
								maxLength={4}
								placeholder='0000'
								value={otp}
								onChange={(e) => setOtp(e.target.value)}
								className='bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500 pl-10 text-center tracking-[1em] font-bold'
							/>
						</div>
					</div>

					<Button
						type='submit'
						className='w-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20'
						disabled={isVerifying}>
						{isVerifying ?
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						:	'Verify Code'}
					</Button>
					<button type='button' onClick={() => setStep('email')} className='w-full text-xs text-neutral-500 hover:text-white transition-colors'>
						Didn't receive code? Try again
					</button>
				</form>
			)}

			{step === 'reset' && (
				<form onSubmit={onResetSubmit} className='space-y-4'>
					<div className='space-y-2'>
						<Label htmlFor='password' className='text-neutral-300'>
							New Password
						</Label>
						<div className='relative'>
							<Lock className='absolute left-3 top-2.5 h-4 w-4 text-neutral-500' />
							<Input
								id='password'
								name='password'
								type='password'
								placeholder='••••••••'
								required
								className='bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500 pl-10'
							/>
						</div>
					</div>
					<div className='space-y-2'>
						<Label htmlFor='confirmPassword' className='text-neutral-300'>
							Confirm Password
						</Label>
						<div className='relative'>
							<Lock className='absolute left-3 top-2.5 h-4 w-4 text-neutral-500' />
							<Input
								id='confirmPassword'
								name='confirmPassword'
								type='password'
								placeholder='••••••••'
								required
								className='bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500 pl-10'
							/>
						</div>
					</div>

					<Button
						type='submit'
						className='w-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20'
						disabled={isResetting}>
						{isResetting ?
							<Loader2 className='mr-2 h-4 w-4 animate-spin' />
						:	'Reset Password'}
					</Button>
				</form>
			)}
		</div>
	);
};
