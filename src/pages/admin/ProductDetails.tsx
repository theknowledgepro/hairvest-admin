import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductQuery } from '@/hooks/useProducts';
import { useProductOrdersQuery } from '@/hooks/useProductOrders';
import { useProductReviewsQuery } from '@/hooks/useProductReviews';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Package, ShoppingCart, Star, TrendingUp, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/formatDate';
import { APP_ROUTES } from '@/config/routes.app';
import { useAuthStore } from '@/store/useAuthStore';
import { getCloudFileURL } from '@/lib/utils';
import { AddReviewModal } from '@/components/admin/AddReviewModal';
import { Plus } from 'lucide-react';

export const ProductDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const { user } = useAuthStore();
	const { data: productData, isLoading: isLoadingProduct } = useProductQuery(id);
	const product = productData?.data?.product;
	const [isAddReviewModalOpen, setIsAddReviewModalOpen] = React.useState(false);

	const { data: ordersData } = useProductOrdersQuery({
		businessId: user?.businessId || '',
		productId: id,
		limit: 10,
	});

	const { data: reviewsData } = useProductReviewsQuery({
		businessId: user?.businessId || '',
		productId: id,
		limit: 10,
	});

	const orders = ordersData?.data?.results || [];
	const reviews = reviewsData?.data?.results || [];

	if (isLoadingProduct) {
		return (
			<div className='flex items-center justify-center h-full'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
			</div>
		);
	}

	if (!product) {
		return (
			<div className='flex flex-col items-center justify-center h-full text-neutral-400'>
				<AlertCircle className='h-12 w-12 mb-4' />
				<p>Product not found</p>
				<Button variant='link' onClick={() => navigate(APP_ROUTES.PRODUCTS)} className='text-blue-500 mt-2'>
					Back to Products
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
			{/* Header */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div className='flex items-center gap-4'>
					<Button variant='ghost' size='icon' onClick={() => navigate(-1)} className='text-neutral-400 hover:text-white hover:bg-neutral-800'>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h2 className='text-3xl font-bold tracking-tight text-white'>{product.title}</h2>
						<p className='text-neutral-400 mt-1'>Product ID: {product.key}</p>
					</div>
				</div>

				<Button onClick={() => navigate(`${APP_ROUTES.PRODUCTS}/edit/${product.key}`)} className='bg-blue-600 hover:bg-blue-500 text-white'>
					<Edit className='mr-2 h-4 w-4' /> Edit Product
				</Button>
			</div>

			{/* Stats Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
					<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
						<CardTitle className='text-sm font-medium text-neutral-400'>Total Sales</CardTitle>
						<TrendingUp className='h-4 w-4 text-emerald-400' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-white'>{product.salesCount}</div>
						<p className='text-xs text-neutral-500 mt-1'>Items sold to date</p>
					</CardContent>
				</Card>
				<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
					<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
						<CardTitle className='text-sm font-medium text-neutral-400'>Stock Available</CardTitle>
						<Package className='h-4 w-4 text-blue-400' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-white'>{product.availableStock}</div>
						<p className='text-xs text-neutral-500 mt-1'>Units in inventory</p>
					</CardContent>
				</Card>
				<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
					<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
						<CardTitle className='text-sm font-medium text-neutral-400'>Average Rating</CardTitle>
						<Star className='h-4 w-4 text-yellow-400' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-white'>{product.avgRating?.toFixed(1)}</div>
						<p className='text-xs text-neutral-500 mt-1'>Based on {product.reviewsCount} reviews</p>
					</CardContent>
				</Card>
				<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
					<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
						<CardTitle className='text-sm font-medium text-neutral-400'>Revenue</CardTitle>
						<ShoppingCart className='h-4 w-4 text-purple-400' />
					</CardHeader>
					<CardContent>
						<div className='text-2xl font-bold text-white'>
							{product.currency} {(product.amount * product.salesCount).toLocaleString()}
						</div>
						<p className='text-xs text-neutral-500 mt-1'>Estimated gross sales</p>
					</CardContent>
				</Card>
			</div>

			{/* Tabs Section */}
			<Tabs defaultValue='overview' className='space-y-4'>
				<TabsList className='bg-neutral-900 border-neutral-800 p-1'>
					<TabsTrigger value='overview' className='data-[state=active]:bg-neutral-800 data-[state=active]:text-white'>
						Overview
					</TabsTrigger>
					<TabsTrigger value='orders' className='data-[state=active]:bg-neutral-800 data-[state=active]:text-white'>
						Orders ({product.salesCount})
					</TabsTrigger>
					<TabsTrigger value='reviews' className='data-[state=active]:bg-neutral-800 data-[state=active]:text-white'>
						Reviews ({product.reviewsCount})
					</TabsTrigger>
				</TabsList>

				<TabsContent value='overview' className='space-y-4'>
					<Card className='bg-neutral-900/50 border-neutral-800'>
						<CardContent className='pt-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
								<div className='space-y-6'>
									<div>
										<h4 className='text-sm font-medium text-neutral-500 uppercase tracking-wider'>Summary</h4>
										<p className='text-neutral-200 mt-2 leading-relaxed'>{product.summary}</p>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div>
											<h4 className='text-sm font-medium text-neutral-500 uppercase tracking-wider'>Price</h4>
											<p className='text-xl font-semibold text-white mt-1'>
												{product.currency} {product.amount.toLocaleString()}
											</p>
										</div>
										<div>
											<h4 className='text-sm font-medium text-neutral-500 uppercase tracking-wider'>Flash Sale</h4>
											<p className={`text-lg font-medium mt-1 ${product.isFlashSale ? 'text-yellow-400' : 'text-neutral-500'}`}>
												{product.isFlashSale ? 'Active' : 'No'}
											</p>
										</div>
									</div>
									<div>
										<h4 className='text-sm font-medium text-neutral-500 uppercase tracking-wider'>Product ID</h4>
										<p className='text-neutral-300 mt-1 font-mono'>{product.key}</p>
									</div>
								</div>

								<div className='space-y-4'>
									<h4 className='text-sm font-medium text-neutral-500 uppercase tracking-wider'>Images</h4>
									<div className='grid grid-cols-2 gap-4'>
										{product.images?.map((img, i) => (
											<div key={i} className='aspect-square rounded-xl overflow-hidden border border-neutral-800'>
												<img
													src={getCloudFileURL(img.preview)}
													alt={`${product.title} ${i + 1}`}
													className='w-full h-full object-cover'
												/>
											</div>
										))}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='orders'>
					<Card className='bg-neutral-900/50 border-neutral-800 min-h-[400px]'>
						<CardContent className='pt-6'>
							{orders.length === 0 ?
								<div className='flex flex-col items-center justify-center py-20 text-neutral-500'>
									<Clock className='h-12 w-12 mb-4 opacity-20' />
									<p>No orders found for this product</p>
								</div>
							:	<div className='text-neutral-300'>
									{/* Basic list for now, will implement full table in next step */}
									<p className='mb-4 text-sm text-neutral-500'>Showing latest orders</p>
									<div className='space-y-3'>
										{orders.map((order: any) => (
											<div
												key={order.key}
												className='p-3 rounded-lg bg-neutral-800/50 border border-neutral-800 flex justify-between items-center'>
												<div>
													<p className='font-medium text-white'>
														{order.customer?.firstName} {order.customer?.lastName}
													</p>
													<p className='text-xs text-neutral-500'>
														{order.reference} • {formatDate(order.createdAt)}
													</p>
												</div>
												<div className='text-right'>
													<p className='font-bold text-white'>
														{order.currency} {order.amount.toLocaleString()}
													</p>
													<p
														className={`text-[10px] uppercase font-bold ${order.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
														{order.isPaid ? 'Paid' : 'Pending'}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value='reviews'>
					<Card className='bg-neutral-900/50 border-neutral-800 min-h-[400px]'>
						<div className='px-6 py-4 border-b border-neutral-800 flex items-center justify-between'>
							<h3 className='text-lg font-medium text-white'>Product Reviews</h3>
							<Button
								size='sm'
								variant='outline'
								className='h-8 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
								onClick={() => setIsAddReviewModalOpen(true)}>
								<Plus className='h-4 w-4 mr-1' /> Add Review
							</Button>
						</div>
						<CardContent className='pt-6'>
							{reviews.length === 0 ?
								<div className='flex flex-col items-center justify-center py-20 text-neutral-500'>
									<Star className='h-12 w-12 mb-4 opacity-20' />
									<p>No reviews found for this product</p>
								</div>
							:	<div className='space-y-4'>
									{reviews.map((review: any) => (
										<div key={review.key} className='p-4 rounded-lg bg-neutral-800/50 border border-neutral-800'>
											<div className='flex justify-between items-start mb-2'>
												<div className='flex items-center gap-2'>
													<div className='flex'>
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-600'}`}
															/>
														))}
													</div>
													<span className='text-xs font-medium text-white'>
														{review.customer?.firstName} {review.customer?.lastName}
													</span>
												</div>
												<span className='text-[10px] text-neutral-500'>{formatDate(review.createdAt)}</span>
											</div>
											<p className='text-sm text-neutral-300 italic'>"{review.comment}"</p>
										</div>
									))}
								</div>
							}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			<AddReviewModal open={isAddReviewModalOpen} onOpenChange={setIsAddReviewModalOpen} initialProductId={id} />
		</div>
	);
};
