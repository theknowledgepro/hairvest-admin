import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { LayoutDashboard, Users, LogOut, Search, Menu, X, Layers, Package, Contact, ShieldCheck, Star } from 'lucide-react';
import { useSidebarStore } from '../store/useSidebarStore';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Input } from './ui/input';
import { getCloudFileURL } from '@/lib/utils';
import { APP_ROUTES } from '@/config/routes.app';
import { useLogoutMutation } from '@/hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';

export const AdminLayout: React.FC = () => {
	const { isOpen, toggle, close } = useSidebarStore();
	const location = useLocation();
	const { user } = useAuthStore();
	const { mutate: logout } = useLogoutMutation();

	const handleLogout = () => {
		logout();
		window.location.href = APP_ROUTES.LOGIN;
	};

	const navLinks = [
		{ name: 'Overview', path: APP_ROUTES.DASHBOARD, icon: LayoutDashboard },
		{ name: 'My Customers', path: APP_ROUTES.CUSTOMERS, icon: Users },
		{ name: 'Product Categories', path: APP_ROUTES.CATEGORIES, icon: Layers },
		{ name: 'Products', path: APP_ROUTES.PRODUCTS, icon: Package },
		{ name: 'Reviews', path: APP_ROUTES.REVIEWS, icon: Star },
		{ name: 'Staff Members', path: APP_ROUTES.MEMBERS, icon: Contact },
		{ name: 'Roles & Permissions', path: APP_ROUTES.ROLES, icon: ShieldCheck },
	];

	return (
		<ProtectedRoute>
			<div className='min-h-screen bg-neutral-950 flex text-white font-sans overflow-hidden relative'>
				{/* Mobile Backdrop */}
				{isOpen && <div className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300' onClick={close} />}

				{/* Sidebar - Premium Glassmorphism Look */}
				<aside
					className={`fixed md:relative inset-y-0 left-0 w-72 bg-neutral-900/90 md:bg-neutral-900/40 backdrop-blur-3xl border-r border-neutral-800 flex flex-col transition-transform duration-300 ease-in-out z-50 md:translate-x-0 ${
						isOpen ? 'translate-x-0' : '-translate-x-full'
					}`}>
					<div className='h-16 flex items-center justify-between px-6 border-b border-neutral-800/60'>
						<div className='text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight'>
							HairVest
						</div>
						<button onClick={close} className='md:hidden p-2 text-neutral-400 hover:text-white transition-colors'>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3 mt-2'>
						<div className='text-xs uppercase text-neutral-500 font-semibold mb-2 px-3 tracking-wider'>Dashboard</div>
						{navLinks.map((link) => {
							const isActive =
								location.pathname === link.path ||
								(link.path !== APP_ROUTES.DASHBOARD &&
									location.pathname.startsWith(link.path + '/') &&
									!navLinks.some(
										(other) =>
											other.path !== link.path && location.pathname.startsWith(other.path) && other.path.length > link.path.length,
									));
							return (
								<Link
									key={link.name}
									to={link.path}
									onClick={() => {
										if (window.innerWidth < 768) close();
									}}
									className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
										isActive ? 'bg-blue-600/10 text-blue-400' : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-white'
									}`}>
									<link.icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-neutral-500 group-hover:text-white'}`} />
									{link.name}
								</Link>
							);
						})}
						<button
							onClick={handleLogout}
							className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group text-neutral-400 hover:text-white hover:bg-red-400/10`}>
							<LogOut className='h-4 w-4' />
							Logout
						</button>
					</div>

					<div className='p-4 border-t border-neutral-800/60'>
						<div className='flex items-center gap-3 bg-neutral-800/30 p-2.5 rounded-xl border border-neutral-800/60 transition hover:bg-neutral-800/50'>
							<Avatar className='h-8 w-8 ring-1 ring-neutral-700'>
								<AvatarImage src={getCloudFileURL(user?.avatar)}></AvatarImage>
								<AvatarFallback className='bg-blue-600 text-white text-xs'>{user?.email?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
							</Avatar>
							<div className='flex-1 min-w-0'>
								<p className='text-sm font-medium text-white truncate'>{user?.email || 'Admin User'}</p>
								<p className='text-xs text-neutral-500 truncate'>Administrator</p>
							</div>
						</div>
					</div>
				</aside>

				{/* Main Content */}
				<main className='flex-1 flex flex-col h-screen overflow-hidden bg-neutral-950 relative'>
					{/* Subtle background glow */}
					<div className='absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none' />

					<header className='h-16 border-b border-neutral-800/60 bg-neutral-950/80 backdrop-blur flex items-center justify-between px-4 md:px-8 z-10 sticky top-0'>
						<div className='flex items-center gap-4'>
							<button
								onClick={toggle}
								className='md:hidden p-2 -ml-2 text-neutral-400 hover:text-white transition-colors'
								aria-label='Toggle Menu'>
								<Menu className='h-5 w-5' />
							</button>
							<h1 className='text-lg font-semibold tracking-tight text-white capitalize'>
								{location.pathname.split('/').pop() === 'admin' ? 'Overview' : location.pathname.split('/').pop()?.replace('-', ' ')}
							</h1>
						</div>
						<div className='flex-1 max-w-md px-8 relative hidden md:block'>
							<Search className='absolute left-11 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500' />
							<Input
								placeholder='Search anything...'
								className='bg-neutral-900 border-neutral-800 pl-10 text-sm h-9 w-full focus-visible:ring-blue-500 rounded-full'
							/>
						</div>
					</header>

					<div className='flex-1 overflow-auto p-8 relative z-0 hide-scrollbar'>
						<Outlet />
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
};
