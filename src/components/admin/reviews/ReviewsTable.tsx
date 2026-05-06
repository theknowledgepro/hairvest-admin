import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Star, Heart, MoreHorizontal, MessageSquare, Edit, Trash2, Loader2 } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getFullName } from '@/lib/utils';
import { formatDate } from '@/lib/formatDate';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/config/routes.app';
import { useUpdateProductReviewMutation, useDeleteProductReviewMutation } from '@/hooks/useProductReviews';

interface ReviewsTableProps {
	reviews: any[];
	isLoading: boolean;
	page: number;
	limit: number;
	showCustomerColumn?: boolean;
	showProductColumn?: boolean;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({ reviews, isLoading, page, limit, showCustomerColumn = true, showProductColumn = true }) => {
	const navigate = useNavigate();
	const { mutate: updateReview } = useUpdateProductReviewMutation();
	const { mutate: deleteReview } = useDeleteProductReviewMutation();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-20'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
			</div>
		);
	}

	return (
		<Table>
			<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
				<TableRow className='hover:bg-transparent border-neutral-800'>
					<TableHead className='text-neutral-400 w-12'>S/N</TableHead>
					{showCustomerColumn && <TableHead className='text-neutral-400'>Customer</TableHead>}
					{showProductColumn && <TableHead className='text-neutral-400'>Product</TableHead>}
					<TableHead className='text-neutral-400'>Rating</TableHead>
					<TableHead className='text-neutral-400'>Comment</TableHead>
					<TableHead className='text-neutral-400'>Status</TableHead>
					<TableHead className='text-neutral-400 text-center'>Likes</TableHead>
					<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
					<TableHead className='text-neutral-400'>Created</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{reviews.length === 0 ?
					<TableRow>
						<TableCell colSpan={9} className='text-center py-20 text-neutral-500'>
							<Star className='h-12 w-12 mx-auto mb-4 opacity-20' />
							No reviews found.
						</TableCell>
					</TableRow>
				:	reviews.map((review, index) => (
						<TableRow key={review.key} className='border-neutral-800 hover:bg-neutral-800/30 transition-colors'>
							<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
							{showCustomerColumn && (
								<TableCell className='font-medium text-white'>
									<Button
										variant='link'
										className='p-0 h-auto text-blue-400 hover:text-blue-300 text-sm'
										onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${review.customer?.key}`)}>
										{getFullName(review.customer)}
									</Button>
								</TableCell>
							)}
							{showProductColumn && (
								<TableCell>
									<Button
										variant='link'
										className='p-0 h-auto text-blue-400 hover:text-blue-300 text-sm'
										onClick={() => navigate(`${APP_ROUTES.PRODUCTS}/${review.product?.key}`)}>
										{review.product?.title}
									</Button>
								</TableCell>
							)}
							<TableCell>
								<div className='flex'>
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-neutral-600'}`}
										/>
									))}
								</div>
							</TableCell>
							<TableCell className='max-w-[300px]'>
								<p className='text-sm text-neutral-300 truncate'>{review.comment}</p>
							</TableCell>
							<TableCell>
								<span
									className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
										review.published ?
											'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
										:	'bg-neutral-800 text-red-500 border-neutral-700'
									}`}>
									{review.published ? 'Published' : 'Hidden'}
								</span>
							</TableCell>
							<TableCell className='text-center'>
								<div className='flex items-center justify-center gap-1 text-rose-500 font-medium'>
									<Heart className='h-4 w-4 fill-rose-500/20' />
									<span className='font-[700]'>{review.likesCount ?? 0}</span>
								</div>
							</TableCell>
							<TableCell className='text-right'>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant='ghost' className='h-8 w-8 p-0 text-neutral-400 hover:text-white'>
											<MoreHorizontal className='h-4 w-4' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end' className='bg-neutral-900 border-neutral-800 text-white'>
										<DropdownMenuLabel>Actions</DropdownMenuLabel>
										<DropdownMenuItem
											onClick={() => navigate(`${APP_ROUTES.REVIEWS}/${review.key}`)}
											className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
											<MessageSquare className='mr-2 h-4 w-4 text-emerald-400' /> View Details
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => updateReview({ id: review.key, data: { published: !review.published } })}
											className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
											<Edit className='mr-2 h-4 w-4 text-blue-400' /> {review.published ? 'Hide' : 'Publish'}
										</DropdownMenuItem>
										<DropdownMenuSeparator className='bg-neutral-800' />
										<DropdownMenuItem
											onClick={() => {
												if (confirm('Delete this review?')) deleteReview(review.key);
											}}
											className='hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer'>
											<Trash2 className='mr-2 h-4 w-4' /> Delete
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
							<TableCell>
								<div className='flex flex-col gap-0.5'>
									{review.createdAt && <span className='text-[14px] text-neutral-200 text-nowrap'>{formatDate(review.createdAt)}</span>}
									{review.updatedAt && review.updatedAt !== review.createdAt && (
										<span className='text-[13px] text-neutral-400 text-nowrap'>Edited {formatDate(review.updatedAt)}</span>
									)}
								</div>
							</TableCell>
						</TableRow>
					))
				}
			</TableBody>
		</Table>
	);
};
