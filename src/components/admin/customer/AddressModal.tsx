import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useAddAddressMutation, useUpdateAddressMutation } from '@/hooks/useCustomers';

interface AddressModalProps {
	customerId: string;
	address: any;
	onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ customerId, address, onClose }) => {
	const isEdit = !!address;
	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: address || { isDefault: false },
	});

	const addMutation = useAddAddressMutation(customerId);
	const updateMutation = useUpdateAddressMutation(customerId);

	const isPending = addMutation.isPending || updateMutation.isPending;

	const onSubmit = (data: any) => {
		if (isEdit) {
			updateMutation.mutate({ addressId: address.key, data }, { onSuccess: onClose });
		} else {
			addMutation.mutate(data, { onSuccess: onClose });
		}
	};

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='bg-neutral-900 border-neutral-800 text-white'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Name</label>
							<Input {...register('name', { required: true })} className='bg-neutral-800 border-neutral-700' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Phone</label>
							<Input {...register('phone', { required: true })} className='bg-neutral-800 border-neutral-700' />
						</div>
					</div>

					<div className='space-y-2'>
						<label className='text-sm text-neutral-400'>Address Line 1</label>
						<Input {...register('addressLine1', { required: true })} className='bg-neutral-800 border-neutral-700' />
					</div>

					<div className='space-y-2'>
						<label className='text-sm text-neutral-400'>Address Line 2 (Optional)</label>
						<Input {...register('addressLine2')} className='bg-neutral-800 border-neutral-700' />
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>City</label>
							<Input {...register('city', { required: true })} className='bg-neutral-800 border-neutral-700' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>State</label>
							<Input {...register('state', { required: true })} className='bg-neutral-800 border-neutral-700' />
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Country</label>
							<Input {...register('country', { required: true })} className='bg-neutral-800 border-neutral-700' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Zip Code</label>
							<Input {...register('zipCode', { required: true })} className='bg-neutral-800 border-neutral-700' />
						</div>
					</div>

					<div className='flex items-center gap-2 mt-4'>
						<input type='checkbox' {...register('isDefault')} id='isDefault' className='rounded bg-neutral-800 border-neutral-700 text-blue-500' />
						<label htmlFor='isDefault' className='text-sm text-neutral-400'>Set as default address</label>
					</div>

					<div className='flex justify-end gap-2 pt-4'>
						<Button type='button' variant='ghost' onClick={onClose} className='text-neutral-400 hover:text-white'>Cancel</Button>
						<Button type='submit' disabled={isPending} className='bg-blue-600 hover:bg-blue-500 text-white'>
							{isPending ? 'Saving...' : 'Save Address'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
