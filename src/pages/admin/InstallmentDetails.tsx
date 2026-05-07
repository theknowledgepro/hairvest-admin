import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInstallmentPlanQuery, useCancelInstallmentMutation } from '../../hooks/useInstallments';
import { INSTALLMENT_STATUS } from '../../api/installments';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ChevronLeft, Loader2, Wallet, User, Package, CheckCircle2, XCircle, AlertCircle, Clock, ArrowUpRight, History, Ban } from 'lucide-react';
import { getCloudFileURL } from '../../lib/utils';
import { formatDate } from '@/lib/formatDate';
import { formatCurrency } from '@/lib/formatCurrency';
import { APP_ROUTES } from '../../config/routes.app';

export const InstallmentDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	const { data: planResponse, isLoading } = useInstallmentPlanQuery(id!);
	const plan = planResponse?.data?.plan;

	const { mutate: cancelPlan, isPending: isCancelling } = useCancelInstallmentMutation();

	const handleCancelPlan = () => {
		if (
			window.confirm(
				"Are you sure you want to cancel this installment plan? This action will also cancel the associated order and refund the paid amount to the customer's DVA wallet.",
			)
		) {
			cancelPlan(id!);
		}
	};

	if (isLoading) {
		return (
			<div className='h-[60vh] flex flex-col items-center justify-center text-neutral-500'>
				<Loader2 className='h-10 w-10 animate-spin text-blue-400 mb-4' />
				<p>Loading plan details...</p>
			</div>
		);
	}

	if (!plan) {
		return (
			<div className='h-[60vh] flex flex-col items-center justify-center text-neutral-500'>
				<XCircle className='h-12 w-12 text-red-500 mb-4' />
				<p className='text-xl font-semibold text-white'>Plan Not Found</p>
				<Button variant='link' onClick={() => navigate(-1)} className='text-blue-400 mt-2'>
					Go Back
				</Button>
			</div>
		);
	}

	const getStatusBadge = (status: string) => {
		switch (status) {
			case INSTALLMENT_STATUS.COMPLETED:
				return (
					<Badge className='bg-emerald-500/10 text-emerald-400 border-emerald-500/20'>
						<CheckCircle2 className='h-3.5 w-3.5 mr-1.5' /> Completed
					</Badge>
				);
			case INSTALLMENT_STATUS.ACTIVE:
				return (
					<Badge className='bg-blue-500/10 text-blue-400 border-blue-500/20'>
						<Clock className='h-3.5 w-3.5 mr-1.5' /> Active
					</Badge>
				);
			case INSTALLMENT_STATUS.PENDING:
				return (
					<Badge className='bg-yellow-500/10 text-yellow-400 border-yellow-500/20'>
						<AlertCircle className='h-3.5 w-3.5 mr-1.5' /> Pending
					</Badge>
				);
			case INSTALLMENT_STATUS.OVERDUE:
				return (
					<Badge className='bg-red-500/10 text-red-400 border-red-500/20'>
						<AlertCircle className='h-3.5 w-3.5 mr-1.5' /> Overdue
					</Badge>
				);
			case INSTALLMENT_STATUS.CANCELLED:
				return (
					<Badge className='bg-neutral-800 text-neutral-400 border-neutral-700'>
						<XCircle className='h-3.5 w-3.5 mr-1.5' /> Cancelled
					</Badge>
				);
			default:
				return <Badge>{status}</Badge>;
		}
	};

	const progress = (plan.paidAmount / plan.totalAmount) * 100;

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12'>
			<Button
				variant='ghost'
				onClick={() => navigate(-1)}
				className='mb-6 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center gap-2 p-0 h-auto hover:bg-transparent transition-colors'>
				<ChevronLeft className='h-4 w-4' /> Back to Installments
			</Button>

			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div className='flex items-center gap-4'>
					<div className='h-12 w-12 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center'>
						<Wallet className='h-6 w-6 text-blue-400' />
					</div>
					<div>
						<h2 className='text-2xl font-bold text-white flex items-center gap-3'>Installment Plan Details</h2>
						<div className='flex items-center gap-3 mt-1'>
							<span className='text-neutral-500 text-sm flex items-center gap-1 font-mono uppercase tracking-wider'>ID: {plan.key}</span>
							<Separator orientation='vertical' className='h-3 bg-neutral-800' />
							{getStatusBadge(plan.status)}
						</div>
					</div>
				</div>
				{plan.status !== INSTALLMENT_STATUS.CANCELLED && plan.status !== INSTALLMENT_STATUS.COMPLETED && (
					<Button
						variant='destructive'
						onClick={handleCancelPlan}
						disabled={isCancelling}
						className='bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all'>
						{isCancelling ?
							<Loader2 className='h-4 w-4 animate-spin' />
						:	<Ban className='h-4 w-4 mr-2' />}
						Cancel Plan
					</Button>
				)}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Left Column - Plan Stats & Progress */}
				<div className='lg:col-span-2 space-y-6'>
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<AlertCircle className='h-5 w-5 text-blue-400' /> Plan Overview
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8'>
								<div className='space-y-1'>
									<p className='text-xs text-neutral-500 uppercase font-bold tracking-widest'>Total Amount</p>
									<p className='text-2xl font-bold text-white'>{formatCurrency(plan.totalAmount)}</p>
								</div>
								<div className='space-y-1'>
									<p className='text-xs text-neutral-500 uppercase font-bold tracking-widest text-emerald-500'>Paid to Date</p>
									<p className='text-2xl font-bold text-emerald-400'>{formatCurrency(plan.paidAmount)}</p>
								</div>
								<div className='space-y-1'>
									<p className='text-xs text-neutral-500 uppercase font-bold tracking-widest text-blue-500'>Pending Balance</p>
									<p className='text-2xl font-bold text-blue-400'>{formatCurrency(plan.pendingBalance)}</p>
								</div>
							</div>

							<div className='space-y-3'>
								<div className='flex justify-between items-end'>
									<p className='text-sm text-neutral-400'>Repayment Progress</p>
									<p className='text-sm font-bold text-white'>{Math.round(progress)}%</p>
								</div>
								<div className='h-3 w-full bg-neutral-800 rounded-full overflow-hidden border border-neutral-700/50'>
									<div
										className='h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]'
										style={{ width: `${progress}%` }}
									/>
								</div>
								<div className='flex justify-between text-xs text-neutral-500'>
									<span>
										Installment {plan.installmentsPaidCount} of {plan.installmentsCount}
									</span>
									<span>{plan.frequency} Repayment</span>
								</div>
							</div>

							<Separator className='my-8 bg-neutral-800' />

							<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
								<div className='space-y-4'>
									<div className='flex items-center justify-between py-1'>
										<span className='text-neutral-500 text-sm'>Frequency</span>
										<span className='text-white font-medium capitalize'>{plan.frequency.toLowerCase()}</span>
									</div>
									<div className='flex items-center justify-between py-1'>
										<span className='text-neutral-500 text-sm'>Created On</span>
										<span className='text-white font-medium'>{formatDate(plan.createdAt)}</span>
									</div>
								</div>
								<div className='space-y-4'>
									<div className='flex items-center justify-between py-1'>
										<span className='text-neutral-500 text-sm'>Next Payment Date</span>
										<span className='text-blue-400 font-bold'>{plan.nextPaymentDate ? formatDate(plan.nextPaymentDate) : 'N/A'}</span>
									</div>
									<div className='flex items-center justify-between py-1'>
										<span className='text-neutral-500 text-sm'>Completed On</span>
										<span className='text-white font-medium'>{plan.completedAt ? formatDate(plan.completedAt) : 'In Progress'}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<History className='h-5 w-5 text-purple-400' /> Repayment History
							</CardTitle>
						</CardHeader>
						<CardContent className='p-0'>
							{plan.history.length === 0 ?
								<div className='p-12 text-center text-neutral-500'>
									<Clock className='h-10 w-10 mx-auto mb-3 opacity-20' />
									<p>No repayment history found.</p>
								</div>
							:	<div className='overflow-x-auto'>
									<table className='w-full text-left border-collapse'>
										<thead>
											<tr className='bg-neutral-800/20 text-neutral-500 text-[11px] uppercase tracking-wider'>
												<th className='py-3 px-6 font-bold'>Date</th>
												<th className='py-3 px-6 font-bold'>Reference</th>
												<th className='py-3 px-6 font-bold text-right'>Amount Paid</th>
											</tr>
										</thead>
										<tbody>
											{plan.history.map((item) => (
												<tr key={item.key} className='border-t border-neutral-800 hover:bg-neutral-800/20 transition-colors'>
													<td className='py-4 px-6 text-sm text-neutral-300'>{formatDate(item.paidAt)}</td>
													<td className='py-4 px-6 font-mono text-[11px] text-neutral-500'>{item.reference}</td>
													<td className='py-4 px-6 text-sm font-bold text-emerald-400 text-right'>
														{formatCurrency(item.amount)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							}
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Customer & Order */}
				<div className='space-y-6'>
					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<User className='h-5 w-5 text-blue-400' /> Customer
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6'>
							<div className='flex items-center gap-4 mb-6'>
								<Avatar className='h-14 w-14 ring-2 ring-neutral-800 shadow-xl'>
									<AvatarImage src={getCloudFileURL(plan.customer?.avatar?.thumbnail)} />
									<AvatarFallback className='bg-neutral-800 text-blue-400 text-xl font-bold uppercase'>
										{plan.customer?.firstName?.[0]}
										{plan.customer?.lastName?.[0]}
									</AvatarFallback>
								</Avatar>
								<div>
									<h4 className='text-white font-bold text-lg leading-tight'>
										{plan.customer?.firstName} {plan.customer?.lastName}
									</h4>
									<p className='text-neutral-500 text-sm'>{plan.customer?.email}</p>
								</div>
							</div>
							<Separator className='bg-neutral-800 mb-6' />
							<Button
								variant='outline'
								onClick={() => navigate(`${APP_ROUTES.CUSTOMERS}/${plan.customer?.key}`)}
								className='w-full border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center gap-2 group transition-all'>
								View Full Profile{' '}
								<ArrowUpRight className='h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' />
							</Button>
						</CardContent>
					</Card>

					<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur overflow-hidden'>
						<CardHeader className='border-b border-neutral-800 bg-neutral-900/30'>
							<CardTitle className='text-lg font-semibold flex items-center gap-2'>
								<Package className='h-5 w-5 text-rose-400' /> Associated Order
							</CardTitle>
						</CardHeader>
						<CardContent className='p-6 space-y-6'>
							<div className='flex items-start gap-4'>
								<div className='h-16 w-16 rounded-lg bg-neutral-950 border border-neutral-800 flex-shrink-0 overflow-hidden'>
									{plan.order?.items?.[0]?.product?.images?.[0] ?
										<img
											src={getCloudFileURL(plan.order.items[0].product.images[0].thumbnail)}
											alt='Product'
											className='w-full h-full object-cover'
										/>
									:	<div className='w-full h-full flex items-center justify-center text-neutral-800'>
											<Package className='h-6 w-6' />
										</div>
									}
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-white font-bold text-sm truncate'>{plan.order?.items?.[0]?.product?.title || 'Product Item'}</p>
									<p className='text-neutral-500 text-xs mt-0.5'>Ref: {plan.order?.reference}</p>
									<p className='text-blue-400 text-xs font-medium mt-1'>{plan.order?.status || 'N/A'}</p>
								</div>
							</div>
							<Separator className='bg-neutral-800' />
							<div className='space-y-4 text-sm'>
								<div className='flex justify-between'>
									<span className='text-neutral-500'>Order Date</span>
									<span className='text-neutral-300 font-medium'>{plan.order?.createdAt ? formatDate(plan.order.createdAt) : '—'}</span>
								</div>
								<div className='flex justify-between'>
									<span className='text-neutral-500'>Checkout Amount</span>
									<span className='text-white font-bold'>{formatCurrency(plan.order?.checkoutAmount || 0)}</span>
								</div>
								<Button
									variant='outline'
									onClick={() => navigate(`${APP_ROUTES.ORDERS}/${plan.order?.key}`)}
									className='w-full border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center gap-2 mt-2 transition-all'>
									Manage Order
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
