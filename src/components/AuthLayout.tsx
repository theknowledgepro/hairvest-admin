import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { APP_ROUTES } from '@/config/routes.app';

export const AuthLayout: React.FC = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		);
	}

	if (isAuthenticated) return <Navigate to={APP_ROUTES.DASHBOARD} />;
	return (
		<div className='min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden'>
			{/* Premium Background Gadients */}
			<div className='absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none' />
			<div className='absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none' />

			{/* Main Auth Container */}
			<div className='relative z-10 w-full max-w-md bg-neutral-900/60 backdrop-blur-xl border border-neutral-800 shadow-2xl rounded-2xl p-8 mb-10 transition-all duration-500 hover:shadow-blue-500/10 hover:border-neutral-700'>
				<div className='text-center mb-8'>
					<h1 className='text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>HairVest Admin</h1>
					<p className='text-neutral-400 text-sm mt-2 font-medium'>Manage your business effortlessly</p>
				</div>

				<Outlet />
			</div>
		</div>
	);
};
