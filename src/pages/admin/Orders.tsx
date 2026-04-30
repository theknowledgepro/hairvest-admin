import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductOrdersQuery } from '../../hooks/useProductOrders';
import { TablePagination } from '../../components/TablePagination';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { ClipboardList, Loader2, MoreHorizontal, Search, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { getCloudFileURL, getFullName } from '../../lib/utils';
import { APP_ROUTES } from '../../config/routes.app';
import { formatDate } from '@/lib/formatDate';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/lib/formatCurrency';

export const Orders: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();
	const businessId = user?.businessId || '';

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchInput, setSearchInput] = useState('');
	const [debouncedSearch] = useDebounce(searchInput, 500);

	const { data: ordersResponse, isLoading } = useProductOrdersQuery({
		businessId,
		page,
		limit,
		reference: debouncedSearch, // The API supports reference filtering
	});

	const orders = ordersResponse?.data?.results ?? [];
	const totalPages = ordersResponse?.data?.totalPages ?? 1;
	const totalResults = ordersResponse?.data?.totalCount ?? 0;

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<ClipboardList className='h-8 w-8 text-blue-400' /> Orders Management
					</h2>
					<p className='text-neutral-400 mt-1'>Track and manage all product orders from your customers.</p>
				</div>
			</div>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0 gap-0'>
				<div className='p-4 border-b border-neutral-800 flex items-center justify-between'>
					<div className='relative w-full max-w-lg'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500' />
						<Input
							type='text'
							placeholder='Search orders by reference...'
							className='pl-9 bg-neutral-900 border-neutral-700 text-white w-full'
							value={searchInput}
							onChange={(e) => {
								setSearchInput(e.target.value);
								setPage(1);
							}}
						/>
					</div>
				</div>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400 w-[50px]'>S/N</TableHead>
								<TableHead className='text-neutral-400'>Order Reference</TableHead>
								<TableHead className='text-neutral-400'>Customer</TableHead>
								<TableHead className='text-neutral-400'>Product</TableHead>
								<TableHead className='text-neutral-400'>Amount</TableHead>
								<TableHead className='text-neutral-400'>Status</TableHead>
								<TableHead className='text-neutral-400'>Date</TableHead>
								<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ?
								<TableRow>
									<TableCell colSpan={7} className='text-center py-10 text-neutral-500'>
										<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-blue-400' />
										Loading orders...
									</TableCell>
								</TableRow>
							: orders.length === 0 ?
								<TableRow>
									<TableCell colSpan={7} className='text-center py-10 text-neutral-500'>
										No orders found.
									</TableCell>
								</TableRow>
							:	orders.map((order, index) => (
									<TableRow
										key={order.key}
										onClick={() => navigate(`${APP_ROUTES.ORDERS}/${order.key}`)}
										className='border-neutral-800 hover:bg-neutral-800/30 transition-colors cursor-pointer'>
										<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
										<TableCell className='font-mono text-xs text-blue-400 font-medium'>{order.reference}</TableCell>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-8 w-8 ring-1 ring-neutral-700'>
													{order.customer?.avatar?.thumbnail ?
														<img
															src={getCloudFileURL(order.customer.avatar.thumbnail)}
															alt='Avatar'
															className='object-cover'
														/>
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
										<TableCell>
											<div className='flex items-center gap-2'>
												{order.product?.images?.[0] && (
													<img
														src={getCloudFileURL(order.product.images?.[0]?.thumbnail)}
														className='h-8 w-8 rounded object-cover border border-neutral-800'
														alt=''
													/>
												)}
												<div className='flex flex-col'>
													<span className='text-sm text-neutral-300 truncate max-w-[150px]'>{order.product?.title}</span>
													<span className='text-[11px] text-neutral-500'>Qty: {order.quantity}</span>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<span className='text-sm font-semibold text-white'>{formatCurrency(order.amount, order.currency)}</span>
										</TableCell>
										<TableCell>
											{order.isPaid ?
												<div className='flex items-center gap-1.5 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full w-max border border-emerald-400/20'>
													<CheckCircle2 className='h-3.5 w-3.5' />
													<span className='text-[11px] font-bold uppercase tracking-wider'>Paid</span>
												</div>
											:	<div className='flex items-center gap-1.5 text-red-400 bg-red-400/10 px-2 py-1 rounded-full w-max border border-red-400/20'>
													<XCircle className='h-3.5 w-3.5' />
													<span className='text-[11px] font-bold uppercase tracking-wider'>Unpaid</span>
												</div>
											}
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
													<DropdownMenuSeparator className='bg-neutral-800' />
													<DropdownMenuItem className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														Contact Customer
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</CardContent>
				<TablePagination
					page={page}
					limit={limit}
					totalResults={totalResults}
					totalPages={totalPages}
					onPageChange={setPage}
					onLimitChange={setLimit}
				/>
			</Card>
		</div>
	);
};
