import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useForm, Controller } from 'react-hook-form';
import { useUpdateCustomerMutation } from '@/hooks/useCustomers';

interface ProfileEditModalProps {
	customer: any;
	onClose: () => void;
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ customer, onClose }) => {
	const { register, handleSubmit, control } = useForm({
		defaultValues: {
			firstName: customer.firstName,
			lastName: customer.lastName,
			phone: customer.phone?.international || '',
			gender: customer.gender || '',
		},
	});

	const { mutate: updateProfile, isPending } = useUpdateCustomerMutation();

	const onSubmit = (data: any) => {
		updateProfile({ id: customer.key, data }, { onSuccess: onClose });
	};

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='bg-neutral-900 border-neutral-800 text-white'>
				<DialogHeader>
					<DialogTitle>Edit Profile</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>First Name</label>
							<Input {...register('firstName')} className='bg-neutral-800 border-neutral-700' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Last Name</label>
							<Input {...register('lastName')} className='bg-neutral-800 border-neutral-700' />
						</div>
					</div>

					<div className='space-y-2'>
						<label className='text-sm text-neutral-400'>Phone Number</label>
						<Input {...register('phone')} className='bg-neutral-800 border-neutral-700' />
					</div>

					<div className='space-y-2'>
						<label className='text-sm text-neutral-400'>Gender</label>
						<Controller
							name='gender'
							control={control}
							render={({ field }) => (
								<Select onValueChange={field.onChange} defaultValue={field.value}>
									<SelectTrigger className='bg-neutral-800 border-neutral-700'>
										<SelectValue placeholder='Select gender' />
									</SelectTrigger>
									<SelectContent className='bg-neutral-800 border-neutral-700 text-white'>
										<SelectItem value='male'>Male</SelectItem>
										<SelectItem value='female'>Female</SelectItem>
										<SelectItem value='other'>Other</SelectItem>
										<SelectItem value='prefer-not-to-say'>Prefer not to say</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
					</div>

					<div className='flex justify-end gap-2 pt-4'>
						<Button type='button' variant='ghost' onClick={onClose} className='text-neutral-400 hover:text-white'>Cancel</Button>
						<Button type='submit' disabled={isPending} className='bg-blue-600 hover:bg-blue-500 text-white'>
							{isPending ? 'Saving...' : 'Save Changes'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
