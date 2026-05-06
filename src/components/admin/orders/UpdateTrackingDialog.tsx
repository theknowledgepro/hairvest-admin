import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2, Plus, AlertCircle } from 'lucide-react';
import { PRODUCT_ORDER_STATUS } from '@/api/orders';
import { useUpdateOrderTrackingMutation } from '@/hooks/useProductOrders';

const updateOrderTrackingSchema = z.object({
	status: z.string().min(1, 'Tracking status is required'),
	location: z.string().optional(),
	isDelayed: z.boolean().default(false),
	estimatedArrival: z.string().optional(),
	remarks: z.string().optional(),
	orderStatus: z.enum(Object.values(PRODUCT_ORDER_STATUS) as [string, ...string[]]),
});

type TrackingFormValues = z.infer<typeof updateOrderTrackingSchema>;

interface UpdateTrackingDialogProps {
	businessId: string;
	orderId: string;
	currentStatus: PRODUCT_ORDER_STATUS;
}

const STATUS_PROGRESSION: PRODUCT_ORDER_STATUS[] = [
	PRODUCT_ORDER_STATUS.PENDING,
	PRODUCT_ORDER_STATUS.PAID,
	PRODUCT_ORDER_STATUS.PROCESSING,
	PRODUCT_ORDER_STATUS.SHIPPED,
	PRODUCT_ORDER_STATUS.COMPLETED,
];

export const UpdateTrackingDialog: React.FC<UpdateTrackingDialogProps> = ({ businessId, orderId, currentStatus }) => {
	const [open, setOpen] = React.useState(false);
	const { mutate: updateTracking, isPending } = useUpdateOrderTrackingMutation(businessId, orderId);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<TrackingFormValues>({
		resolver: zodResolver(updateOrderTrackingSchema as any),
		defaultValues: {
			status: '',
			location: '',
			isDelayed: false,
			estimatedArrival: '',
			remarks: '',
			orderStatus: currentStatus,
		},
	});

	const orderStatusValue = watch('orderStatus');
	const isDelayedValue = watch('isDelayed');

	const onSubmit = (data: TrackingFormValues) => {
		updateTracking(data as any, {
			onSuccess: () => {
				setOpen(false);
				reset({
					...data,
					status: '',
					location: '',
					isDelayed: false,
					estimatedArrival: '',
					remarks: '',
				});
			},
		});
	};

	const isStatusDisabled = (status: PRODUCT_ORDER_STATUS) => {
		// Disable cancelation of an active order
		if (status === PRODUCT_ORDER_STATUS.CANCELLED) return true;

		// If already cancelled or completed, disable everything (order is finalized)
		if (currentStatus === PRODUCT_ORDER_STATUS.CANCELLED || currentStatus === PRODUCT_ORDER_STATUS.COMPLETED) {
			return status !== currentStatus;
		}

		const currentIndex = STATUS_PROGRESSION.indexOf(currentStatus);
		const targetIndex = STATUS_PROGRESSION.indexOf(status);

		// Disable statuses that are behind the current status in the progression
		return targetIndex < currentIndex;
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className='bg-blue-600 hover:bg-blue-700 text-white border-none'>
					<Plus className='h-4 w-4 mr-2' /> Update Status
				</Button>
			</DialogTrigger>
			<DialogContent className='bg-neutral-900 border-neutral-800 text-white sm:max-w-[500px]'>
				<form onSubmit={handleSubmit(onSubmit)}>
					<DialogHeader>
						<DialogTitle>Update Order Tracking</DialogTitle>
						<DialogDescription className='text-neutral-500 text-xs mt-1'>
							Record a new tracking update for this order. This will be visible to the customer.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-6 py-6'>
						<div className='grid grid-cols-1 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='status' className='text-neutral-400'>
									Tracking Status
								</Label>
								<Input id='status' placeholder='e.g. In Transit' className='bg-neutral-950 border-neutral-800' {...register('status')} />
								{errors.status && <p className='text-[10px] text-red-500'>{errors.status.message}</p>}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='orderStatus' className='text-neutral-400'>
									Order Status
								</Label>
								<Select value={orderStatusValue} onValueChange={(value) => setValue('orderStatus', value as PRODUCT_ORDER_STATUS)}>
									<SelectTrigger className='bg-neutral-950 border-neutral-800'>
										<SelectValue placeholder='Select Status' />
									</SelectTrigger>
									<SelectContent className='bg-neutral-900 border-neutral-800 text-white'>
										{Object.values(PRODUCT_ORDER_STATUS).map((status) => (
											<SelectItem key={status} value={status} disabled={isStatusDisabled(status)}>
												{status}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.orderStatus && <p className='text-[10px] text-red-500'>{errors.orderStatus.message}</p>}
							</div>
						</div>

						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='location' className='text-neutral-400'>
									Current Location (Optional)
								</Label>
								<Input
									id='location'
									placeholder='e.g. Lagos Sorting Hub'
									className='bg-neutral-950 border-neutral-800'
									{...register('location')}
								/>
								{errors.location && <p className='text-[10px] text-red-500'>{errors.location.message}</p>}
							</div>
							<div className='space-y-2'>
								<Label htmlFor='estimatedArrival' className='text-neutral-400'>
									Est. Arrival (Optional)
								</Label>
								<Input id='estimatedArrival' type='date' className='bg-neutral-950 border-neutral-800' {...register('estimatedArrival')} />
								{errors.estimatedArrival && <p className='text-[10px] text-red-500'>{errors.estimatedArrival.message}</p>}
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='remarks' className='text-neutral-400'>
								Remarks / Note
							</Label>
							<Textarea
								id='remarks'
								placeholder='Add any additional details about this update...'
								className='bg-neutral-950 border-neutral-800 resize-none'
								{...register('remarks')}
							/>
							{errors.remarks && <p className='text-[10px] text-red-500'>{errors.remarks.message}</p>}
						</div>

						<div className='flex items-center justify-between p-3 rounded-lg bg-neutral-950 border border-neutral-800'>
							<div className='flex items-center gap-3'>
								<AlertCircle className='h-5 w-5 text-amber-500' />
								<div>
									<p className='text-sm font-medium'>Mark as Delayed</p>
									<p className='text-[12px] text-neutral-500'>Flag this shipment/update as having a delay</p>
								</div>
							</div>
							<Switch checked={isDelayedValue} onCheckedChange={(checked) => setValue('isDelayed', checked)} />
						</div>
					</div>
					<DialogFooter className='border-t border-neutral-800 pt-6'>
						<Button type='button' variant='ghost' onClick={() => setOpen(false)} className='text-neutral-400 hover:text-white'>
							Cancel
						</Button>
						<Button type='submit' disabled={isPending} className='bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]'>
							{isPending ?
								<>
									<Loader2 className='h-4 w-4 mr-2 animate-spin' /> Recording...
								</>
							:	'Save Update'}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};
