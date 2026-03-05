import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { staffMembersApi, type CreateStaffMemberReq, type UpdateStaffMemberReq } from '../api/staffMembers';

export const STAFF_MEMBERS_QUERY_KEY = ['staff', 'members'] as const;

export const useStaffMembersQuery = () => {
    return useQuery({
        queryKey: STAFF_MEMBERS_QUERY_KEY,
        queryFn: staffMembersApi.getStaffMembers,
    });
};

export const useStaffMemberQuery = (id: string) => {
    return useQuery({
        queryKey: [...STAFF_MEMBERS_QUERY_KEY, id],
        queryFn: () => staffMembersApi.getStaffMember(id),
        enabled: !!id,
    });
};

export const useCreateMemberMutation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateStaffMemberReq) => staffMembersApi.addStaffMember(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_MEMBERS_QUERY_KEY });
            toast.success('Staff member added successfully!');
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add staff member.');
        },
    });
};

export const useUpdateMemberMutation = (onSuccess?: () => void) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateStaffMemberReq }) =>
            staffMembersApi.updateStaffMember(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_MEMBERS_QUERY_KEY });
            toast.success('Staff member updated successfully!');
            onSuccess?.();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update staff member.');
        },
    });
};

export const useDeleteMemberMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => staffMembersApi.deleteStaffMember(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: STAFF_MEMBERS_QUERY_KEY });
            toast.success('Staff member removed.');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete staff member.');
        },
    });
};
