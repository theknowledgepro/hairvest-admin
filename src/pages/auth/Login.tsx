import React from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { APP_ROUTES } from '../../config/routes.app';
import { loginSchema, type LoginFormValues } from '../../lib/schemas/auth.schemas';
import { useLoginMutation } from '../../hooks/useAuth';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Loader2 } from 'lucide-react';

export const Login: React.FC = () => {
	const { mutate: login, isPending } = useLoginMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
	});

	const onSubmit = (data: LoginFormValues) => {
		login(data);
	};

	return (
		<div className='animate-in fade-in zoom-in-95 duration-500'>
			<div className='mb-6'>
				<h2 className='text-2xl font-bold text-white tracking-tight'>Welcome back</h2>
				<p className='text-neutral-400 text-sm'>Enter your credentials to access the portal.</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<div className='space-y-2'>
					<Label htmlFor='email' className='text-neutral-300'>
						Email Address
					</Label>
					<Input
						id='email'
						type='email'
						placeholder='admin@hairvest.com'
						{...register('email')}
						className='bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500'
					/>
					{errors.email && <p className='text-xs text-red-400'>{errors.email.message}</p>}
				</div>

				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<Label htmlFor='password' className='text-neutral-300'>
							Password
						</Label>
						<Link to={APP_ROUTES.FORGOT_PASSWORD} className='text-xs text-blue-400 hover:text-blue-300 transition-colors'>
							Forgot password?
						</Link>
					</div>
					<Input
						id='password'
						type='password'
						{...register('password')}
						className='bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500'
					/>
					{errors.password && <p className='text-xs text-red-400'>{errors.password.message}</p>}
				</div>

				<Button
					type='submit'
					className='w-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-500/20'
					disabled={isPending}>
					{isPending ?
						<Loader2 className='mr-2 h-4 w-4 animate-spin' />
					:	'Sign In'}
				</Button>
			</form>
		</div>
	);
};
