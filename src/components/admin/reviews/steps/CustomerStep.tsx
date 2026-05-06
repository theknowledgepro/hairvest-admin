import React, { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { useCustomersInfiniteQuery } from '@/hooks/useCustomers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Check, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Customer } from '@/api/customers';

interface CustomerStepProps {
	selectedCustomer: Customer | null;
	onSelect: (customer: Customer | null) => void;
	isNewCustomer: boolean;
	setIsNewCustomer: (val: boolean) => void;
	newCustomer: any;
	setNewCustomer: (val: any) => void;
}

export const CustomerStep: React.FC<CustomerStepProps> = ({
	selectedCustomer,
	onSelect,
	isNewCustomer,
	setIsNewCustomer,
	newCustomer,
	setNewCustomer,
}) => {
	const [search, setSearch] = useState('');
	const [debouncedSearch] = useDebounce(search, 500);

	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useCustomersInfiniteQuery({
		search: debouncedSearch,
		limit: 5,
	});

	const customers = data?.pages.flatMap((page) => page.data?.results || []) || [];

	return (
		<div className='space-y-4 animate-in fade-in slide-in-from-right-4 duration-300'>
			<div className='flex items-center justify-between'>
				<Label className='text-neutral-400 font-bold uppercase text-[10px] tracking-widest'>Customer Details</Label>
				<Button
					variant='ghost'
					size='sm'
					className='text-[10px] h-7 text-blue-400 font-bold uppercase'
					onClick={() => setIsNewCustomer(!isNewCustomer)}
				>
					{isNewCustomer ? 'Search Existing' : 'Add New Customer'}
				</Button>
			</div>

			{isNewCustomer ? (
				<div className='grid grid-cols-2 gap-3 p-4 rounded-xl bg-neutral-800/20 border border-neutral-800'>
					<div className='space-y-1.5'>
						<Label className='text-[10px] text-neutral-500 font-bold uppercase'>First Name</Label>
						<Input
							value={newCustomer.firstName}
							onChange={(e) => setNewCustomer({ ...newCustomer, firstName: e.target.value })}
							className='bg-neutral-900 border-neutral-800 h-9 text-sm'
							placeholder='e.g. John'
						/>
					</div>
					<div className='space-y-1.5'>
						<Label className='text-[10px] text-neutral-500 font-bold uppercase'>Last Name</Label>
						<Input
							value={newCustomer.lastName}
							onChange={(e) => setNewCustomer({ ...newCustomer, lastName: e.target.value })}
							className='bg-neutral-900 border-neutral-800 h-9 text-sm'
							placeholder='e.g. Doe'
						/>
					</div>
					<div className='col-span-2 space-y-1.5'>
						<Label className='text-[10px] text-neutral-500 font-bold uppercase'>Email Address</Label>
						<Input
							type='email'
							value={newCustomer.email}
							onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
							className='bg-neutral-900 border-neutral-800 h-9 text-sm'
							placeholder='john@example.com'
						/>
					</div>
					<div className='col-span-2 space-y-1.5'>
						<Label className='text-[10px] text-neutral-500 font-bold uppercase'>Phone (Optional)</Label>
						<Input
							value={newCustomer.phone}
							onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
							className='bg-neutral-900 border-neutral-800 h-9 text-sm'
							placeholder='+234...'
						/>
					</div>
				</div>
			) : (
				<div className='space-y-3'>
					<div className='relative group'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors' />
						<Input
							placeholder='Search by name or email...'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='pl-10 bg-neutral-800 border-neutral-700 h-11 focus:ring-1 focus:ring-blue-500/50'
						/>
					</div>

					<div className='space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar'>
						{isLoading ? (
							<div className='flex justify-center p-8'>
								<Loader2 className='h-6 w-6 animate-spin text-blue-500' />
							</div>
						) : customers.length > 0 ? (
							<>
								{customers.map((c: Customer) => (
									<button
										key={c.id}
										onClick={() => onSelect(c)}
										className={cn(
											'w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group',
											selectedCustomer?.id === c.id
												? 'bg-blue-500/10 border-blue-500/50 ring-1 ring-blue-500/20'
												: 'bg-neutral-800/40 border-neutral-800 hover:border-neutral-700'
										)}
									>
										<div>
											<p className='font-bold text-sm text-white'>
												{c.firstName} {c.lastName}
											</p>
											<p className='text-xs text-neutral-500 font-medium'>{c.email}</p>
										</div>
										{selectedCustomer?.id === c.id ? (
											<Check className='h-4 w-4 text-blue-400' />
										) : (
											<Plus className='h-4 w-4 text-neutral-600 group-hover:text-neutral-400' />
										)}
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
										{isFetchingNextPage ? <Loader2 className='h-3 w-3 animate-spin mr-2' /> : 'Load More Customers'}
									</Button>
								)}
							</>
						) : (
							debouncedSearch.length > 2 && (
								<div className='text-center py-8'>
									<p className='text-sm text-neutral-500'>No customers found matching "{debouncedSearch}"</p>
								</div>
							)
						)}
					</div>
				</div>
			)}
		</div>
	);
};
