import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createMemberSchema, type CreateMemberFormValues } from '../../lib/schemas/staffMembers.schemas';
import { useStaffMembersQuery, useCreateMemberMutation, useUpdateMemberMutation, useDeleteMemberMutation } from '../../hooks/useStaffMembers';
import { useStaffRolesQuery } from '../../hooks/useStaffRoles';
import type { StaffMember } from '../../api/staffMembers';
import type { StaffRole } from '../../api/staffRoles';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../../components/ui/popover';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Plus, Users, Loader2, MoreHorizontal, Trash2, Edit, ChevronsUpDown, Check } from 'lucide-react';

type DialogMode = 'create' | 'edit' | null;

// Multi-select role picker component
const RoleMultiSelect: React.FC<{
	roles: StaffRole[];
	selectedIds: string[];
	onChange: (ids: string[]) => void;
	error?: string;
}> = ({ roles, selectedIds, onChange, error }) => {
	const [open, setOpen] = useState(false);

	const toggle = (id: string) => {
		if (selectedIds.includes(id)) {
			onChange(selectedIds.filter((r) => r !== id));
		} else {
			onChange([...selectedIds, id]);
		}
	};

	const selectedLabels = roles.filter((r) => selectedIds.includes(r.id)).map((r) => r.title);

	return (
		<div className='space-y-2'>
			<Label className='text-neutral-300'>Roles</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<button
						type='button'
						className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm bg-neutral-800 text-white transition-colors ${
							error ? 'border-red-500' : 'border-neutral-700'
						} hover:border-neutral-500`}>
						<span className={selectedLabels.length === 0 ? 'text-neutral-500' : ''}>
							{selectedLabels.length === 0 ? 'Select roles...' : selectedLabels.join(', ')}
						</span>
						<ChevronsUpDown className='h-4 w-4 text-neutral-400 shrink-0 ml-2' />
					</button>
				</PopoverTrigger>
				<PopoverContent className='w-full min-w-[280px] p-1 bg-neutral-800 border-neutral-700 shadow-xl' align='start'>
					{roles.length === 0 ?
						<p className='text-neutral-500 text-sm px-3 py-2'>No roles available</p>
					:	roles.map((role) => {
							const isSelected = selectedIds.includes(role.id);
							return (
								<button
									key={role.id}
									type='button'
									onClick={() => toggle(role.id)}
									className='flex w-full items-center gap-3 px-3 py-2 rounded text-sm text-white hover:bg-neutral-700 transition-colors'>
									<div
										className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
											isSelected ? 'bg-blue-600 border-blue-600' : 'border-neutral-500'
										}`}>
										{isSelected && <Check className='h-3 w-3 text-white' />}
									</div>
									<div className='text-left'>
										<p className='font-medium'>{role.title}</p>
										{role.summary && <p className='text-xs text-neutral-400'>{role.summary}</p>}
									</div>
								</button>
							);
						})
					}
				</PopoverContent>
			</Popover>
			{error && <p className='text-xs text-red-400'>{error}</p>}
		</div>
	);
};

export const StaffMembers: React.FC = () => {
	const [dialogMode, setDialogMode] = useState<DialogMode>(null);
	const [selectedMember, setSelectedMember] = useState<StaffMember | null>(null);

	const { data: membersResponse, isLoading } = useStaffMembersQuery();
	const { data: rolesResponse } = useStaffRolesQuery();
	const members = membersResponse?.data?.members ?? [];
	const roles = rolesResponse?.data?.roles ?? [];

	const closeDialog = () => {
		setDialogMode(null);
		setSelectedMember(null);
		reset();
	};

	const { mutate: createMember, isPending: isCreating } = useCreateMemberMutation(closeDialog);
	const { mutate: updateMember, isPending: isUpdating } = useUpdateMemberMutation(closeDialog);
	const { mutate: deleteMember } = useDeleteMemberMutation();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<CreateMemberFormValues>({
		resolver: zodResolver(createMemberSchema),
		defaultValues: { firstName: '', lastName: '', email: '', phone: '', roles: [] },
	});

	const watchedRoles = watch('roles');

	const openCreate = () => {
		reset({ firstName: '', lastName: '', email: '', phone: '', roles: [] });
		setDialogMode('create');
	};

	const openEdit = (member: StaffMember) => {
		setSelectedMember(member);
		reset({
			firstName: member.firstName,
			lastName: member.lastName,
			email: member.email,
			phone: member.phone?.international ?? '',
			roles: member.roles?.map((r) => r?.id) ?? [],
		});
		setDialogMode('edit');
	};

	const onSubmit = (data: CreateMemberFormValues) => {
		// Validate that all selected role IDs exist in the fetched roles list
		const validRoleIds = new Set(roles.map((r) => r.id));
		const invalidRoles = data.roles.filter((id) => !validRoleIds.has(id));
		if (invalidRoles.length > 0) {
			setValue(
				'roles',
				data.roles.filter((id) => validRoleIds.has(id)),
				{ shouldValidate: true },
			);
			return;
		}

		if (dialogMode === 'create') {
			createMember(data);
		} else if (dialogMode === 'edit' && selectedMember) {
			updateMember({ id: selectedMember.id, data });
		}
	};

	const getRoleNames = (roleIds: string[]) => {
		return roleIds.map((id) => roles.find((r) => r.id === id)?.title ?? id);
	};

	const isSubmitting = isCreating || isUpdating;

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<Users className='h-8 w-8 text-blue-400' /> Staff Members
					</h2>
					<p className='text-neutral-400 mt-1'>Manage all your employees in one place.</p>
				</div>

				<Button onClick={openCreate} className='bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'>
					<Plus className='mr-2 h-4 w-4' /> Add Member
				</Button>
			</div>

			{/* Create / Edit Dialog */}
			<Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
				<DialogContent className='sm:max-w-[480px] bg-neutral-900 border-neutral-800 text-white'>
					<DialogHeader>
						<DialogTitle>{dialogMode === 'edit' ? 'Edit Staff Member' : 'Add New Staff Member'}</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-4'>
						<div className='grid grid-cols-2 gap-4'>
							<div className='space-y-2'>
								<Label htmlFor='firstName' className='text-neutral-300'>
									First Name
								</Label>
								<Input
									id='firstName'
									placeholder='Jane'
									{...register('firstName')}
									className='bg-neutral-800 border-neutral-700 text-white'
								/>
								{errors.firstName && <p className='text-xs text-red-400'>{errors.firstName.message}</p>}
							</div>
							<div className='space-y-2'>
								<Label htmlFor='lastName' className='text-neutral-300'>
									Last Name
								</Label>
								<Input
									id='lastName'
									placeholder='Doe'
									{...register('lastName')}
									className='bg-neutral-800 border-neutral-700 text-white'
								/>
								{errors.lastName && <p className='text-xs text-red-400'>{errors.lastName.message}</p>}
							</div>
						</div>

						<div className='space-y-2'>
							<Label htmlFor='email' className='text-neutral-300'>
								Email Address
							</Label>
							<Input
								id='email'
								type='email'
								placeholder='jane@hairvest.com'
								{...register('email')}
								className='bg-neutral-800 border-neutral-700 text-white'
							/>
							{errors.email && <p className='text-xs text-red-400'>{errors.email.message}</p>}
						</div>

						<div className='space-y-2'>
							<Label htmlFor='phone' className='text-neutral-300'>
								Phone Number
							</Label>
							<Input
								id='phone'
								type='tel'
								placeholder='+2348012345678'
								{...register('phone')}
								className='bg-neutral-800 border-neutral-700 text-white'
							/>
							<p className='text-xs text-neutral-500'>Must include country code (e.g. +234…)</p>
							{errors.phone && <p className='text-xs text-red-400'>{errors.phone.message}</p>}
						</div>

						<div className='space-y-2'>
							<div className='flex items-center justify-between'>
								<Label htmlFor='password' className='text-neutral-300'>
									Default Account Password
								</Label>
							</div>
							<Input
								id='password'
								type='password'
								{...register('password')}
								className='bg-neutral-800/50 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-blue-500'
							/>
							{errors.password && <p className='text-xs text-red-400'>{errors.password.message}</p>}
						</div>

						<RoleMultiSelect
							roles={roles}
							selectedIds={watchedRoles ?? []}
							onChange={(ids) => setValue('roles', ids, { shouldValidate: true })}
							error={errors.roles?.message as string | undefined}
						/>

						<Button type='submit' disabled={isSubmitting} className='w-full bg-blue-600 hover:bg-blue-500'>
							{isSubmitting ?
								<Loader2 className='mr-2 h-4 w-4 animate-spin' />
							: dialogMode === 'edit' ?
								'Update Member'
							:	'Add Member'}
						</Button>
					</form>
				</DialogContent>
			</Dialog>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400'>Member</TableHead>
								<TableHead className='text-neutral-400'>Phone</TableHead>
								<TableHead className='text-neutral-400'>Roles</TableHead>
								<TableHead className='text-neutral-400'>Status</TableHead>
								<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ?
								<TableRow>
									<TableCell colSpan={5} className='text-center py-10 text-neutral-500'>
										<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-blue-400' />
										Loading members...
									</TableCell>
								</TableRow>
							: members.length === 0 ?
								<TableRow>
									<TableCell colSpan={5} className='text-center py-10 text-neutral-500'>
										No members found. Add one to get started.
									</TableCell>
								</TableRow>
							:	members.map((member) => (
									<TableRow key={member.id} className='border-neutral-800 hover:bg-neutral-800/30 transition-colors'>
										<TableCell className='font-medium text-white'>
											<div className='flex items-center gap-3'>
												<Avatar className='h-9 w-9 ring-1 ring-neutral-700'>
													<AvatarFallback className='bg-neutral-800 text-blue-400 text-xs'>
														{member.firstName[0]}
														{member.lastName[0]}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className='text-sm'>
														{member.firstName} {member.lastName}
													</p>
													<p className='text-xs text-neutral-500 font-normal'>{member.email}</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<span className='text-neutral-400 text-sm'>{member.phone?.international ?? '—'}</span>
										</TableCell>
										<TableCell>
											<div className='flex flex-wrap gap-1'>
												{getRoleNames((member.roles ?? [])?.map((r) => r?.id)).map((name) => (
													<span
														key={name}
														className='px-2 py-0.5 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium'>
														{name}
													</span>
												))}
											</div>
										</TableCell>
										<TableCell>
											<span
												className={`px-2.5 py-1 text-xs rounded-full font-medium ${
													member.status === 'ACTIVE' ?
														'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
													:	'bg-neutral-500/10 text-neutral-400 border border-neutral-500/20'
												}`}>
												{member.status}
											</span>
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
														onClick={() => openEdit(member)}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<Edit className='mr-2 h-4 w-4 text-blue-400' /> Edit Member
													</DropdownMenuItem>
													<DropdownMenuSeparator className='bg-neutral-800' />
													<DropdownMenuItem
														onClick={() => deleteMember(member.id)}
														className='hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer'>
														<Trash2 className='mr-2 h-4 w-4' /> Delete
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
			</Card>
		</div>
	);
};
