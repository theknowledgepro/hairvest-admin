import React from 'react';
import { Heart, Trash2, Loader2, PackageX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { useCustomerWishlistQuery, useRemoveFromWishlistMutation, useClearWishlistMutation } from '@/hooks/useWishlist';
import { getCloudFileURL } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatCurrency';

interface CustomerWishlistProps {
	customerId: string;
}

export const CustomerWishlist: React.FC<CustomerWishlistProps> = ({ customerId }) => {
	const { data: wishlistResponse, isLoading } = useCustomerWishlistQuery(customerId);
	const items = wishlistResponse?.data?.results || [];

	const { mutate: removeItem, isPending: isRemoving } = useRemoveFromWishlistMutation(customerId);
	const { mutate: clearWishlist, isPending: isClearing } = useClearWishlistMutation(customerId);

	const calculateTotal = () => {
		return items.reduce((total, item) => {
			const price = item.product?.amount || 0;
			return total + price * item.quantity;
		}, 0);
	};

	return (
		<Card className='bg-neutral-900/50 border-neutral-800 gap-0 pb-0'>
			<CardHeader className='border-b border-neutral-800 pb-4 flex flex-row items-center justify-between'>
				<CardTitle className='text-lg font-semibold text-white flex items-center gap-2 m-0'>
					<Heart className='h-5 w-5 text-red-400 fill-red-400/10' /> Saved to Wishlist ({items.length})
				</CardTitle>
				{items.length > 0 && (
					<Button
						variant='destructive'
						size='sm'
						onClick={() => confirm('Are you sure you want to clear the wishlist?') && clearWishlist()}
						disabled={isClearing}>
						<Trash2 className='h-4 w-4 mr-2' /> Clear Wishlist
					</Button>
				)}
			</CardHeader>
			<CardContent className='p-0'>
				{isLoading ?
					<div className='p-12 flex flex-col items-center justify-center text-neutral-500'>
						<Loader2 className='h-8 w-8 animate-spin text-red-500' />
					</div>
				: items.length === 0 ?
					<div className='p-10 flex flex-col items-center justify-center text-neutral-500'>
						<Heart className='h-10 w-10 text-neutral-700 mb-4' />
						<p className='font-medium text-neutral-300'>Wishlist is empty</p>
						<p className='text-sm mt-1 text-center max-w-sm'>The customer currently has no items in their wishlist.</p>
					</div>
				:	<div>
						<Table>
							<TableBody>
								{items.map((item) => (
									<TableRow key={item.key} className='border-neutral-800'>
										<TableCell className='py-3'>
											<div className='flex items-center gap-3'>
												{item.product?.images?.[0]?.preview ?
													<img
														src={getCloudFileURL(item.product.images[0].preview)}
														alt='Product'
														className='w-10 h-10 rounded-md bg-neutral-800 object-cover'
													/>
												:	<div className='w-10 h-10 rounded-md bg-neutral-800 flex items-center justify-center border border-neutral-700'>
														<PackageX className='h-5 w-5 text-neutral-500' />
													</div>
												}
												<div>
													<p className='font-medium text-white'>{item.product?.title || 'Unknown Product'}</p>
													<p className='text-xs text-neutral-400'>{item.product?.id}</p>
												</div>
											</div>
										</TableCell>
										<TableCell className='text-right'>
											<div className='text-sm text-neutral-300'>Qty: {item.quantity}</div>
											<div className='font-medium text-blue-400'>{formatCurrency((item.product?.amount || 0) * item.quantity)}</div>
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
							<span className='text-neutral-400 font-medium'>Total Wishlist Value</span>
							<span className='text-lg font-bold text-white'>{formatCurrency(calculateTotal())}</span>
						</div>
					</div>
				}
			</CardContent>
		</Card>
	);
};
