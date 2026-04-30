import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCustomersQuery, useToggleCustomerSuspensionMutation } from '../../hooks/useCustomers';
import { TablePagination } from '../../components/TablePagination';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Users, Loader2, MoreHorizontal, UserSearch, ShieldAlert, ShieldCheck, Search } from 'lucide-react';
import { getCloudFileURL } from '../../lib/utils';
import { APP_ROUTES } from '../../config/routes.app';
import { formatDate } from '@/lib/formatDate';
import { useDebounce } from 'use-debounce';
import { Input } from '@/components/ui/input';

export const Customers: React.FC = () => {
	const navigate = useNavigate();

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [searchInput, setSearchInput] = useState('');
	const [debouncedSearch] = useDebounce(searchInput, 500);

	const { data: customersResponse, isLoading } = useCustomersQuery({ page, limit, search: debouncedSearch });
	const customers = customersResponse?.data?.results ?? [];
	const totalPages = customersResponse?.data?.totalPages ?? 1;
	const totalResults = customersResponse?.data?.totalCount ?? 0;

	const { mutate: toggleSuspension, isPending: isToggling } = useToggleCustomerSuspensionMutation();

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<Users className='h-8 w-8 text-blue-400' /> My Customers
					</h2>
					<p className='text-neutral-400 mt-1'>View and manage all registered customers on your platform.</p>
				</div>
			</div>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0 gap-0'>
				<div className='p-4 border-b border-neutral-800 flex items-center justify-between'>
					<div className='relative w-full max-w-lg'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500' />
						<Input
							type='text'
							placeholder='Search users by name, email, or phone...'
							className='pl-9 bg-neutral-900 border-neutral-700 text-white w-full'
							value={searchInput}
							onChange={(e) => {
								setSearchInput(e.target.value);
								setPage(1); // Reset to first page on new search
							}}
						/>
					</div>
				</div>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400'>S/N</TableHead>
								<TableHead className='text-neutral-400'>Customer</TableHead>
								<TableHead className='text-neutral-400'>Contact</TableHead>
								<TableHead className='text-neutral-400'>Gender</TableHead>
								<TableHead className='text-neutral-400'>Sign Up Method</TableHead>
								<TableHead className='text-neutral-400'>Status</TableHead>
								<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
								<TableHead className='text-neutral-400'>Joined</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ?
								<TableRow>
									<TableCell colSpan={7} className='text-center py-10 text-neutral-500'>
										<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-blue-400' />
										Loading customers...
									</TableCell>
								</TableRow>
							: customers.length === 0 ?
								<TableRow>
									<TableCell colSpan={7} className='text-center py-10 text-neutral-500'>
										No customers found. Share your store mobile app link to start getting sign-ups!
									</TableCell>
								</TableRow>
							:	customers.map((customer, index) => (
									<TableRow
										key={customer.key}
										onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${customer.key}`)}
										className='border-neutral-800 hover:bg-neutral-800/30 transition-colors cursor-pointer'>
										<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
										<TableCell className='font-medium text-white'>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 ring-1 ring-neutral-700'>
													{customer.avatar?.thumbnail ?
														<img src={getCloudFileURL(customer.avatar.thumbnail)} alt='Avatar' className='object-cover' />
													:	<AvatarFallback className='bg-neutral-800 text-blue-400 text-xs uppercase'>
															{customer.firstName?.[0] || 'U'}
															{customer.lastName?.[0] || 'U'}
														</AvatarFallback>
													}
												</Avatar>
												<div>
													<p className='text-sm font-medium'>
														{customer.firstName || 'Unknown'} {customer.lastName || 'User'}
													</p>
													<p className='text-[12px] text-neutral-500 font-normal'>ID: {customer.key.slice(0, 8)}...</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className='flex flex-col'>
												<span className='text-sm text-neutral-300'>{customer.email}</span>
												<span className='text-xs text-neutral-500'>{customer.phone?.international || 'No Phone'}</span>
											</div>
										</TableCell>
										<TableCell>
											<span className='text-neutral-400 text-sm capitalize'>{customer.gender || '—'}</span>
										</TableCell>
										<TableCell>
											<span className='px-2 py-0.5 text-[11px] rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-medium uppercase'>
												{customer.signUpMethod || 'Email'}
											</span>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-3 w-max'>
												<Switch
													className='data-[state=checked]:bg-emerald-500! data-[state=unchecked]:bg-red-500!'
													disabled={isToggling}
													checked={!customer.suspended} // active is checked, suspended is unchecked
													onCheckedChange={() => toggleSuspension(customer.key)}
													onClick={(e) => e.stopPropagation()}
												/>
												<span
													className={`text-xs font-medium transition-colors ${
														!customer.suspended ? 'text-emerald-400' : 'text-red-400'
													}`}>
													{!customer.suspended ? 'Active' : 'Suspended'}
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
															navigate(`${APP_ROUTES.CUSTOMERS}/${customer.key}`);
														}}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<UserSearch className='mr-2 h-4 w-4 text-blue-400' /> View Details
													</DropdownMenuItem>
													<DropdownMenuSeparator className='bg-neutral-800' />
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															if (
																confirm(
																	`Are you sure you want to ${customer.suspended ? 'restore' : 'suspend'} this customer?`,
																)
															) {
																toggleSuspension(customer.key);
															}
														}}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														{!customer.suspended ?
															<>
																<ShieldAlert className='mr-2 h-4 w-4 text-red-400' />
																<span className='text-red-400'>Suspend Access</span>
															</>
														:	<>
																<ShieldCheck className='mr-2 h-4 w-4 text-emerald-400' />
																<span className='text-emerald-400'>Restore Access</span>
															</>
														}
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
										<TableCell>
											<div className='flex flex-col gap-0.5'>
												{customer.createdAt && (
													<span className='text-[14px] text-neutral-200'>{formatDate(customer.createdAt)}</span>
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
