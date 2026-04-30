import React, { useState } from 'react';
import { ShoppingCart, User, Package, Calendar, Search, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useCartInsightsQuery } from '../../hooks/useInsights';
import { TablePagination } from '../../components/TablePagination';
import { formatDate } from '@/lib/formatDate';
import { formatCurrency } from '@/lib/formatCurrency';
import { getCloudFileURL, getFullName } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/config/routes.app';
import { useDebounce } from 'use-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const CartInsights: React.FC = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState('');
	const [debouncedSearch] = useDebounce(searchInput, 500);
	const [limit, setLimit] = useState(10);

	const { data: insightsResponse, isLoading } = useCartInsightsQuery(page, limit, debouncedSearch);
	const insights = insightsResponse?.data?.results || [];
	const pagination = insightsResponse?.data;
	const totalPages = pagination?.totalPages ?? 1;
	const totalResults = pagination?.totalCount ?? 0;

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white'>Cart Insights</h2>
					<p className='text-neutral-400 mt-1'>Track customers who have added your products to their shopping carts.</p>
				</div>
			</div>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur-sm gap-0 p-0'>
				<CardHeader className='border-b border-neutral-800 p-4'>
					<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
						<CardTitle className='text-lg font-semibold text-white flex items-center gap-2'>
							<ShoppingCart className='h-6 w-6 text-blue-400' />
							Active Carts
							<span className='ml-2 px-2 py-0.5 text-[12px] leading-tight font-medium rounded-[6px] bg-blue-500/10 text-blue-400 border border-blue-500/20'>
								{totalResults} Total
							</span>
						</CardTitle>
						<div className='relative w-full md:w-72'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500' />
							<Input
								placeholder='Filter by customer or product...'
								className='bg-neutral-950 border-neutral-800 pl-10 focus-visible:ring-blue-500'
								value={searchInput}
								onChange={(e) => {
									setSearchInput(e.target.value);
									setPage(1);
								}}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent className='p-0'>
					{isLoading ?
						<div className='p-24 flex flex-col items-center justify-center text-neutral-500'>
							<Loader2 className='h-8 w-8 animate-spin mb-4 text-blue-500' />
							<p className='animate-pulse'>Fetching cart data...</p>
						</div>
					: insights.length === 0 ?
						<div className='p-20 flex flex-col items-center justify-center text-neutral-500'>
							<div className='w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4'>
								<ShoppingCart className='h-8 w-8 text-neutral-700' />
							</div>
							<p className='font-medium text-neutral-300'>No results found</p>
							<p className='text-sm mt-1 text-center max-w-sm'>Your products haven't been added to any customer carts yet.</p>
						</div>
					:	<>
							<Table>
								<TableHeader className='bg-neutral-800/30'>
									<TableRow className='hover:bg-transparent border-neutral-800'>
										<TableHead className='text-neutral-400'>S/N</TableHead>
										<TableHead className='text-neutral-400'>Customer</TableHead>
										<TableHead className='text-neutral-400'>Product</TableHead>
										<TableHead className='text-neutral-400 text-center'>Quantity</TableHead>
										<TableHead className='text-neutral-400'>Estimated Value</TableHead>
										<TableHead className='text-neutral-400 text-right'>Added On</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{insights.map((item, index) => (
										<TableRow key={item.key} className='border-neutral-800 hover:bg-neutral-800/20 transition-colors group'>
											<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
											<TableCell>
												<Button
													variant='link'
													className='flex items-start justify-start text-start gap-3 p-0 h-auto hover:no-underline text-sm'
													onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${item.customer?.key}`)}>
													<Avatar className='h-9 w-9 ring-1 ring-neutral-800'>
														<AvatarImage src={getCloudFileURL(item.customer?.avatar)} />
														<AvatarFallback className='bg-neutral-800 text-neutral-400 text-xs'>
															<User className='h-4 w-4' />
														</AvatarFallback>
													</Avatar>
													<div>
														<p className='font-medium text-white group-hover:text-blue-400 transition-colors'>
															{getFullName(item.customer)}
														</p>
														<p className='text-xs text-neutral-500'>{item.customer?.email}</p>
													</div>
												</Button>
											</TableCell>
											<TableCell>
												<Button
													variant='link'
													className='flex items-start justify-start text-start gap-3 p-0 h-auto hover:no-underline text-sm'
													onClick={() => navigate(`${APP_ROUTES.PRODUCTS}/${item.product?.key}`)}>
													{item.product?.images?.[0]?.preview ?
														<img
															src={getCloudFileURL(item.product.images[0].preview)}
															alt=''
															className='h-8 w-8 rounded bg-neutral-800 object-cover'
														/>
													:	<div className='h-8 w-8 rounded bg-neutral-800 flex items-center justify-center'>
															<Package className='h-4 w-4 text-neutral-600' />
														</div>
													}
													<div className='max-w-[200px]'>
														<p className='text-sm font-medium text-neutral-200 truncate group-hover:text-blue-400'>
															{item.product?.title}
														</p>
														<p className='text-xs text-neutral-500 font-mono'>{item.product?.key}</p>
													</div>
												</Button>
											</TableCell>
											<TableCell className='text-center'>
												<span className='px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300 text-xs font-medium'>
													{item.quantity}
												</span>
											</TableCell>
											<TableCell>
												<span className='font-semibold text-white'>
													{formatCurrency((item.product?.amount || 0) * item.quantity)}
												</span>
											</TableCell>
											<TableCell className='text-right'>
												<div className='flex flex-col items-end'>
													<p className='text-sm text-neutral-300'>{formatDate(item.createdAt)}</p>
													<p className='text-[11px] text-neutral-500 flex items-center gap-1'>
														<Calendar className='h-3 w-3' /> Last Updated {formatDate(item.updatedAt)}
													</p>
												</div>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					}
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
