import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { staffRolesApi, type CreateStaffRoleReq, type UpdateStaffRoleReq } from '../api/staffRoles';

export const STAFF_ROLES_QUERY_KEY = ['staff', 'roles'] as const;

export const useStaffRolesQuery = () => {
    return useQuery({
        queryKey: STAFF_ROLES_QUERY_KEY,
        queryFn: staffRolesApi.getRoles,
    });
};

export const useCreateRoleMutation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStaffRoleReq) => staffRolesApi.createRole(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_ROLES_QUERY_KEY });
            toast.success('Role created successfully!');
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create role.');
        },
    });
};

export const useUpdateRoleMutation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStaffRoleReq }) =>
            staffRolesApi.updateRole(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_ROLES_QUERY_KEY });
            toast.success('Role updated successfully!');
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update role.');
        },
    });
};

export const useDeleteRoleMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => staffRolesApi.deleteRole(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_ROLES_QUERY_KEY });
            toast.success('Role deleted.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete role.');
        },
    });
};
