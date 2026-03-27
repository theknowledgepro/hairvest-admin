import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useReviewLikesQuery } from '@/hooks/useProductReviews';
import { formatDate } from '@/lib/formatDate';
import { getFullName } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/config/routes.app';
import type { ProductReviewLike } from '@/api/reviews';

interface ReviewLikesProps {
	reviewId: string;
}

export const ReviewLikes: React.FC<ReviewLikesProps> = ({ reviewId }) => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [limit] = useState(50);

	const { data: likesResponse, isLoading } = useReviewLikesQuery(reviewId, { page, limit });

	const likes = likesResponse?.data?.results || [];
	const totalLikes = likesResponse?.data?.totalCount || 0;
	const totalPages = likesResponse?.data?.totalPages || 1;

	if (isLoading) {
		return (
			<div className='flex items-center justify-center p-12'>
				<Loader2 className='h-8 w-8 animate-spin text-rose-500' />
			</div>
		);
	}

	return (
		<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0 gap-0'>
			<div className='p-4 border-b border-neutral-800 flex items-center justify-between'>
				<div className='text-xl font-bold flex items-center justify-between'>
					<span className='flex items-center gap-2 text-white'>
						<Heart className='h-5 w-5 text-rose-500' /> Likes ({totalLikes})
					</span>
				</div>
			</div>
			<CardContent className='w-full h-full p-0'>
				{likes.length === 0 ?
					<div className='p-8 text-center text-neutral-500'>
						<Heart className='h-12 w-12 mx-auto mb-2 opacity-20' />
						<p>No likes yet on this review.</p>
					</div>
				:	<div className='w-full h-full flex flex-col justify-between'>
						<Table>
							<TableBody>
								{likes.map((like: ProductReviewLike) => (
									<TableRow key={like.key} className='border-neutral-800 hover:bg-neutral-800/30'>
										<TableCell className='py-3'>
											<div className='flex items-center gap-3'>
												{like.customer?.avatar?.preview ?
													<img
														src={like.customer.avatar.preview}
														alt='avatar'
														className='w-8 h-8 rounded-full bg-neutral-800 object-cover'
													/>
												:	<div className='w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-400 uppercase'>
														{getFullName(like?.customer)?.[0] || ''}
													</div>
												}
												<div>
													<Button
														variant='link'
														className='p-0 h-auto text-blue-400 hover:text-blue-300 text-sm'
														onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${like.customer?.key}`)}>
														{getFullName(like.customer)}
													</Button>
													<p className='text-xs text-neutral-400'>{formatDate(like.createdAt)}</p>
												</div>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>

						<div className='border-t border-neutral-800 p-3 flex justify-between items-center bg-neutral-900/40 rounded-b-xl'>
							<Button
								variant='ghost'
								size='sm'
								disabled={page === 1}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className='h-8 px-2 text-[14px] text-neutral-400 hover:text-white'>
								Previous
							</Button>
							<span className='text-[14px] text-neutral-500 font-medium'>
								{page} / {totalPages}
							</span>
							<Button
								variant='ghost'
								size='sm'
								disabled={page === totalPages}
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								className='h-8 px-2 text-[14px] text-neutral-400 hover:text-white'>
								Next
							</Button>
						</div>
					</div>
				}
			</CardContent>
		</Card>
	);
};
