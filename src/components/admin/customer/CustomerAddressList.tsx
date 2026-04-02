import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Loader2, Phone, User, Globe, Building2, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomerAddressesQuery, useDeleteAddressMutation } from '@/hooks/useCustomers';
import { AddressModal } from './AddressModal';

interface CustomerAddressListProps {
	customerId: string;
}

export const CustomerAddressList: React.FC<CustomerAddressListProps> = ({ customerId }) => {
	const { data: response, isLoading } = useCustomerAddressesQuery(customerId);
	const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddressMutation(customerId);
	const addresses = response?.data?.results || [];

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<any>(null);

	return (
		<Card className='bg-neutral-900/50 border-neutral-800 gap-0'>
			<CardHeader className='border-b border-neutral-800 pb-4 flex flex-row items-center justify-between'>
				<CardTitle className='text-lg font-semibold text-white flex items-center gap-2 m-0'>
					<MapPin className='h-5 w-5 text-blue-400' /> Addresses ({addresses.length})
				</CardTitle>
				<Button
					size='sm'
					className='bg-blue-600 hover:bg-blue-500 text-white'
					onClick={() => {
						setEditingAddress(null);
						setIsModalOpen(true);
					}}>
					<Plus className='h-4 w-4 mr-2' /> Add
				</Button>
			</CardHeader>
			<CardContent className='p-6'>
				{isLoading ?
					<div className='p-12 flex flex-col items-center justify-center text-neutral-500'>
						<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
					</div>
				: addresses.length === 0 ?
					<div className='p-10 flex flex-col items-center justify-center text-neutral-500'>
						<MapPin className='h-10 w-10 text-neutral-700 mb-4' />
						<p className='font-medium text-neutral-300'>No addresses found</p>
					</div>
				:	<div className='grid grid-cols-1 gap-4'>
						{addresses.map((address: any) => (
							<div
								key={address.key}
								className='p-4 rounded-lg bg-neutral-800/20 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col gap-4'>
								{/* Header: Name, Phone & Actions */}
								<div className='flex justify-between items-start'>
									<div className='flex items-center gap-3'>
										<div className='h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20'>
											<User className='h-5 w-5 text-blue-400' />
										</div>
										<div>
											<div className='flex items-center gap-2'>
												<span className='font-semibold text-white'>
													{address.firstName} {address.lastName}
												</span>
												{address.isDefault && (
													<span className='px-2 py-0.5 rounded text-[9px] uppercase font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20'>
														Default
													</span>
												)}
											</div>
											<div className='flex items-center gap-1.5 text-neutral-500 mt-0.5'>
												<Phone className='h-3 w-3' />
												<span className='text-xs font-mono tracking-tight'>{address.phone?.international || address.phone}</span>
											</div>
										</div>
									</div>

									<div className='flex gap-1'>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 text-neutral-400 hover:text-white'
											onClick={() => {
												setEditingAddress(address);
												setIsModalOpen(true);
											}}>
											<Edit className='h-4 w-4' />
										</Button>
										<Button
											variant='ghost'
											size='icon'
											disabled={isDeleting}
											className='h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors'
											onClick={() => confirm('Delete address?') && deleteAddress(address.key)}>
											<Trash2 className='h-4 w-4' />
										</Button>
									</div>
								</div>

								{/* Address Detail Grid */}
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-6 pl-13 pt-2 border-t border-neutral-800/30'>
									<div className='space-y-1.5'>
										<div className='flex items-center gap-2 text-neutral-500'>
											<MapPin className='h-3.5 w-3.5' />
											<span className='text-[10px] uppercase font-bold tracking-wider'>Street Address</span>
										</div>
										<p className='text-sm text-neutral-300 leading-snug'>
											{address.addressLine1}
											{address.addressLine2 && <span className='block text-neutral-500 text-xs'>{address.addressLine2}</span>}
										</p>
									</div>

									{address.apartment && (
										<div className='space-y-1.5'>
											<div className='flex items-center gap-2 text-neutral-500'>
												<Building2 className='h-3.5 w-3.5' />
												<span className='text-[10px] uppercase font-bold tracking-wider'>Apt / Suite</span>
											</div>
											<p className='text-sm text-neutral-300'>{address.apartment}</p>
										</div>
									)}

									<div className='space-y-1.5'>
										<div className='flex items-center gap-2 text-neutral-500'>
											<Globe className='h-3.5 w-3.5' />
											<span className='text-[10px] uppercase font-bold tracking-wider'>Location</span>
										</div>
										<p className='text-sm text-neutral-300'>
											{address.city}, {address.state?.label || address.state}
										</p>
									</div>

									<div className='space-y-1.5'>
										<div className='flex items-center gap-2 text-neutral-500'>
											<Hash className='h-3.5 w-3.5' />
											<span className='text-[10px] uppercase font-bold tracking-wider'>Zip / Country</span>
										</div>
										<div className='text-sm text-neutral-300'>
											<span className='font-mono'>{address.zipCode}</span>
											<span className='mx-1.5 text-neutral-600'>•</span>
											<span>{address.country?.label || address.country}</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				}
			</CardContent>

			{isModalOpen && <AddressModal customerId={customerId} address={editingAddress} onClose={() => setIsModalOpen(false)} />}
		</Card>
	);
};
