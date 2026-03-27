import React, { useState } from 'react';
import { MapPin, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomerAddressesQuery, useDeleteAddressMutation } from '@/hooks/useCustomers';
import { AddressModal } from './AddressModal';

interface CustomerAddressListProps {
	customerId: string;
}

export const CustomerAddressList: React.FC<CustomerAddressListProps> = ({ customerId }) => {
	const { data: response, isLoading } = useCustomerAddressesQuery(customerId);
	const addresses = response?.data?.results || [];
	const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddressMutation(customerId);

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingAddress, setEditingAddress] = useState<any>(null);

	return (
		<Card className='bg-neutral-900/50 border-neutral-800'>
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
			<CardContent className='p-0'>
				{isLoading ? (
					<div className='p-12 flex flex-col items-center justify-center text-neutral-500'>
						<Loader2 className='h-8 w-8 animate-spin text-blue-500' />
					</div>
				) : addresses.length === 0 ? (
					<div className='p-10 flex flex-col items-center justify-center text-neutral-500'>
						<MapPin className='h-10 w-10 text-neutral-700 mb-4' />
						<p className='font-medium text-neutral-300'>No addresses found</p>
					</div>
				) : (
					<div className='divide-y divide-neutral-800'>
						{addresses.map((address: any) => (
							<div key={address.key} className='p-4 hover:bg-neutral-800/30 transition-colors flex justify-between items-start'>
								<div className='space-y-1'>
									<div className='flex items-center gap-2'>
										<p className='font-medium text-white'>{address.name}</p>
										{address.isDefault && (
											<span className='px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-500/10 text-blue-400'>
												Default
											</span>
										)}
									</div>
									<p className='text-sm text-neutral-400'>{address.addressLine1}</p>
									{address.addressLine2 && <p className='text-sm text-neutral-400'>{address.addressLine2}</p>}
									<p className='text-sm text-neutral-400'>
										{address.city}, {address.state} {address.zipCode}
									</p>
									<p className='text-sm text-neutral-400'>{address.country}</p>
									<p className='text-xs text-neutral-500 pt-1'>Phone: {address.phone}</p>
								</div>
								<div className='flex gap-2 relative z-10'>
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
										className='h-8 w-8 text-neutral-400 hover:text-red-400 hover:bg-red-500/10'
										onClick={() => confirm('Delete address?') && deleteAddress(address.key)}>
										<Trash2 className='h-4 w-4' />
									</Button>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>

			{isModalOpen && (
				<AddressModal
					customerId={customerId}
					address={editingAddress}
					onClose={() => setIsModalOpen(false)}
				/>
			)}
		</Card>
	);
};
