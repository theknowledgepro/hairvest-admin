import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal, Eye, CheckCircle2, XCircle, Package } from 'lucide-react';
import { getCloudFileURL, getFullName, getOrderStatusStyles, getOrderStatusIcon, cn } from '@/lib/utils';
import { PRODUCT_ORDER_STATUS, type ProductOrder } from '@/api/orders';
import { APP_ROUTES } from '@/config/routes.app';
import { formatDate } from '@/lib/formatDate';
import { formatCurrency } from '@/lib/formatCurrency';

interface OrdersTableProps {
	orders: ProductOrder[];
	isLoading: boolean;
	page: number;
	limit: number;
	showCustomerColumn?: boolean;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, isLoading, page, limit, showCustomerColumn = true }) => {
	const navigate = useNavigate();

	return (
		<Table>
			<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
				<TableRow className='hover:bg-transparent border-neutral-800 even:bg-white/[0.03]'>
					<TableHead className='text-neutral-400 w-[50px]'>S/N</TableHead>
					<TableHead className='text-neutral-400'>Order Reference</TableHead>
					{showCustomerColumn && <TableHead className='text-neutral-400'>Customer</TableHead>}
					<TableHead className='text-neutral-400'>Product(s)</TableHead>
					<TableHead className='text-neutral-400'>Amount</TableHead>
					<TableHead className='text-neutral-400'>Order Status</TableHead>
					<TableHead className='text-neutral-400'>Payment Status</TableHead>
					<TableHead className='text-neutral-400'>Payment Method</TableHead>
					<TableHead className='text-neutral-400'>Payment Channel</TableHead>
					<TableHead className='text-neutral-400'>Date</TableHead>
					<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{isLoading ?
					<TableRow>
						<TableCell colSpan={showCustomerColumn ? 11 : 10} className='text-center py-10 text-neutral-500'>
							<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-blue-400' />
							Loading orders...
						</TableCell>
					</TableRow>
				: orders.length === 0 ?
					<TableRow>
						<TableCell colSpan={showCustomerColumn ? 11 : 10} className='text-center py-10 text-neutral-500'>
							No orders found.
						</TableCell>
					</TableRow>
				:	orders.map((order, index) => {
						const StatusIcon = getOrderStatusIcon(order.status);
						return (
							<TableRow
								key={order.key}
								onClick={() => navigate(`${APP_ROUTES.ORDERS}/${order.key}`)}
								className='border-neutral-800 hover:bg-neutral-800/60 transition-colors cursor-pointer group even:bg-white/[0.03]'>
								<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
								<TableCell className='font-mono text-xs text-blue-400 font-medium'>{order.reference}</TableCell>

								{showCustomerColumn && (
									<TableCell>
										<div className='flex items-center gap-3'>
											<Avatar className='h-8 w-8 ring-1 ring-neutral-700'>
												{order.customer?.avatar?.thumbnail ?
													<img src={getCloudFileURL(order.customer.avatar.thumbnail)} alt='Avatar' className='object-cover' />
												:	<AvatarFallback className='bg-neutral-800 text-blue-400 text-[10px] uppercase'>
														{order.customer?.firstName?.[0] || 'U'}
														{order.customer?.lastName?.[0] || 'U'}
													</AvatarFallback>
												}
											</Avatar>
											<div className='flex flex-col'>
												<span className='text-sm text-white font-medium'>{getFullName(order.customer)}</span>
												<span className='text-[11px] text-neutral-500'>{order.email}</span>
											</div>
										</div>
									</TableCell>
								)}

								<TableCell className='py-4'>
									<div className='flex flex-col gap-3 min-w-[220px] max-w-[300px]'>
										{(order.items || []).slice(0, 3).map((item, idx) => (
											<div key={idx} className='flex items-center gap-3 group'>
												<div className='h-9 w-9 rounded-lg border border-neutral-800 overflow-hidden bg-neutral-950 shrink-0 group-hover:border-neutral-700 transition-colors'>
													{item.product?.images?.[0] ?
														<img
															src={getCloudFileURL(item.product.images[0].thumbnail)}
															className='h-full w-full object-cover'
															alt=''
														/>
													:	<div className='h-full w-full flex items-center justify-center text-neutral-700'>
															<Package className='h-4 w-4' />
														</div>
													}
												</div>
												<div className='flex flex-col min-w-0'>
													<span className='text-[13px] text-neutral-300 font-semibold truncate group-hover:text-white transition-colors'>
														{item.product?.title || 'Unknown Product'}
													</span>
													<span className='text-[11px] text-neutral-500 font-medium'>
														Qty: <span className='text-neutral-400'>{item.quantity}</span>
													</span>
												</div>
											</div>
										))}
										{order.items && order.items.length > 3 && (
											<div className='flex items-center gap-2 pl-2'>
												<div className='h-1 w-1 rounded-full bg-blue-500'></div>
												<span className='text-[11px] font-bold text-blue-400 uppercase tracking-wider'>
													+ {order.items.length - 3} more products
												</span>
											</div>
										)}
									</div>
								</TableCell>
								<TableCell>
									<span className='text-sm font-semibold text-white'>{formatCurrency(order.checkoutAmount, order.currency)}</span>
								</TableCell>
								<TableCell>
									<div className='flex flex-col gap-2'>
										<div
											className={cn(
												'flex items-center gap-1.5 px-2.5 py-1 rounded-full w-max border text-[10px] font-bold uppercase tracking-widest',
												getOrderStatusStyles(order.status),
											)}>
											<StatusIcon className={cn('h-3 w-3', order.status === PRODUCT_ORDER_STATUS.PROCESSING && 'animate-spin')} />
											<span>{order.status}</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className='flex flex-col gap-0.5'>
										{order.isPaid && order.isPaymentCompleted && order.completedPaymentAt ?
											<>
												<span className='text-[14px] text-emerald-400 font-medium'>{formatDate(order.completedPaymentAt)}</span>
												<div className='flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full w-max border border-emerald-400/20'>
													<CheckCircle2 className='h-3 w-3' />
													<span className='text-[10px] font-bold uppercase tracking-wider'>Confirmed</span>
												</div>
											</>
										:	<div className='flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-1 rounded-full w-max border border-red-400/20'>
												<XCircle className='h-3 w-3' />
												<span className='text-[10px] font-bold uppercase tracking-wider'>Unpaid</span>
											</div>
										}
									</div>
								</TableCell>

								<TableCell>
									<span className='text-[14px] text-neutral-300 uppercase'>{order.paymentMethod || '—'}</span>
								</TableCell>
								<TableCell>
									<span className='text-[14px] text-neutral-300 uppercase'>{order.paymentChannel || '—'}</span>
								</TableCell>
								<TableCell>
									<span className='text-sm text-neutral-400'>{order.createdAt ? formatDate(order.createdAt) : '—'}</span>
								</TableCell>
								<TableCell className='text-right'>
									<DropdownMenu>
										<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
											<Button variant='ghost' className='h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800'>
												<span className='sr-only'>Open menu</span>
												<MoreHorizontal className='h-4 w-4' />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end' className='bg-neutral-900 border-neutral-800 text-white'>
											<DropdownMenuLabel>Actions</DropdownMenuLabel>
											<DropdownMenuItem
												onClick={(e) => {
													e.stopPropagation();
													navigate(`${APP_ROUTES.ORDERS}/${order.key}`);
												}}
												className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
												<Eye className='mr-2 h-4 w-4 text-blue-400' /> Manage this Order
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						);
					})
				}
			</TableBody>
		</Table>
	);
};
