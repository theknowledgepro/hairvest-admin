import { apiClient } from './client';

export interface StaffMember {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface CreateStaffMemberReq {
    firstName: string;
    lastName: string;
    email: string;
    roleId: string;
}

export interface UpdateStaffMemberReq {
    firstName?: string;
    lastName?: string;
    email?: string;
    roleId?: string;
}

export const staffMembersApi = {
    getStaffMembers: async (): Promise<StaffMember[]> => {
        const response = await apiClient.get<StaffMember[]>('/staff/members');
        return response.data;
    },

    getStaffMember: async (id: string): Promise<StaffMember> => {
        const response = await apiClient.get<StaffMember>(`/staff/members/${id}`);
        return response.data;
    },

    addStaffMember: async (data: CreateStaffMemberReq): Promise<StaffMember> => {
        const response = await apiClient.post<StaffMember>('/staff/members', data);
        return response.data;
    },

    updateStaffMember: async (id: string, data: UpdateStaffMemberReq): Promise<StaffMember> => {
        const response = await apiClient.put<StaffMember>(`/staff/members/${id}`, data);
        return response.data;
    },

    deleteStaffMember: async (id: string): Promise<void> => {
        await apiClient.delete(`/staff/members/${id}`);
    },
};
