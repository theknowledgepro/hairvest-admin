import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/config/routes.app';

interface ProductHeaderProps {
	title: string;
	productKey: string;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({ title, productKey }) => {
	const navigate = useNavigate();

	return (
		<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
			<div className='flex items-center gap-4'>
				<Button variant='ghost' size='icon' onClick={() => navigate(-1)} className='text-neutral-400 hover:text-white hover:bg-neutral-800'>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white'>{title}</h2>
					<p className='text-neutral-400 mt-1'>Product ID: {productKey}</p>
				</div>
			</div>

			<Button onClick={() => navigate(`${APP_ROUTES.PRODUCTS}/edit/${productKey}`)} className='bg-blue-600 hover:bg-blue-500 text-white'>
				<Edit className='mr-2 h-4 w-4' /> Edit Product
			</Button>
		</div>
	);
};
