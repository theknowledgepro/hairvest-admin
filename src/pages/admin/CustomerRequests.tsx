import React, { useState } from 'react';
import { ClipboardList, Search, Loader2, ChevronLeft, ChevronRight, Eye, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useCustomerRequestsQuery } from '@/hooks/useRequests';
import { formatDate } from '@/lib/formatDate';
import { getCloudFileURL, getFullName } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/config/routes.app';
import { useDebounce } from 'use-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthStore } from '@/store/useAuthStore';

export const CustomerRequests: React.FC = () => {
	const navigate = useNavigate();
	const user = useAuthStore((state) => state.user);
	const [page, setPage] = useState(1);
	const [searchInput, setSearchInput] = useState('');
	const [debouncedSearch] = useDebounce(searchInput, 500);
	const [limit, setLimit] = useState(10);
	const [selectedRequest, setSelectedRequest] = useState<any>(null);

	const { data: requestsResponse, isLoading } = useCustomerRequestsQuery(user?.businessId!, page, limit, debouncedSearch);
	const requests = requestsResponse?.data?.results || [];
	const pagination = requestsResponse?.data;
	const totalPages = pagination?.totalPages ?? 1;
	const totalResults = pagination?.totalCount ?? 0;

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white'>Customer Requests</h2>
					<p className='text-neutral-400 mt-1'>Review and manage product requests submitted by your customers.</p>
				</div>
			</div>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur-sm gap-0 p-0'>
				<CardHeader className='border-b border-neutral-800 p-4'>
					<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
						<CardTitle className='text-lg font-semibold text-white flex items-center gap-2'>
							<ClipboardList className='h-6 w-6 text-blue-400' />
							Product Request Submissions
							<span className='ml-2 px-2 py-0.5 text-[12px] leading-tight font-medium rounded-[6px] bg-blue-500/10 text-blue-400 border border-blue-500/20'>
								{totalResults} Total
							</span>
						</CardTitle>
						<div className='relative w-full md:w-72'>
							<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500' />
							<input
								placeholder='Search by customer or details...'
								className='w-full bg-neutral-950 border border-neutral-800 rounded-md py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all'
								value={searchInput}
								onChange={(e) => {
									setSearchInput(e.target.value);
									setPage(1);
								}}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent className='p-0'>
					{isLoading ?
						<div className='p-24 flex flex-col items-center justify-center text-neutral-500'>
							<Loader2 className='h-8 w-8 animate-spin mb-4 text-blue-500' />
							<p className='animate-pulse text-sm'>Loading requests...</p>
						</div>
					: requests.length === 0 ?
						<div className='p-20 flex flex-col items-center justify-center text-neutral-500'>
							<div className='w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mb-4'>
								<ClipboardList className='h-8 w-8 text-neutral-700' />
							</div>
							<p className='font-medium text-neutral-300'>No requests found</p>
							<p className='text-xs mt-1 text-center max-w-sm'>Customers haven't submitted any product requests yet.</p>
						</div>
					:	<>
							<Table>
								<TableHeader className='bg-neutral-800/30'>
									<TableRow className='hover:bg-transparent border-neutral-800'>
										<TableHead className='text-neutral-400 h-10'>S/N</TableHead>
										<TableHead className='text-neutral-400 h-10'>Customer</TableHead>
										<TableHead className='text-neutral-400 h-10'>Description Preview</TableHead>
										<TableHead className='text-neutral-400 h-10 text-center'>Media</TableHead>
										<TableHead className='text-neutral-400 h-10'>Submitted On</TableHead>
										<TableHead className='text-neutral-400 h-10 text-right pr-6'>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{requests.map((request, index) => (
										<TableRow key={request.key} className='border-neutral-800 hover:bg-neutral-800/20 transition-colors group'>
											<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
											<TableCell className='py-4'>
												<div
													className='flex items-center gap-3 cursor-pointer'
													onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${request.customer?.key}`)}>
													<Avatar className='h-9 w-9 ring-1 ring-neutral-800'>
														<AvatarImage src={getCloudFileURL(request.customer?.avatar)} />
														<AvatarFallback className='bg-neutral-800 text-neutral-400 text-xs text-center flex items-center justify-center'>
															{request.customer?.firstName?.[0]}
														</AvatarFallback>
													</Avatar>
													<div className='flex flex-col'>
														<p className='text-sm font-medium text-white group-hover:text-blue-400 transition-colors'>
															{getFullName(request.customer)}
														</p>
														<p className='text-xs text-neutral-500 truncate max-w-[150px]'>{request.customer?.email}</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<p className='text-sm text-neutral-300 max-w-[300px] truncate italic'>"{request.description}"</p>
											</TableCell>
											<TableCell className='text-center'>
												<div className='inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-800/50 border border-neutral-800 text-neutral-400'>
													<ImageIcon className='h-3.5 w-3.5' />
													<span className='text-xs font-medium'>{request.images?.length || 0}</span>
												</div>
											</TableCell>
											<TableCell>
												<div className='flex flex-col'>
													<p className='text-sm text-neutral-300'>{formatDate(request.createdAt)}</p>
													<p className='text-[10px] text-neutral-500 uppercase tracking-wider font-semibold'>
														{new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
													</p>
												</div>
											</TableCell>
											<TableCell className='text-right pr-6'>
												<Button
													variant='ghost'
													size='sm'
													className='h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800'
													onClick={() => setSelectedRequest(request)}>
													<Eye className='h-4 w-4' />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</>
					}
				</CardContent>
				<CardFooter className='border-t border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
					<div className='flex items-center gap-6'>
						<div className='flex items-center gap-2'>
							<span className='text-sm text-neutral-400 font-medium'>Rows per page:</span>
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
							<span className='text-sm text-neutral-500 font-medium'>of {totalPages}</span>
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
			</Card>

			{/* Detail Modal */}
			<Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
				<DialogContent className='bg-neutral-950 border-neutral-800 text-white max-w-2xl overflow-hidden flex flex-col max-h-[90vh] p-0 gap-0'>
					<DialogHeader className='p-6 border-b border-neutral-800'>
						<div className='flex items-center justify-between gap-3'>
							<Avatar className='h-10 w-10 ring-1 ring-neutral-800'>
								<AvatarImage src={getCloudFileURL(selectedRequest?.customer?.avatar)} />
								<AvatarFallback className='bg-neutral-800 text-neutral-400 text-sm flex items-center justify-center font-bold'>
									{selectedRequest?.customer?.firstName?.[0]}
								</AvatarFallback>
							</Avatar>
							<div className='flex-1 flex flex-col'>
								<div className='flex items-center justify-between gap-4'>
									<DialogTitle className='text-xl text-white'>{getFullName(selectedRequest?.customer)}</DialogTitle>
									<div className='shrink-0 flex bg-neutral-800/30 px-3 py-1 rounded-full border border-neutral-800 text-[12px] font-mono text-neutral-400 uppercase tracking-tighter'>
										ID: {selectedRequest?.key}
									</div>
								</div>
								<DialogDescription className='text-neutral-500 text-xs flex items-center gap-2 mt-0.5'>
									Submitted on {formatDate(selectedRequest?.createdAt)}
								</DialogDescription>
							</div>
						</div>
					</DialogHeader>

					<div className='flex-1 overflow-y-auto p-6 space-y-8'>
						<div>
							<h4 className='text-xs uppercase font-bold text-neutral-500 tracking-widest mb-3'>Description</h4>
							<div className='bg-neutral-900/40 p-5 rounded-xl border border-neutral-800/50 leading-relaxed text-neutral-200'>
								{selectedRequest?.description}
							</div>
						</div>

						{selectedRequest?.images?.length > 0 && (
							<div>
								<h4 className='text-xs uppercase font-bold text-neutral-500 tracking-widest mb-3 flex items-center justify-between'>
									<span>Attached Images ({selectedRequest.images.length})</span>
									<span className='text-[10px] font-normal lowercase tracking-normal text-neutral-600'>(Raw Resolution)</span>
								</h4>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									{selectedRequest.images.map((img: string, idx: number) => (
										<div
											key={idx}
											className='relative group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 min-h-[300px]'>
											<img
												src={getCloudFileURL(img)}
												alt={`Request asset ${idx + 1}`}
												className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100'
											/>
											<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]'>
												<a
													href={getCloudFileURL(img)}
													target='_blank'
													rel='noopener noreferrer'
													className='w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors border border-white/20'>
													<ExternalLink className='h-5 w-5 text-white' />
												</a>
											</div>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					<div className='p-3 border-t border-neutral-800 flex justify-end gap-3 bg-neutral-900/20'>
						<Button
							variant='outline'
							className='bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
							onClick={() => setSelectedRequest(null)}>
							Close
						</Button>
						<Button
							className='bg-blue-600 hover:bg-blue-500 text-white'
							onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${selectedRequest?.customer?.key}`)}>
							View Customer Profile
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
