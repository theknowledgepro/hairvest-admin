import { CreditCard, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomerCardsQuery, useDeleteCardMutation } from '@/hooks/useCustomers';

interface CustomerCardListProps {
	customerId: string;
}

export const CustomerCardList = ({ customerId }: CustomerCardListProps) => {
	const { data: response, isLoading } = useCustomerCardsQuery(customerId);
	const { mutate: deleteCard, isPending: isDeleting } = useDeleteCardMutation(customerId);
	const cards = response?.data?.results || [];

	return (
		<Card className='bg-neutral-900/50 border-neutral-800 gap-0 pb-0'>
			<CardHeader className='border-b border-neutral-800 pb-4 flex flex-row items-center justify-between'>
				<CardTitle className='text-lg font-semibold text-white flex items-center gap-2 m-0'>
					<CreditCard className='h-5 w-5 text-blue-400' /> Payment Cards ({cards.length})
				</CardTitle>
			</CardHeader>
			<CardContent className='p-0'>
				{isLoading ?
					<div className='p-12 flex flex-col items-center justify-center text-neutral-500'>
						<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
					</div>
				: cards.length === 0 ?
					<div className='p-10 flex flex-col items-center justify-center text-neutral-500'>
						<CreditCard className='h-10 w-10 text-neutral-700 mb-4' />
						<p className='font-medium text-neutral-300'>No cards found</p>
					</div>
				:	<div className='divide-y divide-neutral-800'>
						{cards.map((card: any) => (
							<div key={card.key} className='p-4 hover:bg-neutral-800/30 transition-colors flex justify-between items-center'>
								<div className='flex items-center gap-4'>
									<div className='w-12 h-8 bg-neutral-800 rounded flex items-center justify-center border border-neutral-700'>
										<span className='text-xs font-bold text-neutral-400 capitalize'>{card.brand || 'Card'}</span>
									</div>
									<div className='space-y-1'>
										<div className='flex items-center gap-2'>
											<p className='font-medium text-white'>•••• •••• •••• {card.last4}</p>
											{card.isDefault && (
												<span className='px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400'>
													Default
												</span>
											)}
										</div>
										<p className='text-xs text-neutral-500'>
											{card.cardName} • Expires {card.expiryMonth}/{card.expiryYear}
										</p>
									</div>
								</div>
								<div className='flex gap-2 relative z-10'>
									<Button
										variant='ghost'
										size='icon'
										disabled={isDeleting}
										className='h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-red-500/10'
										onClick={() => confirm('Delete card?') && deleteCard(card.key)}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</div>
						))}
					</div>
				}
			</CardContent>
		</Card>
	);
};
