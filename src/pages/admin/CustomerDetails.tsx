import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomerDetailsQuery, useToggleCustomerSuspensionMutation } from '../../hooks/useCustomers';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Switch } from '../../components/ui/switch';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import {
	Loader2,
	ArrowLeft,
	ShieldAlert,
	MapPin,
	Mail,
	Phone,
	Calendar,
	UserSearch,
	User2Icon,
	Ruler,
	Scissors,
	BrainCircuit,
	Contact2,
} from 'lucide-react';
import { getCloudFileURL, getFullName } from '../../lib/utils';
import { APP_ROUTES } from '../../config/routes.app';
import { formatDate } from '@/lib/formatDate';
import { CustomerCart } from '../../components/admin/customer/CustomerCart';
import { CustomerWishlist } from '@/components/admin/customer/CustomerWishlist';
import { CustomerAddressList } from '../../components/admin/customer/CustomerAddressList';
import { CustomerCardList } from '../../components/admin/customer/CustomerCardList';
import { CustomerOrdersList } from '@/components/admin/customer/CustomerOrdersList';

export const CustomerDetails: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const { data: customerResponse, isLoading } = useCustomerDetailsQuery(id);
	const customer = customerResponse?.data?.customer;

	const { mutate: toggleSuspension, isPending: isToggling } = useToggleCustomerSuspensionMutation();

	if (isLoading) {
		return (
			<div className='h-[60vh] flex flex-col items-center justify-center text-neutral-500'>
				<Loader2 className='h-8 w-8 animate-spin mb-4 text-blue-400' />
				<p>Loading customer profile...</p>
			</div>
		);
	}

	if (!customer) {
		return (
			<div className='h-[60vh] flex flex-col items-center justify-center text-neutral-500'>
				<UserSearch className='h-12 w-12 mb-4 text-neutral-600' />
				<p className='text-lg font-medium text-white'>Customer Not Found</p>
				<p className='text-sm'>The customer you are looking for does not exist.</p>
				<Button variant='outline' onClick={() => navigate(APP_ROUTES.CUSTOMERS)} className='mt-6 border-neutral-700 text-white'>
					Back to Customers
				</Button>
			</div>
		);
	}

	return (
		<div className='max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div className='flex items-center gap-4'>
					<Button variant='ghost' size='icon' onClick={() => navigate(-1)} className='text-neutral-400 hover:text-white'>
						<ArrowLeft className='h-5 w-5' />
					</Button>
					<div>
						<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-3'>
							Customer Profile
							{customer.suspended && (
								<span className='flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20'>
									<ShieldAlert className='h-3.5 w-3.5' />
									Suspended
								</span>
							)}
						</h2>
						<p className='text-neutral-400 mt-1'>View details, order history, and account status.</p>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Left Sidebar - Personal Info */}
				<div className='space-y-8'>
					<Card className='bg-neutral-900/50 border-neutral-800 overflow-hidden p-0'>
						<div className='h-24 bg-gradient-to-r from-blue-900/40 to-blue-600/20'></div>
						<CardContent className='px-6 pb-6 pt-0 relative'>
							<div className='flex flex-col items-center -mt-12 mb-4'>
								<Avatar className='h-24 w-24 ring-4 ring-neutral-900 bg-neutral-800'>
									{customer.avatar?.thumbnail ?
										<img src={getCloudFileURL(customer.avatar.original)} alt='Avatar' className='object-cover' />
									:	<AvatarFallback className='text-2xl text-blue-400 font-semibold uppercase'>
											{getFullName(customer)?.[0] || 'U'}
										</AvatarFallback>
									}
								</Avatar>
								<h3 className='text-xl font-bold text-white mt-3'>{getFullName(customer)}</h3>
								<p className='text-sm text-neutral-400 font-mono mt-1 mb-3'>ID: {customer.key}</p>
							</div>

							<div className='space-y-4 pt-4 border-t border-neutral-800/60'>
								<div className='flex items-start gap-3 text-sm'>
									<Mail className='h-4 w-4 text-neutral-500 mt-0.5' />
									<div>
										<p className='font-medium text-neutral-300'>{customer.email || 'N/A'}</p>
										<p className='text-xs text-neutral-500'>Email Address</p>
									</div>
								</div>
								<div className='flex items-start gap-3 text-sm'>
									<Phone className='h-4 w-4 text-neutral-500 mt-0.5' />
									<div>
										<p className='font-medium text-neutral-300'>{customer.phone?.international || 'N/A'}</p>
										<p className='text-xs text-neutral-500'>Phone Number</p>
									</div>
								</div>
								{customer.altPhone?.international && (
									<div className='flex items-start gap-3 text-sm'>
										<Contact2 className='h-4 w-4 text-neutral-500 mt-0.5' />
										<div>
											<p className='font-medium text-neutral-300'>{customer.altPhone.international}</p>
											<p className='text-xs text-neutral-500'>Alternate Phone</p>
										</div>
									</div>
								)}
								<div className='flex items-start gap-3 text-sm'>
									<User2Icon className='h-4 w-4 text-neutral-500 mt-0.5' />
									<div>
										<p className='font-medium text-neutral-300 capitalize'>{customer.gender || 'Not specified'}</p>
										<p className='text-xs text-neutral-500'>Gender</p>
									</div>
								</div>
								<div className='flex items-start gap-3 text-sm'>
									<Calendar className='h-4 w-4 text-neutral-500 mt-0.5' />
									<div>
										<p className='font-medium text-neutral-300'>{formatDate(customer.createdAt)}</p>
										<p className='text-xs text-neutral-500'>Joined (via {customer.signUpMethod || 'Email'})</p>
									</div>
								</div>
								<div className='flex items-start gap-3 text-sm'>
									<MapPin className='h-4 w-4 text-neutral-500 mt-0.5' />
									<div>
										<p className='font-medium text-neutral-300 capitalize'>
											{customer.state?.label || 'N/A'}, {customer.country?.label || 'N/A'}
										</p>
										<p className='text-xs text-neutral-500'>Location</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Admin Controls */}
					<Card className='bg-neutral-900/50 border-neutral-800 gap-0'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold text-white'>Admin Controls</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='flex items-center justify-between p-4 rounded-xl bg-neutral-800/50 border border-neutral-700/50'>
								<div className='space-y-1 pr-6'>
									<p className='text-sm font-medium text-white'>Account Access</p>
									<p className='text-[13px] text-neutral-400'>
										{customer.suspended ?
											'This customer is suspended and cannot log in.'
										:	'This customer can freely log in and make purchases.'}
									</p>
								</div>
								<Switch
									className='data-[state=checked]:bg-emerald-500! data-[state=unchecked]:bg-red-500!'
									disabled={isToggling}
									checked={!customer.suspended}
									onCheckedChange={() => toggleSuspension(customer.key)}
								/>
							</div>
						</CardContent>
					</Card>

					{/* Measurements & Preferences */}
					<Card className='bg-neutral-900/50 border-neutral-800'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold text-white flex items-center gap-2'>Fitting & Measurements</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Head Sizes */}
							<div className='space-y-2'>
								<div className='flex items-center gap-2 text-sm text-neutral-400'>
									<Ruler className='h-4 w-4' />
									<p className='font-medium'>Head Sizes</p>
								</div>
								<div className='flex flex-wrap gap-2'>
									{customer.headSizes?.length ?
										customer.headSizes.map((size: string, i: number) => (
											<span
												key={i}
												className='px-2 py-0.5 text-xs font-semibold rounded bg-blue-500/10 text-blue-400 border border-blue-500/20'>
												{size}
											</span>
										))
									:	<p className='text-xs text-neutral-500'>None specified</p>}
								</div>
							</div>

							{/* Hair Lengths */}
							<div className='space-y-2'>
								<div className='flex items-center gap-2 text-sm text-neutral-400'>
									<Scissors className='h-4 w-4' />
									<p className='font-medium'>Hair Lengths</p>
								</div>
								<div className='flex flex-wrap gap-2'>
									{customer.hairLengths?.length ?
										customer.hairLengths.map((length: string, i: number) => (
											<span
												key={i}
												className='px-2 py-0.5 text-xs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'>
												{length}
											</span>
										))
									:	<p className='text-xs text-neutral-500'>None specified</p>}
								</div>
							</div>

							{/* Hair Patterns */}
							<div className='space-y-2'>
								<div className='flex items-center gap-2 text-sm text-neutral-400'>
									<BrainCircuit className='h-4 w-4' />
									<p className='font-medium'>Hair Patterns</p>
								</div>
								<div className='flex flex-wrap gap-2'>
									{customer.hairPatterns?.length ?
										customer.hairPatterns.map((pattern: string, i: number) => (
											<span
												key={i}
												className='px-2 py-0.5 text-xs font-semibold rounded bg-purple-500/10 text-purple-400 border border-purple-500/20'>
												{pattern}
											</span>
										))
									:	<p className='text-xs text-neutral-500'>None specified</p>}
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Payment Cards */}
					<CustomerCardList customerId={customer.key} />
				</div>

				{/* Right Main Content (Placeholders) */}
				<div className='lg:col-span-2 space-y-6'>
					{/* Orders Placeholder */}
					<CustomerOrdersList customerId={customer.key} />

					{/* Active Cart */}
					<CustomerCart customerId={customer.key} />

					{/* Wishlist */}
					<CustomerWishlist customerId={customer.key} />

					{/* Addresses */}
					<CustomerAddressList customerId={customer.key} />
				</div>
			</div>
		</div>
	);
};
