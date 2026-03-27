import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Star, Trash2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/formatDate';
import { APP_ROUTES } from '@/config/routes.app';
import { getFullName } from '@/lib/utils';
import { ReviewLikes } from '@/components/admin/ReviewLikes';
import { useProductReviewQuery, useUpdateProductReviewMutation, useDeleteProductReviewMutation } from '@/hooks/useProductReviews';

export const ReviewDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const { data: reviewResponse, isLoading: isLoadingReview } = useProductReviewQuery(id);
	const review = reviewResponse?.data?.review;

	const { mutate: updateReview } = useUpdateProductReviewMutation();
	const { mutate: deleteReview } = useDeleteProductReviewMutation(() => {
		navigate(APP_ROUTES.REVIEWS);
	});

	if (isLoadingReview) {
		return (
			<div className='flex items-center justify-center h-full'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
			</div>
		);
	}

	if (!review) {
		return (
			<div className='flex flex-col items-center justify-center h-full text-neutral-400'>
				<Star className='h-12 w-12 mb-4 opacity-20' />
				<h2 className='text-xl font-medium mb-2'>Review Not Found</h2>
				<Button variant='outline' onClick={() => navigate(APP_ROUTES.REVIEWS)}>
					Back to Reviews
				</Button>
			</div>
		);
	}

	return (
		<div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto'>
			<div className='flex items-center gap-4 text-white'>
				<Button variant='outline' size='icon' onClick={() => navigate(-1)} className='bg-neutral-900 border-neutral-800 hover:bg-neutral-800'>
					<ArrowLeft className='h-4 w-4 text-neutral-400' />
				</Button>
				<div>
					<h2 className='text-3xl font-bold tracking-tight'>Review Details</h2>
					<p className='text-neutral-400'>View comprehensive information and likes for this review.</p>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<Card className='bg-neutral-900/50 border-neutral-800 col-span-1 lg:col-span-2'>
					<CardHeader className='border-b border-neutral-800'>
						<CardTitle className='text-xl flex items-center justify-between'>
							<span className='flex items-center gap-2'>
								<Star className='h-5 w-5 text-yellow-500' /> Review Content
							</span>
							<div className='flex gap-2 relative z-10'>
								<Button
									variant='outline'
									size='sm'
									className='border-neutral-800 hover:bg-neutral-800'
									onClick={() => updateReview({ id: review.key, data: { published: !review.published } })}>
									{review.published ? 'Hide' : 'Publish'} Review
								</Button>
								<Button
									variant='destructive'
									size='sm'
									onClick={() => {
										if (confirm('Are you sure you want to delete this review?')) deleteReview(review.key);
									}}>
									<Trash2 className='h-4 w-4' /> Delete
								</Button>
							</div>
						</CardTitle>
					</CardHeader>
					<CardContent className='p-6 space-y-6'>
						<div className='flex items-start justify-between'>
							<div className='space-y-1'>
								<h3 className='text-lg font-medium text-white'>{getFullName(review?.customer)}</h3>
								<p className='text-sm text-neutral-500 font-medium'>{review.customer?.email}</p>
								<p className='text-[14px] text-neutral-500'>{formatDate(review.createdAt)}</p>
							</div>
							<div className='flex items-center gap-2'>
								<div className='flex'>
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-700'}`}
										/>
									))}
								</div>
								<div className='flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/20 text-[15px] font-bold'>
									<Heart className='h-4 w-4 fill-rose-500/20' />
									{review.likesCount ?? 0}
								</div>
								<span
									className={`ml-2 px-2 py-0.5 rounded-full text-xs uppercase font-bold ${
										review.published ?
											'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
										:	'bg-neutral-800 text-red-500 border border-neutral-700'
									}`}>
									{review.published ? 'Published' : 'Hidden'}
								</span>
							</div>
						</div>

						<div className='p-4 rounded-lg bg-neutral-800/30 border border-neutral-800/50 text-neutral-300'>
							<p className='whitespace-pre-wrap leading-relaxed'>{review.comment}</p>
						</div>
					</CardContent>
				</Card>

				<ReviewLikes reviewId={review.key} />
			</div>
		</div>
	);
};
