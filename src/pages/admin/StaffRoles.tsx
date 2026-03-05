import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createRoleSchema, type CreateRoleFormValues } from '../../lib/schemas/staffRoles.schemas';
import {
    useStaffRolesQuery,
    useCreateRoleMutation,
    useUpdateRoleMutation,
    useDeleteRoleMutation,
} from '../../hooks/useStaffRoles';
import type { StaffRole } from '../../api/staffRoles';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Plus, Shield, Loader2, MoreHorizontal, Trash2, Edit } from 'lucide-react';

type DialogMode = 'create' | 'edit' | null;

export const StaffRoles: React.FC = () => {
    const [dialogMode, setDialogMode] = useState<DialogMode>(null);
    const [selectedRole, setSelectedRole] = useState<StaffRole | null>(null);

    const { data: roles = [], isLoading } = useStaffRolesQuery();

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
        reset,
        formState: { errors },
    } = useForm<CreateRoleFormValues>({
        resolver: zodResolver(createRoleSchema),
        defaultValues: { name: '', permissions: [] },
    });

    const openCreate = () => {
        reset({ name: '', permissions: [] });
        setDialogMode('create');
    };

    const openEdit = (role: StaffRole) => {
        setSelectedRole(role);
        reset({ name: role.name, permissions: role.permissions });
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

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Shield className="h-8 w-8 text-blue-400" /> Staff Roles
                    </h2>
                    <p className="text-neutral-400 mt-1">Manage roles and permissions for your team members.</p>
                </div>

                <Button onClick={openCreate} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                    <Plus className="mr-2 h-4 w-4" /> Add Role
                </Button>
            </div>

            {/* Create / Edit Dialog */}
            <Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
                <DialogContent className="sm:max-w-[425px] bg-neutral-900 border-neutral-800 text-white">
                    <DialogHeader>
                        <DialogTitle>{dialogMode === 'edit' ? 'Edit Role' : 'Create New Role'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label htmlFor="roleName" className="text-neutral-300">Role Name</Label>
                            <Input
                                id="roleName"
                                placeholder="e.g. Receptionist"
                                {...register('name')}
                                className="bg-neutral-800 border-neutral-700 text-white focus-visible:ring-blue-500"
                            />
                            {errors.name && (
                                <p className="text-xs text-red-400">{errors.name.message}</p>
                            )}
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-500">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : dialogMode === 'edit' ? 'Update Role' : 'Save Role'}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-neutral-900/80 border-b border-neutral-800">
                            <TableRow className="hover:bg-transparent border-neutral-800">
                                <TableHead className="text-neutral-400">Role Name</TableHead>
                                <TableHead className="text-neutral-400">Permissions</TableHead>
                                <TableHead className="text-neutral-400">Created At</TableHead>
                                <TableHead className="text-neutral-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-neutral-500">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-blue-400" />
                                        Loading roles...
                                    </TableCell>
                                </TableRow>
                            ) : roles.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-10 text-neutral-500">
                                        No roles found. Create one to get started.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                roles.map((role) => (
                                    <TableRow key={role.id} className="border-neutral-800 hover:bg-neutral-800/30 transition-colors">
                                        <TableCell className="font-medium text-white">{role.name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {role.permissions.map((p, i) => (
                                                    <span key={i} className="px-2 py-1 text-xs rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                        {p.replace('_', ' ')}
                                                    </span>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-neutral-400">{role.createdAt}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-neutral-900 border-neutral-800 text-white">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        onClick={() => openEdit(role)}
                                                        className="hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer"
                                                    >
                                                        <Edit className="mr-2 h-4 w-4 text-blue-400" /> Edit Role
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-neutral-800" />
                                                    <DropdownMenuItem
                                                        onClick={() => deleteRole(role.id)}
                                                        className="hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer"
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};
