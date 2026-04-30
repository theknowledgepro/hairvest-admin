import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductOrderQuery } from '../../hooks/useProductOrders';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import {
	ChevronLeft,
	Loader2,
	Package,
	User,
	CreditCard,
	MapPin,
	Calendar,
	Hash,
	Receipt,
	CheckCircle2,
	XCircle,
	ExternalLink,
	Clock,
} from 'lucide-react';
import { getCloudFileURL } from '../../lib/utils';
import { formatDate } from '@/lib/formatDate';
import { useAuthStore } from '@/store/useAuthStore';

export const OrderDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const businessId = user?.businessId || '';

	const { data: orderResponse, isLoading } = useProductOrderQuery(businessId, id);
	const order = orderResponse?.data?.order;

	const formatCurrency = (amount: number, currency: string) => {
		return new Intl.NumberFormat('en-NG', {
			style: 'currency',
			currency: currency || 'NGN',
		}).format(amount);
	};

	if (isLoading) {
		return (
			<div className='h-[60vh] flex flex-col items-center justify-center text-neutral-500'>
				<Loader2 className='h-10 w-10 animate-spin text-blue-400 mb-4' />
				<p>Loading order details...</p>
			</div>
		);
	}

	if (!order) {
		return (
			<div className='h-[60vh] flex flex-col items-center justify-center text-neutral-500'>
				<XCircle className='h-12 w-12 text-red-500 mb-4' />
				<p className='text-xl font-semibold text-white'>Order Not Found</p>
				<Button variant='link' onClick={() => navigate(-1)} className='text-blue-400 mt-2'>
					Go Back
				</Button>
			</div>
		);
	}

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<Button
				variant='ghost'
				onClick={() => navigate(-1)}
				className='mb-6 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center gap-2 p-0 h-auto hover:bg-transparent'>
				<ChevronLeft className='h-4 w-4' /> Back to Orders
			</Button>

			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div className='flex items-center gap-4'>
					<div className='h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center'>
						<Receipt className='h-6 w-6 text-blue-400' />
					</div>
					<div>
						<h2 className='text-2xl font-bold text-white flex items-center gap-3'>Order #{order.reference}</h2>
						<div className='flex items-center gap-3 mt-1'>
							<span className='text-neutral-500 text-sm flex items-center gap-1'>
								<Calendar className='h-3.5 w-3.5' /> {order.createdAt ? formatDate(order.createdAt) : '—'}
							</span>
							<Separator orientation='vertical' className='h-3 bg-neutral-800' />
							{order.isPaid ?
								<Badge className='bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'>
									<CheckCircle2 className='h-3 w-3 mr-1' /> Paid
								</Badge>
							:	<Badge className='bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'>
									<XCircle className='h-3 w-3 mr-1' /> Unpaid
								</Badge>
							}
						</div>
					</div>
				</div>
				<div className='flex gap-3'>
					<Button className='bg-blue-600 hover:bg-blue-700 text-white border-none'>Update Status</Button>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Left Column - Product & Payment */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Product Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<Package className='h-5 w-5 text-blue-400' /> Items Ordered
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='flex flex-col md:flex-row gap-6'>
								<div className='w-full md:w-32 h-32 rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950 flex-shrink-0'>
									{order.product?.images?.[0] ?
										<img
											src={getCloudFileURL(order.product.images[0].original)}
											alt={order.product.title}
											className='w-full h-full object-cover'
										/>
									:	<div className='w-full h-full flex items-center justify-center text-neutral-700'>
											<Package className='h-8 w-8' />
										</div>
									}
								</div>
								<div className='flex-1 space-y-4'>
									<div className='flex flex-col md:flex-row justify-between gap-4'>
										<div>
											<h3 className='text-lg font-bold text-white'>{order.product?.title}</h3>
											<p className='text-neutral-500 text-sm'>Category: {order.product?.category?.title || 'Uncategorized'}</p>
										</div>
										<div className='text-right'>
											<p className='text-lg font-bold text-white'>{formatCurrency(order.amount, order.currency)}</p>
											<p className='text-neutral-500 text-sm'>Qty: {order.quantity}</p>
										</div>
									</div>
									<Separator className='bg-neutral-800' />
									<div className='flex items-center justify-between'>
										<span className='text-neutral-400'>Subtotal</span>
										<span className='text-white font-medium'>{formatCurrency(order.amount * order.quantity, order.currency)}</span>
									</div>
									{order.coupon && (
										<div className='flex items-center justify-between text-emerald-400 text-sm italic'>
											<span>Coupon Applied ({order.coupon.code})</span>
											<span>Included</span>
										</div>
									)}
									<div className='flex items-center justify-between pt-2'>
										<span className='text-lg font-bold text-white'>Total Charged</span>
										<span className='text-xl font-bold text-blue-400'>
											{formatCurrency(order.checkoutAmount || order.amount * order.quantity, order.currency)}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Payment Details Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<CreditCard className='h-5 w-5 text-purple-400' /> Payment Information
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 grid grid-cols-1 md:grid-cols-2 gap-8'>
							<div className='space-y-4'>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Payment Status</span>
									<div className='flex items-center gap-2 mt-1'>
										{order.isPaid ?
											<span className='text-emerald-400 flex items-center gap-1.5 font-medium'>
												<CheckCircle2 className='h-4 w-4' /> Payment Confirmed
											</span>
										:	<span className='text-red-400 flex items-center gap-1.5 font-medium'>
												<Clock className='h-4 w-4' /> Awaiting Payment
											</span>
										}
									</div>
								</div>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Payment Method</span>
									<p className='text-white font-medium capitalize'>{order.paymentMethod || '—'}</p>
								</div>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Payment Channel</span>
									<p className='text-white font-medium capitalize'>{order.paymentChannel || 'Paystack'}</p>
								</div>
							</div>
							<div className='space-y-4'>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Transaction Date</span>
									<p className='text-white font-medium'>{order.paidAt ? formatDate(order.paidAt) : 'Not Yet Paid'}</p>
								</div>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Paystack Access Code</span>
									<p className='text-white font-mono text-xs'>{order.paystackAccessCode || '—'}</p>
								</div>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Internal Key</span>
									<p className='text-neutral-400 font-mono text-[10px]'>{order.key}</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Customer & Shipping */}
				<div className='space-y-6'>
					{/* Customer Info Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<User className='h-5 w-5 text-blue-400' /> Customer
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='flex items-center gap-4 mb-6'>
								<Avatar className='h-14 w-14 ring-2 ring-neutral-800'>
									{order.customer?.avatar?.thumbnail ?
										<img src={getCloudFileURL(order.customer.avatar.thumbnail)} alt='Avatar' className='object-cover' />
									:	<AvatarFallback className='bg-neutral-800 text-blue-400 text-xl uppercase font-bold'>
											{order.customer?.firstName?.[0] || 'U'}
											{order.customer?.lastName?.[0] || 'U'}
										</AvatarFallback>
									}
								</Avatar>
								<div>
									<h4 className='text-white font-bold text-lg leading-tight'>
										{order.customer?.firstName} {order.customer?.lastName}
									</h4>
									<p className='text-neutral-500 text-sm'>{order.email}</p>
								</div>
							</div>
							<div className='space-y-4 text-sm'>
								<div className='flex justify-between'>
									<span className='text-neutral-500'>Phone</span>
									<span className='text-neutral-300 font-medium'>{order.customer?.phone?.international || '—'}</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-neutral-500'>Gender</span>
									<span className='text-neutral-300 font-medium capitalize'>{order.customer?.gender || '—'}</span>
								</div>
								<Separator className='bg-neutral-800' />
								<Button
									variant='outline'
									className='w-full border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center gap-2'>
									View Customer Profile <ExternalLink className='h-3.5 w-3.5' />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Delivery/Address Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<MapPin className='h-5 w-5 text-rose-400' /> Delivery Address
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='space-y-4'>
								<div className='flex items-start gap-3'>
									<MapPin className='h-5 w-5 text-neutral-600 mt-0.5' />
									<div className='flex-1'>
										<p className='text-white font-medium'>Main Shipping Address</p>
										<p className='text-neutral-400 text-sm mt-1 leading-relaxed'>
											Check customer profile for registered shipping addresses.
										</p>
									</div>
								</div>
								<Separator className='bg-neutral-800' />
								<div className='flex items-start gap-3'>
									<Hash className='h-5 w-5 text-neutral-600 mt-0.5' />
									<div className='flex-1'>
										<p className='text-white font-medium font-mono text-sm uppercase tracking-wider'>Tracking Number</p>
										<p className='text-neutral-500 text-xs mt-1'>Not assigned yet</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
