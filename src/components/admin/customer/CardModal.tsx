import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useAddCardMutation, useUpdateCardMutation } from '@/hooks/useCustomers';

interface CardModalProps {
	customerId: string;
	card: any;
	onClose: () => void;
}

export const CardModal: React.FC<CardModalProps> = ({ customerId, card, onClose }) => {
	const isEdit = !!card;
	const { register, handleSubmit } = useForm({
		defaultValues: card || { isDefault: false },
	});

	const addMutation = useAddCardMutation(customerId);
	const updateMutation = useUpdateCardMutation(customerId);

	const isPending = addMutation.isPending || updateMutation.isPending;

	const onSubmit = (data: any) => {
		if (isEdit) {
			updateMutation.mutate({ cardId: card.key, data }, { onSuccess: onClose });
		} else {
			addMutation.mutate(data, { onSuccess: onClose });
		}
	};

	return (
		<Dialog open onOpenChange={(open) => !open && onClose()}>
			<DialogContent className='bg-neutral-900 border-neutral-800 text-white'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Edit Card' : 'Add New Card'}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div className='space-y-2'>
						<label className='text-sm text-neutral-400'>Cardholder Name</label>
						<Input {...register('cardName', { required: true })} className='bg-neutral-800 border-neutral-700' />
					</div>

					{!isEdit && (
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Card Number</label>
							<Input {...register('cardNumber', { required: true })} placeholder='**** **** **** ****' className='bg-neutral-800 border-neutral-700' />
						</div>
					)}

					<div className='grid grid-cols-2 gap-4'>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Expiry Month</label>
							<Input {...register('expiryMonth', { required: true })} placeholder='MM' className='bg-neutral-800 border-neutral-700' />
						</div>
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Expiry Year</label>
							<Input {...register('expiryYear', { required: true })} placeholder='YY' className='bg-neutral-800 border-neutral-700' />
						</div>
					</div>

					{!isEdit && (
						<div className='space-y-2'>
							<label className='text-sm text-neutral-400'>Payment Gateway Token (Simulator)</label>
							<Input {...register('token', { required: true })} placeholder='tok_...' className='bg-neutral-800 border-neutral-700' />
						</div>
					)}

					<div className='flex items-center gap-2 mt-4'>
						<input type='checkbox' {...register('isDefault')} id='isDefaultCard' className='rounded bg-neutral-800 border-neutral-700 text-blue-500' />
						<label htmlFor='isDefaultCard' className='text-sm text-neutral-400'>Set as default card</label>
					</div>

					<div className='flex justify-end gap-2 pt-4'>
						<Button type='button' variant='ghost' onClick={onClose} className='text-neutral-400 hover:text-white'>Cancel</Button>
						<Button type='submit' disabled={isPending} className='bg-blue-600 hover:bg-blue-500 text-white'>
							{isPending ? 'Saving...' : 'Save Card'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
