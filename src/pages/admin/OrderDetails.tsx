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
import { getCloudFileURL, getOrderStatusStyles, getOrderStatusIcon, cn, getFullName } from '../../lib/utils';
import { PRODUCT_ORDER_STATUS } from '@/api/orders';
import { formatDate } from '@/lib/formatDate';
import { useAuthStore } from '@/store/useAuthStore';
import { APP_ROUTES } from '@/config/routes.app';
import { formatCurrency } from '@/lib/formatCurrency';
import { OrderTrackingTimeline } from '@/components/admin/orders/OrderTrackingTimeline';
import { UpdateTrackingDialog } from '@/components/admin/orders/UpdateTrackingDialog';

export const OrderDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const businessId = user?.businessId || '';

	const { data: orderResponse, isLoading } = useProductOrderQuery(businessId, id);
	const order = orderResponse?.data?.order;

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
				className='mb-6 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center gap-2 h-auto hover:bg-transparent'>
				<ChevronLeft className='h-4 w-4' /> Back
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
								<Calendar className='h-3.5 w-3.5' /> {order.createdAt ? formatDate(order.createdAt) : '-'}
							</span>

							<div className='h-4 w-px bg-neutral-800' />

							{order.isPaid ?
								<Badge className='text-[11px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'>
									<CheckCircle2 className='h-3 w-3 mr-1' /> Paid
								</Badge>
							:	<Badge className='text-[11px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'>
									<XCircle className='h-3 w-3 mr-1' /> Unpaid
								</Badge>
							}

							{order.status !== PRODUCT_ORDER_STATUS.PAID && (
								<React.Fragment>
									<div className='h-4 w-px bg-neutral-800' />
									{(() => {
										const StatusIcon = getOrderStatusIcon(order.status);
										return (
											<div
												className={cn(
													'flex items-center gap-1.5 px-2.5 py-1 rounded-full w-max border text-[10px] font-bold uppercase tracking-widest',
													getOrderStatusStyles(order.status),
												)}>
												<StatusIcon
													className={cn('h-3 w-3', order.status === PRODUCT_ORDER_STATUS.PROCESSING && 'animate-spin')}
												/>
												<span>{order.status}</span>
											</div>
										);
									})()}
								</React.Fragment>
							)}
						</div>
					</div>
				</div>
				<div className='flex gap-3'>
					<UpdateTrackingDialog businessId={businessId} orderId={id!} currentStatus={order.status} />
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Left Column - Product & Payment */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Product Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden gap-0 pb-0'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<Package className='h-5 w-5 text-blue-400' /> Items Ordered
							</CardTitle>
						</CardHeader>
						<CardContent className='p-0'>
							<div className='flex flex-col'>
								{order.items.map((item, index) => (
									<div
										key={index}
										className={`p-6 flex flex-col md:flex-row gap-6 ${index !== order.items.length - 1 ? 'border-b border-neutral-800' : ''}`}>
										<div className='w-full md:w-24 h-24 rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950 flex-shrink-0'>
											{item.product?.images?.[0] ?
												<img
													src={getCloudFileURL(item.product.images[0].original)}
													alt={item.product.title}
													className='w-full h-full object-cover'
												/>
											:	<div className='w-full h-full flex items-center justify-center text-neutral-700'>
													<Package className='h-8 w-8' />
												</div>
											}
										</div>
										<div className='flex-1 space-y-2'>
											<div className='flex flex-col md:flex-row justify-between gap-4'>
												<div>
													<h3 className='text-md font-bold text-white'>{item.product?.title}</h3>
													<p className='text-neutral-500 text-xs'>
														Category: {item.product?.category?.title || 'Uncategorized'}
													</p>
												</div>
												<div className='text-right'>
													{item.discountPercent > 0 && (
														<div className='flex items-center justify-end gap-2 mb-1'>
															<span className='text-[13px] text-neutral-500 line-through'>
																{formatCurrency(item.amount, order.currency)}
															</span>
															<Badge className='text-[13px] h-4 px-1.5 bg-red-500/10 text-red-400 border-red-500/20 uppercase font-bold tracking-tighter'>
																-{item.discountPercent}%
															</Badge>
														</div>
													)}
													<p className='text-md font-bold text-white'>{formatCurrency(item.checkoutAmount, order.currency)}</p>
													<p className='text-neutral-500 text-[13px]'>Qty: {item.quantity}</p>
												</div>
											</div>
											<div className='flex items-center justify-between text-xs'>
												<span className='text-neutral-400'>Item Total</span>
												<span className='text-white font-medium'>
													{formatCurrency(item.checkoutAmount * item.quantity, order.currency)}
												</span>
											</div>
										</div>
									</div>
								))}

								<div className='p-6 bg-neutral-900/30 space-y-3 border-t border-neutral-800'>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-neutral-400'>Total Items</span>
										<span className='text-white font-medium'>{order.quantity}</span>
									</div>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-neutral-400'>Items Total</span>
										<div className='flex items-center gap-2'>
											{order.discountPercent > 0 && (
												<span className='text-neutral-500 line-through text-xs'>
													{formatCurrency(order.itemsAmount, order.currency)}
												</span>
											)}
											<span className='text-white font-medium'>{formatCurrency(order.itemsCheckoutAmount, order.currency)}</span>
										</div>
									</div>
									{order.discountPercent > 0 && (
										<div className='flex items-center justify-between text-sm text-red-400'>
											<span className='font-medium'>Total Discount Applied</span>
											<span className='font-bold italic'>-{order.discountPercent.toFixed(2)}%</span>
										</div>
									)}
									<div className='flex items-center justify-between text-sm'>
										<span className='text-neutral-400'>Shipping Fee</span>
										<span className='text-white font-medium'>{formatCurrency(order.shippingFee, order.currency)}</span>
									</div>
									<div className='flex items-center justify-between text-sm'>
										<span className='text-neutral-400'>Shipping Protection Fee</span>
										<span className='text-white font-medium'>{formatCurrency(order.shippingProtectionFee, order.currency)}</span>
									</div>
									<Separator className='bg-neutral-800 my-2' />
									<div className='flex items-center justify-between'>
										<span className='text-lg font-bold text-white'>Total Charged</span>
										<span className='text-xl font-bold text-blue-400'>{formatCurrency(order.checkoutAmount, order.currency)}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Payment Details Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden gap-0 pb-0'>
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
									<p className='text-white font-medium capitalize'>{order.paymentMethod || '-'}</p>
								</div>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Payment Channel</span>
									<p className='text-white font-medium capitalize'>{order.paymentChannel || '-'}</p>
								</div>
							</div>
							<div className='space-y-4'>
								<div className='flex flex-col gap-1'>
									<span className='text-xs text-neutral-500 uppercase font-bold tracking-wider'>Payment Date</span>
									<p className='text-white font-medium'>
										{order.completedPaymentAt ? formatDate(order.completedPaymentAt) : 'Not Yet Paid'}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Customer & Shipping */}
				<div className='space-y-6'>
					{/* Customer Info Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur gap-0 pb-0'>
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
									<h4 className='text-white font-bold text-lg leading-tight'>{getFullName(order.customer)}</h4>
									<p className='text-neutral-500 text-sm break-all'>{order.email}</p>
								</div>
							</div>
							<div className='space-y-4 text-sm'>
								<div className='flex justify-between'>
									<span className='text-neutral-500'>Phone</span>
									<span className='text-neutral-300 font-medium'>{order.customer?.phone?.international || '-'}</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-neutral-500'>Gender</span>
									<span className='text-neutral-300 font-medium capitalize'>{order.customer?.gender || '-'}</span>
								</div>
								<Separator className='bg-neutral-800' />
								<Button
									variant='outline'
									onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${order?.customer?.id}`)}
									className='w-full border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center justify-center gap-2'>
									View Customer <ExternalLink className='h-3.5 w-3.5' />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Delivery/Address Card */}
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur gap-0 pb-0'>
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
										<p className='text-white font-medium'>{getFullName(order.address)}</p>
										<p className='text-neutral-400 text-sm mt-1 leading-relaxed'>
											{order.address?.addressLine1}
											{order.address?.addressLine2 ? `, ${order.address.addressLine2}` : ''}
											<br />
											{order.address?.apartment ? `${order.address.apartment}, ` : ''}
											{order.address?.city}
											<br />
											{order.address?.state?.label}, {order.address?.country?.label}
											<br />
											{order.address?.zipCode}
										</p>
										<p className='text-neutral-300 text-sm mt-3 font-medium'>{order.address?.phone?.international}</p>
									</div>
								</div>
								<Separator className='bg-neutral-800' />
								<div className='flex items-start gap-3'>
									<Hash className='h-5 w-5 text-neutral-600 mt-0.5' />
									<div className='flex-1'>
										<p className='text-white font-medium font-mono text-sm uppercase tracking-wider'>Tracking Number</p>
										<p className='text-neutral-300 text-xs mt-1'>{order.id}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<OrderTrackingTimeline trackingHistory={order.trackingHistory} />
				</div>
			</div>
		</div>
	);
};
