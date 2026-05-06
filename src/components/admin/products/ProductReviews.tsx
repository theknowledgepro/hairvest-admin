import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useProductReviewsQuery } from '@/hooks/useProductReviews';
import { Plus, Loader2 } from 'lucide-react';
import { AddReviewModal } from '@/components/admin/reviews/AddReviewModal';
import { TablePagination } from '@/components/TablePagination';
import { ReviewsTable } from '@/components/admin/reviews/ReviewsTable';

interface ProductReviewsProps {
	businessId: string;
	productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ businessId, productId }) => {
	const [page, setPage] = React.useState(1);
	const [limit, setLimit] = React.useState(10);
	const [isAddReviewModalOpen, setIsAddReviewModalOpen] = React.useState(false);

	const { data: reviewsData, isLoading } = useProductReviewsQuery({
		businessId,
		productId,
		page,
		limit,
	});

	const reviews = reviewsData?.data?.results || [];
	const totalPages = reviewsData?.data?.totalPages ?? 1;
	const totalResults = reviewsData?.data?.totalCount ?? 0;

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-20'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
			</div>
		);
	}

	return (
		<Card className='bg-neutral-900/50 border-neutral-800 min-h-[400px] flex flex-col p-0'>
			<div className='px-6 py-4 border-b border-neutral-800 flex items-center justify-between'>
				<h3 className='text-lg font-medium text-white'>Product Reviews</h3>
				<Button
					size='sm'
					variant='outline'
					className='h-8 border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
					onClick={() => setIsAddReviewModalOpen(true)}>
					<Plus className='h-4 w-4 mr-1' /> Add Review
				</Button>
			</div>
			<CardContent className='flex-1 p-0'>
				<ReviewsTable reviews={reviews} isLoading={isLoading} page={page} limit={limit} showProductColumn={false} />
			</CardContent>

			<TablePagination
				page={page}
				limit={limit}
				totalResults={totalResults}
				totalPages={totalPages}
				onPageChange={setPage}
				onLimitChange={setLimit}
			/>

			<AddReviewModal open={isAddReviewModalOpen} onOpenChange={setIsAddReviewModalOpen} initialProductId={productId} />
		</Card>
	);
};
