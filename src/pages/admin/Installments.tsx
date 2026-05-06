import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstallmentsQuery } from '../../hooks/useInstallments';
import { INSTALLMENT_STATUS } from '../../api/installments';
import { TablePagination } from '../../components/TablePagination';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Wallet, Loader2, MoreHorizontal, Eye, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import { getCloudFileURL } from '../../lib/utils';
import { APP_ROUTES } from '../../config/routes.app';
import { formatCurrency } from '@/lib/formatCurrency';
import { Badge } from '../../components/ui/badge';

export const Installments: React.FC = () => {
	const navigate = useNavigate();
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [statusFilter, setStatusFilter] = useState<string>('ALL');

	const { data: installmentsResponse, isLoading } = useInstallmentsQuery({
		page,
		limit,
		status: statusFilter === 'ALL' ? undefined : (statusFilter as any),
	});

	const installments = installmentsResponse?.data?.results ?? [];
	const totalPages = installmentsResponse?.data?.totalPages ?? 1;
	const totalResults = installmentsResponse?.data?.totalCount ?? 0;

	const getStatusBadge = (status: string) => {
		switch (status) {
			case INSTALLMENT_STATUS.COMPLETED:
				return (
					<Badge className='bg-emerald-500/10 text-emerald-400 border-emerald-500/20'>
						<CheckCircle2 className='h-3 w-3 mr-1' /> Completed
					</Badge>
				);
			case INSTALLMENT_STATUS.ACTIVE:
				return (
					<Badge className='bg-blue-500/10 text-blue-400 border-blue-500/20'>
						<Clock className='h-3 w-3 mr-1' /> Active
					</Badge>
				);
			case INSTALLMENT_STATUS.PENDING:
				return (
					<Badge className='bg-yellow-500/10 text-yellow-400 border-yellow-500/20'>
						<AlertCircle className='h-3 w-3 mr-1' /> Pending
					</Badge>
				);
			case INSTALLMENT_STATUS.OVERDUE:
				return (
					<Badge className='bg-red-500/10 text-red-400 border-red-500/20'>
						<AlertCircle className='h-3 w-3 mr-1' /> Overdue
					</Badge>
				);
			case INSTALLMENT_STATUS.CANCELLED:
				return (
					<Badge className='bg-neutral-800 text-neutral-400 border-neutral-700'>
						<XCircle className='h-3 w-3 mr-1' /> Cancelled
					</Badge>
				);
			default:
				return <Badge>{status}</Badge>;
		}
	};

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<Wallet className='h-8 w-8 text-blue-400' /> Installment Payments
					</h2>
					<p className='text-neutral-400 mt-1'>Manage and track customer product installment plans.</p>
				</div>
			</div>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0 gap-0'>
				<div className='p-4 border-b border-neutral-800 flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<span className='text-sm text-neutral-400'>Filter by Status:</span>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className='w-[150px] bg-neutral-900 border-neutral-700 text-white h-9'>
								<SelectValue placeholder='All Statuses' />
							</SelectTrigger>
							<SelectContent className='bg-neutral-900 border-neutral-800 text-white'>
								<SelectItem value='ALL'>All Statuses</SelectItem>
								<SelectItem value={INSTALLMENT_STATUS.PENDING}>Pending</SelectItem>
								<SelectItem value={INSTALLMENT_STATUS.ACTIVE}>Active</SelectItem>
								<SelectItem value={INSTALLMENT_STATUS.OVERDUE}>Overdue</SelectItem>
								<SelectItem value={INSTALLMENT_STATUS.COMPLETED}>Completed</SelectItem>
								<SelectItem value={INSTALLMENT_STATUS.CANCELLED}>Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className='text-sm text-neutral-500'>
						Total: <span className='text-white font-medium'>{totalResults}</span> plans
					</div>
				</div>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400 w-[50px]'>S/N</TableHead>
								<TableHead className='text-neutral-400'>Customer</TableHead>
								<TableHead className='text-neutral-400'>Order Ref</TableHead>
								<TableHead className='text-neutral-400'>Product</TableHead>
								<TableHead className='text-neutral-400'>Amount</TableHead>
								<TableHead className='text-neutral-400'>Paid / Balance</TableHead>
								<TableHead className='text-neutral-400'>Status</TableHead>
								<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ?
								<TableRow>
									<TableCell colSpan={8} className='text-center py-10 text-neutral-500'>
										<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-blue-400' />
										Loading installment plans...
									</TableCell>
								</TableRow>
							: installments.length === 0 ?
								<TableRow>
									<TableCell colSpan={8} className='text-center py-10 text-neutral-500'>
										No installment plans found.
									</TableCell>
								</TableRow>
							:	installments.map((plan, index) => (
									<TableRow
										key={plan.key}
										onClick={() => navigate(`${APP_ROUTES.INSTALLMENTS}/${plan.key}`)}
										className='border-neutral-800 hover:bg-neutral-800/30 transition-colors cursor-pointer group/row'>
										<TableCell className='text-neutral-500 font-medium text-xs'>{(page - 1) * limit + index + 1}</TableCell>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Avatar className='h-8 w-8 ring-1 ring-neutral-700'>
													{plan.customer?.avatar?.thumbnail ?
														<img src={getCloudFileURL(plan.customer.avatar.thumbnail)} alt='Avatar' className='object-cover' />
													:	<AvatarFallback className='bg-neutral-800 text-blue-400 text-[10px] uppercase'>
															{plan.customer?.firstName?.[0] || 'U'}
															{plan.customer?.lastName?.[0] || 'U'}
														</AvatarFallback>
													}
												</Avatar>
												<div className='flex flex-col'>
													<span className='text-sm text-white font-medium'>
														{plan.customer?.firstName} {plan.customer?.lastName}
													</span>
													<span className='text-[11px] text-neutral-500'>{plan.customer?.email}</span>
												</div>
											</div>
										</TableCell>
										<TableCell className='font-mono text-xs text-blue-400 font-medium'>{plan.order?.reference}</TableCell>
										<TableCell>
											<span className='text-sm text-neutral-300 truncate max-w-[150px] block'>
												{plan.order?.items?.[0]?.product?.title || 'Product Details'}
											</span>
										</TableCell>
										<TableCell>
											<span className='text-sm font-semibold text-white'>{formatCurrency(plan.totalAmount)}</span>
										</TableCell>
										<TableCell>
											<div className='flex flex-col'>
												<span className='text-xs text-emerald-400 font-medium'>{formatCurrency(plan.paidAmount)}</span>
												<span className='text-[10px] text-neutral-500'>Bal: {formatCurrency(plan.pendingBalance)}</span>
											</div>
										</TableCell>
										<TableCell>{getStatusBadge(plan.status)}</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
													<Button variant='ghost' className='h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800'>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='bg-neutral-900 border-neutral-800 text-white'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															navigate(`${APP_ROUTES.INSTALLMENTS}/${plan.key}`);
														}}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<Eye className='mr-2 h-4 w-4 text-blue-400' /> View Details
													</DropdownMenuItem>
													<DropdownMenuSeparator className='bg-neutral-800' />
													<DropdownMenuItem
														onClick={(e) => {
															e.stopPropagation();
															navigate(`${APP_ROUTES.ORDERS}/${plan.order?.key}`);
														}}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														View Associated Order
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</CardContent>
				<TablePagination
					page={page}
					limit={limit}
					totalResults={totalResults}
					totalPages={totalPages}
					onPageChange={setPage}
					onLimitChange={setLimit}
				/>
			</Card>
		</div>
	);
};
