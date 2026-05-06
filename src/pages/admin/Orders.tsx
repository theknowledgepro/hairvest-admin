import React, { useState } from 'react';
import { useProductOrdersQuery } from '../../hooks/useProductOrders';
import { TablePagination } from '../../components/TablePagination';
import { Card, CardContent } from '../../components/ui/card';
import { ClipboardList, Search } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/store/useAuthStore';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';

export const Orders: React.FC = () => {
	const { user } = useAuthStore();
	const businessId = user?.businessId || '';

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchInput, setSearchInput] = useState('');
	const [debouncedSearch] = useDebounce(searchInput, 800);

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
					<OrdersTable orders={orders} isLoading={isLoading} page={page} limit={limit} />
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
