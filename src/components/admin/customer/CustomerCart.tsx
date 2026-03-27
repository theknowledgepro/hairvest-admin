import React from 'react';
import { ShoppingCart, Trash2, Loader2, PackageX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useCustomerCartQuery, useRemoveFromCartMutation, useClearCartMutation } from '@/hooks/useCart';
import { getCloudFileURL } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatCurrency';

interface CustomerCartProps {
	customerId: string;
}

export const CustomerCart: React.FC<CustomerCartProps> = ({ customerId }) => {
	const { data: cartResponse, isLoading } = useCustomerCartQuery(customerId);
	const items = cartResponse?.data?.results || [];

	const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCartMutation(customerId);
	const { mutate: clearCart, isPending: isClearing } = useClearCartMutation(customerId);

	const calculateTotal = () => {
		return items.reduce((total, item) => {
			const price = item.productDetails?.price || 0;
			return total + price * item.quantity;
		}, 0);
	};

	return (
		<Card className='bg-neutral-900/50 border-neutral-800'>
			<CardHeader className='border-b border-neutral-800 pb-4 flex flex-row items-center justify-between'>
				<CardTitle className='text-lg font-semibold text-white flex items-center gap-2 m-0'>
					<ShoppingCart className='h-5 w-5 text-blue-400' /> Active Cart ({items.length})
				</CardTitle>
				{items.length > 0 && (
					<Button
						variant='destructive'
						size='sm'
						onClick={() => confirm('Are you sure you want to clear the cart?') && clearCart()}
						disabled={isClearing}>
						<Trash2 className='h-4 w-4 mr-2' /> Clear Cart
					</Button>
				)}
			</CardHeader>
			<CardContent className='p-0'>
				{isLoading ? (
					<div className='p-12 flex flex-col items-center justify-center text-neutral-500'>
						<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
					</div>
				) : items.length === 0 ? (
					<div className='p-10 flex flex-col items-center justify-center text-neutral-500'>
						<ShoppingCart className='h-10 w-10 text-neutral-700 mb-4' />
						<p className='font-medium text-neutral-300'>Cart is empty</p>
						<p className='text-sm mt-1 text-center max-w-sm'>The customer currently has no items in their cart.</p>
					</div>
				) : (
					<div>
						<Table>
							<TableBody>
								{items.map((item) => (
									<TableRow key={item.key} className='border-neutral-800'>
										<TableCell className='py-3'>
											<div className='flex items-center gap-3'>
												{item.productDetails?.images?.[0]?.preview ? (
													<img
														src={getCloudFileURL(item.productDetails.images[0].preview)}
														alt='Product'
														className='w-10 h-10 rounded-md bg-neutral-800 object-cover'
													/>
												) : (
													<div className='w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center border border-neutral-700'>
														<PackageX className='h-5 w-5 text-neutral-500' />
													</div>
												)}
												<div>
													<p className='font-medium text-white'>{item.productDetails?.title || 'Unknown Product'}</p>
													<p className='text-xs text-neutral-400'>{item.productDetails?.key || item.product}</p>
												</div>
											</div>
										</TableCell>
										<TableCell className='text-right'>
											<div className='text-sm text-neutral-300'>Qty: {item.quantity}</div>
											<div className='font-medium text-blue-400'>
												{formatCurrency((item.productDetails?.price || 0) * item.quantity)}
											</div>
										</TableCell>
										<TableCell className='w-[50px] text-right'>
											<Button
												variant='ghost'
												size='icon'
												className='h-8 w-8 text-neutral-500 hover:text-red-400 hover:bg-red-500/10'
												onClick={() => confirm('Remove this item?') && removeItem(item.key)}
												disabled={isRemoving}>
												<Trash2 className='h-4 w-4' />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
						<div className='p-4 border-t border-neutral-800 bg-neutral-900/60 flex justify-between items-center rounded-b-xl'>
							<span className='text-neutral-400 font-medium'>Total Estimated Value</span>
							<span className='text-lg font-bold text-white'>{formatCurrency(calculateTotal())}</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
