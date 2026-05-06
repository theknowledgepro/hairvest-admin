import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History, Truck, MapPin, AlertCircle, Calendar } from 'lucide-react';
import { cn, getCloudFileURL, getFullName } from '@/lib/utils';
import { formatDate } from '@/lib/formatDate';
import { type OrderTracking } from '@/api/orders';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OrderTrackingTimelineProps {
	trackingHistory?: OrderTracking[];
}

export const OrderTrackingTimeline: React.FC<OrderTrackingTimelineProps> = ({ trackingHistory }) => {
	return (
		<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden gap-0 pb-0'>
			<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
				<CardTitle className='text-lg font-semibold flex items-center gap-2'>
					<History className='h-5 w-5 text-emerald-400' /> Tracking History
				</CardTitle>
			</CardHeader>
			<CardContent className='p-6'>
				{trackingHistory && trackingHistory.length > 0 ?
					<div className='space-y-6'>
						{trackingHistory.map((tracking, idx) => (
							<div key={tracking.key || `tracking-${idx}`} className='flex gap-4 relative'>
								{idx !== trackingHistory.length - 1 && (
									<div className='absolute left-[11px] top-6 bottom-[-24px] w-0.5 bg-neutral-800'></div>
								)}
								<div
									className={cn(
										'h-6 w-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center bg-neutral-950 z-10',
										idx === 0 ? 'border-emerald-500' : 'border-neutral-800',
									)}>
									{idx === 0 ?
										<Truck className='h-3 w-3 text-emerald-500' />
									:	<div className='h-1.5 w-1.5 rounded-full bg-neutral-700'></div>}
								</div>
								<div className='flex-1 space-y-1 border-b border-neutral-800 pb-4'>
									<div className='flex items-center justify-between'>
										<h5 className={cn('font-bold text-sm uppercase tracking-wider', idx === 0 ? 'text-white' : 'text-neutral-400')}>
											{tracking.status}
										</h5>
									</div>
									{tracking.location && (
										<div className='flex items-center gap-2 text-xs text-neutral-500'>
											<MapPin className='h-4 w-4 shrink-0' /> {tracking.location}
										</div>
									)}
									{tracking.remarks && (
										<div className='text-neutral-400 mt-2 p-3 border-[2px] border-dashed border-neutral-800 rounded-md space-y-1 bg-neutral-950/50'>
											<div className='text-[10px] font-bold uppercase text-neutral-500'>Remarks:</div>
											<div className='text-[13px] leading-relaxed'> {tracking.remarks}</div>
										</div>
									)}

									<div className='flex items-center justify-between'>
										{tracking.estimatedArrival && (
											<div className='flex items-center gap-1.5 text-blue-500 mt-2'>
												<Calendar className='h-3 w-3' />
												<span className='text-[10px] font-bold uppercase tracking-tighter'>
													Est. Arrival: {formatDate(tracking.estimatedArrival)}
												</span>
											</div>
										)}
										{tracking.isDelayed && (
											<div className='flex items-center gap-1.5 text-amber-500 mt-2'>
												<AlertCircle className='h-3 w-3' />
												<span className='text-[10px] font-bold uppercase tracking-tighter'>Delayed</span>
											</div>
										)}
									</div>

									<div className='mt-2 flex items-center justify-between'>
										<div className='flex items-center gap-2'>
											<Avatar className='h-6 w-6 ring-1 ring-neutral-700'>
												{tracking.updatedBy?.avatar?.thumbnail && (
													<AvatarImage src={getCloudFileURL(tracking.updatedBy.avatar.thumbnail)} />
												)}
												<AvatarFallback className='bg-neutral-800 text-[8px] font-bold text-neutral-400'>
													{tracking.updatedBy?.firstName?.[0]}
													{tracking.updatedBy?.lastName?.[0]}
												</AvatarFallback>
											</Avatar>
											<div className='flex flex-col'>
												<span className='text-[10px] text-neutral-500 font-medium'>Updated By</span>
												<span className='text-[11px] text-neutral-300 font-bold'>{getFullName(tracking.updatedBy)}</span>
											</div>
										</div>
									</div>
									<div className='text-[10px] text-neutral-500 font-medium'>Updated At: {formatDate(tracking.createdAt)}</div>
								</div>
							</div>
						))}
					</div>
				:	<div className='flex flex-col items-center justify-center py-6 text-neutral-600 italic text-sm'>
						<History className='h-8 w-8 mb-2 opacity-20' />
						No tracking history recorded.
					</div>
				}
			</CardContent>
		</Card>
	);
};
