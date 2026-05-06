import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useProductsInfiniteQuery } from '@/hooks/useProducts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Check, ShoppingBag } from 'lucide-react';
import { cn, getCloudFileURL } from '@/lib/utils';
import type { Product } from '@/api/products';

interface ProductStepProps {
	businessId: string;
	selectedProduct: Product | null;
	onSelect: (product: Product | null) => void;
}

export const ProductStep: React.FC<ProductStepProps> = ({ businessId, selectedProduct, onSelect }) => {
	const [search, setSearch] = useState('');
	const [debouncedSearch] = useDebounce(search, 500);

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useProductsInfiniteQuery({
		businessId,
		search: debouncedSearch,
		limit: 5,
	});

	const products = data?.pages.flatMap((page) => page.data?.results || []) || [];

	return (
		<div className='space-y-4 animate-in fade-in slide-in-from-right-4 duration-300'>
			<Label className='text-neutral-400 font-bold uppercase text-[10px] tracking-widest'>Select Product</Label>

			<div className='relative group'>
				<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors' />
				<Input
					placeholder='Search products by name...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='pl-10 bg-neutral-800 border-neutral-700 h-11 focus:ring-1 focus:ring-blue-500/50'
				/>
			</div>

			<div className='space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'>
				{isLoading ? (
					<div className='flex justify-center p-8'>
						<Loader2 className='h-6 w-6 animate-spin text-blue-500' />
					</div>
				) : products.length > 0 ? (
					<>
						{products.map((p: Product) => (
							<button
								key={p.id}
								onClick={() => onSelect(p)}
								className={cn(
									'w-full text-left p-2 rounded-xl border transition-all flex items-center gap-3 group',
									selectedProduct?.id === p.id
										? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/20'
										: 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700'
								)}
							>
								<div className='h-12 w-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700 group-hover:border-neutral-600 transition-colors'>
									{p.images?.[0] ? (
										<img src={getCloudFileURL(p.images[0].thumbnail)} className='w-full h-full object-cover' alt={p.title} />
									) : (
										<div className='w-full h-full flex items-center justify-center'>
											<ShoppingBag className='h-5 w-5 text-neutral-600' />
										</div>
									)}
								</div>
								<div className='overflow-hidden flex-1'>
									<p className='font-bold text-sm text-white truncate'>{p.title}</p>
									<p className='text-[10px] text-neutral-500 font-mono uppercase tracking-tighter'>{p.key}</p>
								</div>
								{selectedProduct?.id === p.id && <Check className='h-4 w-4 text-blue-400 mr-2 shrink-0' />}
							</button>
						))}
						{hasNextPage && (
							<Button
								variant='ghost'
								size='sm'
								className='w-full text-[10px] text-neutral-500 hover:text-white uppercase font-bold mt-2'
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
							>
								{isFetchingNextPage ? <Loader2 className='h-3 w-3 animate-spin mr-2' /> : 'Load More Products'}
							</Button>
						)}
					</>
				) : (
					debouncedSearch.length > 2 && (
						<div className='text-center py-8'>
							<p className='text-sm text-neutral-500'>No products found matching "{debouncedSearch}"</p>
						</div>
					)
				)}
			</div>
		</div>
	);
};
