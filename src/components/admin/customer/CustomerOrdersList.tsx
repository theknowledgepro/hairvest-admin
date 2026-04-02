import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { History } from 'lucide-react';

export const CustomerOrdersList = ({ customerId }: { customerId: string }) => {
	return (
		<Card className='bg-neutral-900/50 border-neutral-800'>
			<CardHeader className='border-b border-neutral-800 pb-4'>
				<CardTitle className='text-lg font-semibold text-white flex items-center gap-2'>
					<History className='h-5 w-5 text-blue-400' /> Order History
				</CardTitle>
			</CardHeader>
			<CardContent className='p-12 flex flex-col items-center justify-center text-neutral-500'>
				<History className='h-10 w-10 text-neutral-700 mb-4' />
				<p className='font-medium text-neutral-300'>Orders tracking coming soon</p>
				<p className='text-sm mt-1 text-center max-w-sm'>
					When the order management APIs are connected, this section will display purchases made by this customer.
				</p>
			</CardContent>
		</Card>
	);
};
