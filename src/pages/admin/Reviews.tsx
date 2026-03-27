import React, { useState } from 'react';
import { Star, MessageSquare, Loader2, MoreHorizontal, Edit, Trash2, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useProductReviewsQuery, useDeleteProductReviewMutation, useUpdateProductReviewMutation } from '@/hooks/useProductReviews';
import { useAuthStore } from '@/store/useAuthStore';
import { formatDate } from '@/lib/formatDate';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/config/routes.app';
import { AddReviewModal } from '@/components/admin/AddReviewModal';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getFullName } from '@/lib/utils';

export const Reviews: React.FC = () => {
	const navigate = useNavigate();
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

	const { mutate: deleteReview } = useDeleteProductReviewMutation();
	const { mutate: updateReview } = useUpdateProductReviewMutation();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-full'>
				<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
			</div>
		);
	}

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
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400'>Customer</TableHead>
								<TableHead className='text-neutral-400'>Product</TableHead>
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
									<TableCell colSpan={7} className='text-center py-20 text-neutral-500'>
										<Star className='h-12 w-12 mx-auto mb-4 opacity-20' />
										No reviews found.
									</TableCell>
								</TableRow>
							:	reviews.map((review) => (
									<TableRow key={review.key} className='border-neutral-800 hover:bg-neutral-800/30 transition-colors'>
										<TableCell className='font-medium text-white'>
											<Button
												variant='link'
												className='p-0 h-auto text-blue-400 hover:text-blue-300 text-sm'
												onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${review.customer?.key}`)}>
												{getFullName(review.customer)}
											</Button>
										</TableCell>
										<TableCell>
											<Button
												variant='link'
												className='p-0 h-auto text-blue-400 hover:text-blue-300 text-sm'
												onClick={() => navigate(`${APP_ROUTES.PRODUCTS}/${review.product?.key}`)}>
												{review.product?.title}
											</Button>
										</TableCell>
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
												className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${review.published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-neutral-800 text-red-500 border border-neutral-700'}`}>
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
													<Button variant='ghost' className='h-8 w-8 p-0 text-neutral-400'>
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
												{review.createdAt && (
													<span className='text-[14px] text-neutral-200 text-nowrap'>{formatDate(review.createdAt)}</span>
												)}
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
				</CardContent>
				{reviews.length > 0 && (
					<CardFooter className='border-t border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
						<div className='flex items-center gap-6'>
							<div className='flex items-center gap-2'>
								<span className='text-sm text-neutral-400'>Rows per page:</span>
								<Select
									value={String(limit)}
									onValueChange={(val) => {
										setLimit(Number(val));
										setPage(1);
									}}>
									<SelectTrigger className='w-max bg-neutral-800 border-neutral-700 text-white h-8 focus:ring-1 focus:ring-blue-500'>
										<SelectValue />
									</SelectTrigger>
									<SelectContent className='bg-neutral-900 border-neutral-800 text-white'>
										{[10, 20, 50, 100].map((l) => (
											<SelectItem key={l} value={String(l)} className='focus:bg-neutral-800 focus:text-white'>
												{l}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
							<span className='text-sm text-neutral-500'>
								Showing {(page - 1) * limit + 1} to {Math.min(page * limit, totalResults)} of {totalResults}
							</span>
						</div>

						<div className='flex items-center gap-2'>
							<Button
								variant='ghost'
								size='sm'
								disabled={page <= 1}
								onClick={() => setPage((p) => Math.max(1, p - 1))}
								className='text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 w-8 p-0'>
								<ChevronLeft className='h-4 w-4' />
							</Button>
							<div className='flex items-center gap-1 px-2'>
								<span className='text-sm font-medium text-white'>Page {page}</span>
								<span className='text-sm text-neutral-500'>of {totalPages}</span>
							</div>
							<Button
								variant='ghost'
								size='sm'
								disabled={page >= totalPages}
								onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
								className='text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 w-8 p-0'>
								<ChevronRight className='h-4 w-4' />
							</Button>
						</div>
					</CardFooter>
				)}
			</Card>
		</div>
	);
};
