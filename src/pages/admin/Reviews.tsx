import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TablePagination } from '../../components/TablePagination';
import { useAuthStore } from '@/store/useAuthStore';
import { AddReviewModal } from '@/components/admin/reviews/AddReviewModal';
import { Plus } from 'lucide-react';
import { ReviewsTable } from '@/components/admin/reviews/ReviewsTable';
import { useProductReviewsQuery } from '@/hooks/useProductReviews';

export const Reviews: React.FC = () => {
	const { user } = useAuthStore();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

	const { data: reviewsResponse, isLoading } = useProductReviewsQuery({
		businessId: user?.businessId || '',
		page,
		limit,
	});

	const reviews = reviewsResponse?.data?.results || [];
	const totalPages = reviewsResponse?.data?.totalPages || 1;
	const totalResults = reviewsResponse?.data?.totalCount ?? 0;

	return (
		<div className='space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex items-center justify-between'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<Star className='h-8 w-8 text-yellow-500' /> Reviews & Ratings
					</h2>
					<p className='text-neutral-400 mt-1'>Manage customer feedback across all products.</p>
				</div>
				<Button onClick={() => setIsAddModalOpen(true)} className='bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'>
					<Plus className='mr-2 h-4 w-4' /> Add Review
				</Button>
			</div>

			<AddReviewModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0 gap-0'>
				<div className='p-4 border-b border-neutral-800 flex items-center justify-between'>
					<div className='text-lg font-medium text-white flex items-center gap-2'>
						<MessageSquare className='h-5 w-5 text-blue-400' /> All Reviews
					</div>
				</div>
				<CardContent className='p-0 text-white font-sans'>
					<ReviewsTable reviews={reviews} isLoading={isLoading} page={page} limit={limit} />
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
