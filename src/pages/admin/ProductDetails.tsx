import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductQuery } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { APP_ROUTES } from '@/config/routes.app';
import { useAuthStore } from '@/store/useAuthStore';
import { ProductHeader } from '@/components/admin/products/ProductHeader';
import { ProductStats } from '@/components/admin/products/ProductStats';
import { ProductOverview } from '@/components/admin/products/ProductOverview';
import { ProductOrders } from '@/components/admin/products/ProductOrders';
import { ProductReviews } from '@/components/admin/products/ProductReviews';

export const ProductDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const { user } = useAuthStore();
	const { data: productData, isLoading: isLoadingProduct } = useProductQuery(id);
	const product = productData?.data?.product;
	const [activeTab, setActiveTab] = React.useState('overview');

	if (isLoadingProduct) {
		return (
			<div className='flex items-center justify-center h-[600px]'>
				<Loader2 className='h-10 w-10 animate-spin text-blue-500' />
			</div>
		);
	}

	if (!product) {
		return (
			<div className='flex flex-col items-center justify-center h-[600px] text-neutral-400'>
				<AlertCircle className='h-12 w-12 mb-4 text-amber-500' />
				<h3 className='text-xl font-bold text-white'>Product not found</h3>
				<p className='mt-1 text-sm'>The product you're looking for might have been deleted or moved.</p>
				<Button variant='link' onClick={() => navigate(APP_ROUTES.PRODUCTS)} className='text-blue-500 mt-4'>
					<ArrowLeft className='mr-2 h-4 w-4' /> Back to Products
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
			{/* Header Component */}
			<ProductHeader title={product.title} productKey={product.key} />

			{/* Stats Grid Component */}
			<ProductStats
				salesCount={product.salesCount}
				salesTotal={product.salesTotal || 0}
				availableStock={product.availableStock}
				avgRating={product.avgRating}
				reviewsCount={product.reviewsCount}
				currency={product.currency}
			/>

			{/* Detailed Tabs Section */}
			<Tabs value={activeTab} onValueChange={setActiveTab} className='space-y-6'>
				<TabsList className='bg-neutral-900 border-neutral-800 p-1 h-12'>
					<TabsTrigger value='overview' className='px-6 data-[state=active]:bg-neutral-800 data-[state=active]:text-white transition-all'>
						Overview
					</TabsTrigger>
					<TabsTrigger value='orders' className='px-6 data-[state=active]:bg-neutral-800 data-[state=active]:text-white transition-all'>
						Orders ({product.salesCount} paid)
					</TabsTrigger>
					<TabsTrigger value='reviews' className='px-6 data-[state=active]:bg-neutral-800 data-[state=active]:text-white transition-all'>
						Reviews ({product.reviewsCount})
					</TabsTrigger>
				</TabsList>

				<TabsContent value='overview' className='mt-6 outline-none'>
					<ProductOverview
						summary={product.summary}
						amount={product.amount}
						discountPercent={product.discountPercent}
						currency={product.currency}
						isFlashSale={product.isFlashSale}
						productKey={product.key}
						images={product.images}
						title={product.title}
					/>
				</TabsContent>

				<TabsContent value='orders' className='mt-6 outline-none'>
					<ProductOrders businessId={user?.businessId || ''} productId={product.key} />
				</TabsContent>

				<TabsContent value='reviews' className='mt-6 outline-none'>
					<ProductReviews businessId={user?.businessId || ''} productId={product.key} />
				</TabsContent>
			</Tabs>
		</div>
	);
};
