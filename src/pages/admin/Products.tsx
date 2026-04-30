import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useNavigate } from 'react-router-dom';
import { TablePagination } from '../../components/TablePagination';
import {
	useProductsQuery,
	useDeleteProductMutation,
	useToggleProductAvailabilityMutation,
	useToggleProductFlashSaleMutation,
} from '../../hooks/useProducts';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Switch } from '../../components/ui/switch';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Plus, Package, Loader2, MoreHorizontal, Trash2, Edit, ImageIcon, PlayCircle, Video, AlertCircle, Flame, Search } from 'lucide-react';
import { getCloudFileURL, cn } from '../../lib/utils';
import { APP_ROUTES } from '../../config/routes.app';
import { useAuthStore } from '../../store/useAuthStore';
import { formatDate } from '@/lib/formatDate';

export const Products: React.FC = () => {
	const navigate = useNavigate();
	const { user } = useAuthStore();

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchInput, setSearchInput] = useState('');
	const [debouncedSearch] = useDebounce(searchInput, 500);

	const { data: productsResponse, isLoading } = useProductsQuery({
		businessId: user?.businessId || '',
		page,
		limit,
		search: debouncedSearch || undefined,
	});
	const products = productsResponse?.data?.results ?? [];
	const totalPages = productsResponse?.data?.totalPages ?? 1;
	const totalResults = productsResponse?.data?.totalCount ?? 0;

	// Computations for video upload status alerts
	const processingProducts = products.filter((p: any) => p.videosProcessingId);
	const failedVideoProducts = products.filter((p: any) => p.videosProcessingError);

	const { mutate: deleteProduct } = useDeleteProductMutation();
	const { mutate: toggleAvailability, isPending: isToggling } = useToggleProductAvailabilityMutation();
	const { mutate: toggleFlashSale } = useToggleProductFlashSaleMutation();

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<Package className='h-8 w-8 text-blue-400' /> Products
					</h2>
					<p className='text-neutral-400 mt-1'>Manage your inventory and product listings.</p>
				</div>

				<Button
					onClick={() => navigate(`${APP_ROUTES.PRODUCTS}/new`)}
					className='bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'>
					<Plus className='mr-2 h-4 w-4' /> Add Product
				</Button>
			</div>

			{/* Video Processing Alerts */}
			{(processingProducts.length > 0 || failedVideoProducts.length > 0) && (
				<div className='flex flex-col gap-3 mb-6'>
					{processingProducts.length > 0 && (
						<div className='flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg'>
							<Video className='h-5 w-5 text-blue-400 mt-0.5 shrink-0 animate-pulse' />
							<div>
								<p className='text-sm font-medium text-blue-400'>Videos are currently processing</p>
								<p className='text-xs text-blue-400/80 mt-1'>
									{processingProducts.length} product{processingProducts.length === 1 ? ' is' : 's are'} generating video variants in the
									background. They will automatically update when finished.
								</p>
							</div>
						</div>
					)}
					{failedVideoProducts.length > 0 && (
						<div className='flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'>
							<AlertCircle className='h-5 w-5 text-red-400 mt-0.5 shrink-0' />
							<div>
								<p className='text-sm font-medium text-red-400'>Video processing failed</p>
								<p className='text-xs text-red-400/80 mt-1'>
									{failedVideoProducts.length} product{failedVideoProducts.length === 1 ? ' has' : 's have'} encountered an error while
									processing videos. Please edit the product to re-upload the videos.
								</p>
							</div>
						</div>
					)}
				</div>
			)}

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0 gap-0'>
				<div className='p-4 border-b border-neutral-800 flex items-center justify-between'>
					<div className='relative w-full max-w-lg'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500' />
						<Input
							type='text'
							placeholder='Search products by title, summary, or category...'
							className='pl-9 bg-neutral-900 border-neutral-700 text-white w-full'
							value={searchInput}
							onChange={(e) => {
								setSearchInput(e.target.value);
								setPage(1); // Reset to first page on new search
							}}
						/>
					</div>
				</div>

				<CardContent className='p-0 text-white font-sans'>
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400'>S/N</TableHead>
								<TableHead className='text-neutral-400 w-[100px]'>Preview</TableHead>
								<TableHead className='text-neutral-400'>Product</TableHead>
								<TableHead className='text-neutral-400'>Category</TableHead>
								<TableHead className='text-neutral-400'>Statistics</TableHead>
								<TableHead className='text-neutral-400'>Price</TableHead>
								<TableHead className='text-neutral-400'>Stock</TableHead>
								<TableHead className='text-neutral-400'>Status</TableHead>
								<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
								<TableHead className='text-neutral-400'>Created</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ?
								<TableRow>
									<TableCell colSpan={9} className='text-center py-10 text-neutral-500'>
										<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-blue-400' />
										Loading products...
									</TableCell>
								</TableRow>
							: products.length === 0 ?
								<TableRow>
									<TableCell colSpan={9} className='text-center py-10 text-neutral-500'>
										No products found. Add one to get started.
									</TableCell>
								</TableRow>
							:	products.map((product, index: number) => (
									<TableRow
										key={product.id}
										className='border-neutral-800 hover:bg-neutral-800/30 transition-colors cursor-pointer group/row'
										onClick={() => navigate(`${APP_ROUTES.PRODUCTS}/${product.key}`)}>
										<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
										<TableCell>
											<div className='h-12 w-12 rounded-lg bg-neutral-800 border-neutral-700 overflow-hidden relative group'>
												{product.images && product.images.length > 0 ?
													<img
														src={getCloudFileURL(product.images[0].thumbnail)}
														alt={product.title}
														className='h-full w-full object-cover'
													/>
												:	<div className='h-full w-full flex items-center justify-center'>
														<ImageIcon className='h-5 w-5 text-neutral-600' />
													</div>
												}
												{product.videos && product.videos.length > 0 && (
													<div className='absolute bottom-0.5 right-0.5 bg-black/60 rounded-full p-0.5'>
														<PlayCircle className='h-3 w-3 text-white' />
													</div>
												)}
											</div>
										</TableCell>
										<TableCell className='font-medium text-white max-w-[200px]'>
											<div className='flex flex-col gap-1.5'>
												<div>
													<p className='text-sm font-semibold truncate'>{product.title}</p>
													<p className='text-[13px] text-neutral-400 font-normal line-clamp-1'>{product.summary}</p>
													{product.isFlashSale && (
														<p className='mt-1 text-[12px] text-yellow-400 font-[500] flex items-center gap-[5px]'>
															Flash Sale <Flame size={16} className={`text-yellow-400`} />
														</p>
													)}
												</div>
												{/* Inline video processing badge */}
												{product.videosProcessingId && (
													<div className='flex items-center gap-1.5 text-[11px] font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-full w-fit'>
														<Loader2 className='h-3 w-3 animate-spin' />
														Processing Videos ({product.videosCompletedCount ?? 0}/{product.videosExpectedCount ?? 0})
													</div>
												)}
												{product.videosProcessingError && (
													<div className='flex items-center gap-1.5 text-[11px] font-medium text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full w-fit max-w-full'>
														<AlertCircle className='h-3 w-3 shrink-0' />
														<span className='truncate'>Failed: {product.videosProcessingError}</span>
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											<span className='px-2 pt-0.5 pb-1.5 text-[14px] rounded-[5px] bg-blue-500/10 text-blue-400 border border-blue-500/20'>
												{product.category?.title || 'Uncategorized'}
											</span>
										</TableCell>
										<TableCell>
											<div className='flex flex-col gap-1.5'>
												<div>
													<p className='text-sm font-semibold truncate'>{product.salesCount} sold</p>
													<p className='text-[13px] text-neutral-400 font-normal line-clamp-1'>
														{product.cartCount} in customer carts
													</p>
													<p className='text-[13px] text-neutral-400 font-normal line-clamp-1'>
														{product.reviewsCount} total reviews
													</p>
													<p className='text-[13px] text-neutral-400 font-normal line-clamp-1'>
														{product.avgRating.toFixed(1)} avg rating
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell className='text-white font-medium'>
											<div className='flex flex-col'>
												<span className='text-sm'>
													{product.currency} {(product.amount * (1 - product.discountPercent / 100)).toLocaleString()}
												</span>
												{product.discountPercent > 0 && (
													<div className='flex items-center gap-2 mt-0.5'>
														<span className='text-xs text-neutral-500 line-through'>
															{product.currency} {product.amount.toLocaleString()}
														</span>
														<span className='text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-[4px] border border-emerald-500/20'>
															-{product.discountPercent}%
														</span>
													</div>
												)}
											</div>
										</TableCell>
										<TableCell>
											<span className={cn('text-sm', product.availableStock < 5 ? 'text-amber-400' : 'text-neutral-400')}>
												{product.availableStock}
											</span>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Switch
													className='data-[state=checked]:bg-emerald-500!'
													disabled={isToggling}
													checked={product.isAvailable}
													onCheckedChange={() => toggleAvailability(product.key)}
													onClick={(e) => e.stopPropagation()}
												/>
												<span
													className={cn(
														'text-xs font-medium transition-colors',
														product.isAvailable ? 'text-emerald-400' : 'text-neutral-500',
													)}>
													{product.isAvailable ? 'Active' : 'Hidden'}
												</span>
											</div>
										</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
													<Button variant='ghost' className='h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800'>
														<span className='sr-only'>Open menu</span>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='bg-neutral-900 border-neutral-800 text-white'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															navigate(`${APP_ROUTES.PRODUCTS}/${product.key}`);
														}}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<Package className='mr-2 h-4 w-4 text-blue-400' /> View Details
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															navigate(`${APP_ROUTES.PRODUCTS}/edit/${product.key}`);
														}}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<Edit className='mr-2 h-4 w-4 text-blue-400' /> Edit Product
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															toggleFlashSale(product.key);
														}}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<Flame
															size={16}
															className={cn('mr-2', product.isFlashSale ? 'text-yellow-400' : 'text-neutral-500')}
														/>
														{product.isFlashSale ? 'Remove from Flash Sale' : 'Add to Flash Sale'}
													</DropdownMenuItem>
													<DropdownMenuSeparator className='bg-neutral-800' />
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															if (confirm('Are you sure you want to delete this product?')) {
																deleteProduct(product.key);
															}
														}}
														className='hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer'>
														<Trash2 className='mr-2 h-4 w-4' /> Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
										<TableCell>
											<div className='flex flex-col gap-0.5'>
												{product.createdAt && (
													<span className='text-[14px] text-neutral-200 text-nowrap'>{formatDate(product.createdAt)}</span>
												)}
												{product.updatedAt && product.updatedAt !== product.createdAt && (
													<span className='text-[13px] text-neutral-400 text-nowrap'>
														Edited {formatDate(product.updatedAt)}
													</span>
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
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
