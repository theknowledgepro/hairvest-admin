import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { CardFooter } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface TablePaginationProps {
	page: number;
	limit: number;
	totalResults: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
	page,
	limit,
	totalResults,
	totalPages,
	onPageChange,
	onLimitChange,
}) => {
	if (totalResults === 0) return null;

	return (
		<CardFooter className='border-t border-neutral-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4'>
			<div className='flex items-center gap-6'>
				<div className='flex items-center gap-2'>
					<span className='text-sm text-neutral-400'>Rows per page:</span>
					<Select
						value={String(limit)}
						onValueChange={(val) => {
							onLimitChange(Number(val));
							onPageChange(1);
						}}>
						<SelectTrigger className='w-max bg-neutral-800 border-neutral-700 text-white h-8 focus:ring-1 focus:ring-blue-500'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className='bg-neutral-900 border-neutral-800 text-white'>
							{[10, 20, 50, 100].map((l) => (
								<SelectItem key={l} value={String(l)} className='focus:bg-neutral-800 focus:text-white cursor-pointer'>
									{l}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<span className='text-sm text-neutral-500'>
					Showing <span className='text-white font-medium'>{(page - 1) * limit + 1}</span> to{' '}
					<span className='text-white font-medium'>{Math.min(page * limit, totalResults)}</span> of{' '}
					<span className='text-white font-medium'>{totalResults}</span>
				</span>
			</div>

			<div className='flex items-center gap-2'>
				<Button
					variant='ghost'
					size='sm'
					disabled={page <= 1}
					onClick={() => onPageChange(Math.max(1, page - 1))}
					className='text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 w-8 p-0 transition-colors'>
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
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
					className='text-neutral-400 hover:text-white hover:bg-neutral-800 h-8 w-8 p-0 transition-colors'>
					<ChevronRight className='h-4 w-4' />
				</Button>
			</div>
		</CardFooter>
	);
};
