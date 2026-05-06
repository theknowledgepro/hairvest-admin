import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductOrdersQuery } from '@/hooks/useProductOrders';
import { ShoppingBag } from 'lucide-react';
import { OrdersTable } from '@/components/admin/orders/OrdersTable';
import { TablePagination } from '@/components/TablePagination';

interface ProductOrdersProps {
	businessId: string;
	productId: string;
}

export const ProductOrders: React.FC<ProductOrdersProps> = ({ businessId, productId }) => {
	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState(10);

	const { data: ordersResponse, isLoading } = useProductOrdersQuery({
		businessId,
		productId,
		page,
		limit,
	});

	const orders = ordersResponse?.data?.results || [];
	const totalPages = ordersResponse?.data?.totalPages ?? 1;
	const totalResults = ordersResponse?.data?.totalCount ?? 0;

	return (
		<Card className='bg-neutral-900/50 border-neutral-800 min-h-[400px] gap-0 pb-0'>
			<CardHeader className='border-b border-neutral-800 pb-4'>
				<CardTitle className='text-lg font-semibold text-white flex items-center justify-between gap-2 m-0'>
					<div className='flex items-center gap-2'>
						<ShoppingBag className='h-5 w-5 text-purple-400' /> Sales History
					</div>
					{!isLoading && totalResults > 0 && (
						<span className='px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold border border-purple-500/20 uppercase tracking-widest'>
							{totalResults} Orders
						</span>
					)}
				</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>
				<OrdersTable orders={orders} isLoading={isLoading} page={page} limit={limit} showCustomerColumn={true} />
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
	);
};
