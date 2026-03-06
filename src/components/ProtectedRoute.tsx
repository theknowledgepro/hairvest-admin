import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { APP_ROUTES } from '@/config/routes.app';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth();

	const location = useLocation();

	if (isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<Loader2 className='h-8 w-8 animate-spin text-primary' />
			</div>
		);
	}

	if (!isAuthenticated) {
		return <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />;
	}

	return <>{children}</>;
}

export default ProtectedRoute;
