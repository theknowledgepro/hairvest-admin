import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddAddressMutation, useUpdateAddressMutation } from '@/hooks/useCustomers';
import { customerAddressSchema, type CustomerAddressFormValues } from '@/lib/schemas/customerAddress.schema';
import { Switch } from '@/components/ui/switch';

interface AddressModalProps {
	customerId: string;
	address: any;
	onClose: () => void;
}

export const AddressModal: React.FC<AddressModalProps> = ({ customerId, address, onClose }) => {
	const isEdit = !!address;
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CustomerAddressFormValues>({
		resolver: zodResolver(customerAddressSchema) as any,
		defaultValues: {
			firstName: address?.firstName || '',
			lastName: address?.lastName || '',
			phone: address?.phone?.international || address?.phone || '',
			addressLine1: address?.addressLine1 || '',
			addressLine2: address?.addressLine2 || '',
			apartment: address?.apartment || '',
			city: address?.city || '',
			state: address?.state?.label || address?.state || '',
			country: address?.country?.label || address?.country || '',
			isDefault: address?.isDefault || false,
			zipCode: address?.zipCode || '',
		},
	});

	const addMutation = useAddAddressMutation(customerId);
	const updateMutation = useUpdateAddressMutation(customerId);

	const isPending = addMutation.isPending || updateMutation.isPending;

	const onSubmit = (values: CustomerAddressFormValues) => {
		const data = {
			...values,
			state: { label: values.state, value: values.state },
			country: { label: values.country, value: values.country },
		};

		if (isEdit) {
			updateMutation.mutate({ addressId: address.key, data }, { onSuccess: onClose });
		} else {
			addMutation.mutate(data, { onSuccess: onClose });
		}
	};

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='bg-neutral-900 border-neutral-800 text-white max-w-md'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Edit Address' : 'Add New Address'}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 pt-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>First Name</label>
							<Input {...register('firstName')} className='bg-neutral-800 border-neutral-700' />
							{errors.firstName && <p className='text-xs text-red-400'>{errors.firstName.message}</p>}
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Last Name</label>
							<Input {...register('lastName')} className='bg-neutral-800 border-neutral-700' />
							{errors.lastName && <p className='text-xs text-red-400'>{errors.lastName.message}</p>}
						</div>
					</div>

					<div className='space-y-2'>
						<label className='text-sm text-neutral-400'>Phone Number</label>
						<Input {...register('phone')} className='bg-neutral-800 border-neutral-700' />
						{errors.phone && <p className='text-xs text-red-400'>{errors.phone.message}</p>}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Address Line 1</label>
							<Input {...register('addressLine1')} className='bg-neutral-800 border-neutral-700' />
							{errors.addressLine1 && <p className='text-xs text-red-400'>{errors.addressLine1.message}</p>}
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Apartment/Suite</label>
							<Input {...register('apartment')} className='bg-neutral-800 border-neutral-700' />
						</div>
					</div>

					<div className='space-y-2'>
						<label className='text-sm text-neutral-400'>Address Line 2 (Optional)</label>
						<Input {...register('addressLine2')} className='bg-neutral-800 border-neutral-700' />
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>City</label>
							<Input {...register('city')} className='bg-neutral-800 border-neutral-700' />
							{errors.city && <p className='text-xs text-red-400'>{errors.city.message}</p>}
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>State</label>
							<Input {...register('state')} className='bg-neutral-800 border-neutral-700' />
							{errors.state && <p className='text-xs text-red-400'>{errors.state.message}</p>}
						</div>
					</div>

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Country</label>
							<Input {...register('country')} className='bg-neutral-800 border-neutral-700' />
							{errors.country && <p className='text-xs text-red-400'>{errors.country.message}</p>}
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Zip Code</label>
							<Input {...register('zipCode')} className='bg-neutral-800 border-neutral-700' />
							{errors.zipCode && <p className='text-xs text-red-400'>{errors.zipCode.message}</p>}
						</div>
					</div>

					<div className='flex items-center gap-2 mt-2'>
						<Controller
							name='isDefault'
							control={control}
							render={({ field }) => (
								<Switch
									className='data-[state=checked]:bg-emerald-500!'
									disabled={isPending}
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							)}
						/>
						<label htmlFor='isDefault' className='text-sm text-neutral-400'>
							Set as default address
						</label>
					</div>

					<div className='flex justify-end gap-2 pt-4'>
						<Button type='button' variant='ghost' onClick={onClose} className='text-neutral-400 hover:text-white'>
							Cancel
						</Button>
						<Button type='submit' disabled={isPending} className='bg-blue-600 hover:bg-blue-500 text-white px-8'>
							{isPending ? 'Saving...' : 'Save Address'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
