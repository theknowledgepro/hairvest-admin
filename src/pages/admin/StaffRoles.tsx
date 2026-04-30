import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatDate } from '../../lib/formatDate';
import { createRoleSchema, type CreateRoleFormValues } from '../../lib/schemas/staffRoles.schemas';
import {
	useStaffRolesQuery,
	useCreateRoleMutation,
	useUpdateRoleMutation,
	useDeleteRoleMutation,
	useStaffPermissionsQuery,
} from '../../hooks/useStaffRoles';
import type { StaffRole, StaffPermission } from '../../api/staffRoles';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Plus, ShieldCheck, Loader2, MoreHorizontal, Trash2, Edit, ChevronsUpDown, Check } from 'lucide-react';

type DialogMode = 'create' | 'edit' | null;

// Groups permissions by category and renders a grouped multi-select
const PermissionMultiSelect: React.FC<{
	permissions: StaffPermission[];
	selectedIds: string[];
	onChange: (ids: string[]) => void;
	error?: string;
	isLoading?: boolean;
}> = ({ permissions, selectedIds, onChange, error, isLoading }) => {
	const [open, setOpen] = useState(false);

	const toggle = (id: string) => {
		onChange(selectedIds.includes(id) ? selectedIds.filter((p) => p !== id) : [...selectedIds, id]);
	};

	const toggleCategory = (categoryIds: string[]) => {
		const allSelected = categoryIds.every((id) => selectedIds.includes(id));
		if (allSelected) {
			onChange(selectedIds.filter((id) => !categoryIds.includes(id)));
		} else {
			const toAdd = categoryIds.filter((id) => !selectedIds.includes(id));
			onChange([...selectedIds, ...toAdd]);
		}
	};

	// Group by category
	const grouped = permissions.reduce<Record<string, StaffPermission[]>>((acc, perm) => {
		if (!acc[perm.category]) acc[perm.category] = [];
		acc[perm.category].push(perm);
		return acc;
	}, {});

	const selectedCount = selectedIds.length;

	return (
		<div className='space-y-2'>
			<div className='flex items-center justify-between'>
				<Label className='text-neutral-300'>Permissions</Label>
				{selectedCount > 0 && <span className='text-xs text-blue-400 font-medium tabular-nums'>{selectedCount} selected</span>}
			</div>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type='button'
						className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm bg-neutral-800 text-white transition-colors ${
							error ? 'border-red-500' : 'border-neutral-700'
						} hover:border-neutral-500`}>
						<span className={selectedCount === 0 ? 'text-neutral-500' : ''}>
							{selectedCount === 0 ? 'Select permissions...' : `${selectedCount} permission${selectedCount !== 1 ? 's' : ''} selected`}
						</span>
						<ChevronsUpDown className='h-4 w-4 text-neutral-400 shrink-0 ml-2' />
					</button>
				</PopoverTrigger>
				<PopoverContent className='w-[460px] max-h-[380px] overflow-y-auto p-2 bg-neutral-800 border-neutral-700 shadow-xl' align='start'>
					{isLoading ?
						<div className='flex items-center justify-center py-6 text-neutral-500 gap-2 text-sm'>
							<Loader2 className='h-4 w-4 animate-spin' /> Loading permissions...
						</div>
					: Object.keys(grouped).length === 0 ?
						<p className='text-neutral-500 text-sm px-3 py-2'>No permissions available</p>
					:	Object.entries(grouped).map(([category, perms]) => {
							const categoryIds = perms.map((p) => p.id);
							const allSelected = categoryIds.every((id) => selectedIds.includes(id));
							const someSelected = categoryIds.some((id) => selectedIds.includes(id));

							return (
								<div key={category} className='mb-1'>
									{/* Category header / select-all row */}
									<button
										type='button'
										onClick={() => toggleCategory(categoryIds)}
										className='flex w-full items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:bg-neutral-700/60 transition-colors'>
										<div
											className={`h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
												allSelected ? 'bg-blue-600 border-blue-600'
												: someSelected ? 'bg-blue-600/40 border-blue-500'
												: 'border-neutral-500'
											}`}>
											{allSelected && <Check className='h-2.5 w-2.5 text-white' />}
											{someSelected && !allSelected && <span className='block w-1.5 h-0.5 bg-white rounded-full' />}
										</div>
										{category.replace(/_/g, ' ')}
									</button>

									{/* Individual permissions */}
									{perms.map((perm) => {
										const isSelected = selectedIds.includes(perm.id);
										return (
											<button
												key={perm.id}
												type='button'
												onClick={() => toggle(perm.id)}
												className='flex w-full items-start gap-3 pl-6 pr-3 py-1.5 rounded text-sm text-white hover:bg-neutral-700/50 transition-colors'>
												<div
													className={`h-4 w-4 mt-0.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
														isSelected ? 'bg-blue-600 border-blue-600' : 'border-neutral-500'
													}`}>
													{isSelected && <Check className='h-3 w-3 text-white' />}
												</div>
												<div className='text-left'>
													<p className='font-medium leading-snug'>{perm.title}</p>
													{perm.summary && <p className='text-xs text-neutral-400 mt-0.5'>{perm.summary}</p>}
												</div>
											</button>
										);
									})}
								</div>
							);
						})
					}
				</PopoverContent>
			</Popover>
			{error && <p className='text-xs text-red-400'>{error}</p>}
		</div>
	);
};

export const StaffRoles: React.FC = () => {
	const [dialogMode, setDialogMode] = useState<DialogMode>(null);
	const [selectedRole, setSelectedRole] = useState<StaffRole | null>(null);

	const { data: rolesResponse, isLoading } = useStaffRolesQuery();
	const { data: permissionsResponse, isLoading: isLoadingPermissions } = useStaffPermissionsQuery();
	const roles = rolesResponse?.data?.roles ?? [];
	const permissions = permissionsResponse?.data?.permissions ?? [];

	const closeDialog = () => {
		setDialogMode(null);
		setSelectedRole(null);
		reset();
	};

	const { mutate: createRole, isPending: isCreating } = useCreateRoleMutation(closeDialog);
	const { mutate: updateRole, isPending: isUpdating } = useUpdateRoleMutation(closeDialog);
	const { mutate: deleteRole } = useDeleteRoleMutation();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<CreateRoleFormValues>({
		resolver: zodResolver(createRoleSchema),
		defaultValues: { title: '', summary: '', permissions: [] },
	});

	const watchedPermissions = watch('permissions');

	const openCreate = () => {
		reset({ title: '', summary: '', permissions: [] });
		setDialogMode('create');
	};

	const openEdit = (role: StaffRole) => {
		setSelectedRole(role);
		reset({ title: role.title, summary: role.summary ?? '', permissions: role.permissions });
		setDialogMode('edit');
	};

	const onSubmit = (data: CreateRoleFormValues) => {
		if (dialogMode === 'create') {
			createRole(data);
		} else if (dialogMode === 'edit' && selectedRole) {
			updateRole({ id: selectedRole.id, data });
		}
	};

	const isSubmitting = isCreating || isUpdating;

	// Resolve permission ids → titles for table display
	const getPermissionLabels = (ids: string[]) => ids.map((id) => permissions.find((p) => p.id === id)?.title ?? id);

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<ShieldCheck className='h-8 w-8 text-blue-400' /> Staff Roles
					</h2>
					<p className='text-neutral-400 mt-1'>Manage roles and permissions for your team members.</p>
				</div>

				<Button onClick={openCreate} className='bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'>
					<Plus className='h-4 w-4 mr-2' /> Add Role
				</Button>
			</div>

			{/* Create / Edit Dialog */}
			<Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
				<DialogContent className='sm:max-w-[520px] bg-neutral-900 border-neutral-800 text-white'>
					<DialogHeader>
						<DialogTitle>{dialogMode === 'edit' ? 'Edit Role' : 'Create New Role'}</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-4'>
						<div className='space-y-2'>
							<Label htmlFor='roleName' className='text-neutral-300'>
								Role Name
							</Label>
							<Input
								id='roleName'
								placeholder='e.g. Receptionist'
								{...register('title')}
								className='bg-neutral-800 border-neutral-700 text-white focus-visible:ring-blue-500'
							/>
							{errors.title && <p className='text-xs text-red-400'>{errors.title.message}</p>}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='roleSummary' className='text-neutral-300'>
								Description <span className='text-neutral-500'>(optional)</span>
							</Label>
							<Input
								id='roleSummary'
								placeholder='Brief description of this role...'
								{...register('summary')}
								className='bg-neutral-800 border-neutral-700 text-white focus-visible:ring-blue-500'
							/>
						</div>

						<PermissionMultiSelect
							permissions={permissions}
							selectedIds={watchedPermissions ?? []}
							onChange={(ids) => setValue('permissions', ids, { shouldValidate: true })}
							error={errors.permissions?.message as string | undefined}
							isLoading={isLoadingPermissions}
						/>

						<Button type='submit' disabled={isSubmitting} className='w-full bg-blue-600 hover:bg-blue-500'>
							{isSubmitting ?
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							: dialogMode === 'edit' ?
								'Update Role'
							:	'Save Role'}
						</Button>
					</form>
				</DialogContent>
			</Dialog>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0'>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400'>S/N</TableHead>
								<TableHead className='text-neutral-400'>Role Name</TableHead>
								<TableHead className='text-neutral-400'>Permissions</TableHead>
								<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
								<TableHead className='text-neutral-400'>Created</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ?
								<TableRow>
									<TableCell colSpan={4} className='text-center py-10 text-neutral-500'>
										<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-blue-400' />
										Loading roles...
									</TableCell>
								</TableRow>
							: roles.length === 0 ?
								<TableRow>
									<TableCell colSpan={4} className='text-center py-10 text-neutral-500'>
										No roles found. Create one to get started.
									</TableCell>
								</TableRow>
							:	roles.map((role, index) => (
									<TableRow key={role.id} className='border-neutral-800 hover:bg-neutral-800/30 transition-colors'>
										<TableCell className='text-neutral-500 font-medium text-xs'>{index + 1}</TableCell>
										<TableCell>
											<div>
												<p className='font-medium text-white'>{role.title}</p>
												{role.summary && <p className='text-xs text-neutral-500 mt-0.5'>{role.summary}</p>}
											</div>
										</TableCell>
										<TableCell>
											<div className='flex flex-wrap gap-1.5 max-w-sm'>
												{getPermissionLabels(role.permissions).map((label) => (
													<span
														key={label}
														className='px-2 py-0.5 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium'>
														{label}
													</span>
												))}
												{role.permissions.length === 0 && <span className='text-xs text-neutral-600 italic'>No permissions</span>}
											</div>
										</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' className='h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800'>
														<span className='sr-only'>Open menu</span>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='bg-neutral-900 border-neutral-800 text-white'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={() => openEdit(role)}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<Edit className='mr-2 h-4 w-4 text-blue-400' /> Edit Role
													</DropdownMenuItem>
													<DropdownMenuSeparator className='bg-neutral-800' />
													<DropdownMenuItem
														onClick={() => {
															if (confirm('Are you sure you want to delete this role?')) {
																deleteRole(role.id);
															}
														}}
														className='hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer'>
														<Trash2 className='mr-2 h-4 w-4' /> Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
										<TableCell>
											<div className='flex flex-col gap-0.5'>
												{role.createdAt && <span className='text-[14px] text-neutral-200'>{formatDate(role.createdAt)}</span>}
												{role.updatedAt && role.updatedAt !== role.createdAt && (
													<span className='text-[13px] text-neutral-400'>Edited {formatDate(role.updatedAt)}</span>
												)}
											</div>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};
