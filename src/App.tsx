import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthLayout } from './components/AuthLayout';
import { Login } from './pages/auth/Login';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { APP_ROUTES } from './config/routes.app';
import { TooltipProvider } from './components/ui/tooltip';
import { AdminLayout } from './components/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { StaffRoles } from './pages/admin/StaffRoles';
import { StaffMembers } from './pages/admin/StaffMembers';
import { ProductCategories } from './pages/admin/ProductCategories';
import { Products } from './pages/admin/Products';
import { ProductForm } from './pages/admin/ProductForm';
import { Customers } from './pages/admin/Customers';
import { CustomerDetails } from './pages/admin/CustomerDetails';

const queryClient = new QueryClient();

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<TooltipProvider>
				<BrowserRouter>
					<Routes>
						<Route path='/' element={<Navigate to='/auth/login' replace />} />

						{/* Authentication Routes */}
						<Route path='/auth' element={<AuthLayout />}>
							<Route path='login' element={<Login />} />
							<Route path='forgot-password' element={<ForgotPassword />} />
						</Route>

						{/* Admin Routes */}
						<Route path={APP_ROUTES.DASHBOARD} element={<AdminLayout />}>
							<Route index element={<Dashboard />} />
							<Route path='roles' element={<StaffRoles />} />
							<Route path='members' element={<StaffMembers />} />
							<Route path='customers'>
								<Route index element={<Customers />} />
								<Route path=':id' element={<CustomerDetails />} />
							</Route>
							<Route path='products'>
								<Route index element={<Products />} />
								<Route path='categories' element={<ProductCategories />} />
								<Route path='new' element={<ProductForm />} />
								<Route path='edit/:id' element={<ProductForm />} />
							</Route>
						</Route>

						<Route path='*' element={<Navigate to='/' replace />} />
					</Routes>
				</BrowserRouter>
				<Toaster
					position='top-right'
					theme='dark'
					toastOptions={{
						style: {
							background: '#171717',
							border: '1px solid #262626',
							color: '#fff',
						},
					}}
				/>
			</TooltipProvider>
		</QueryClientProvider>
	);
}

export default App;
