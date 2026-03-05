import { apiClient } from './client';

export interface StaffRole {
    id: string;
    name: string;
    permissions: string[];
    createdAt: string;
}

export interface CreateStaffRoleReq {
    name: string;
    permissions: string[];
}

export interface UpdateStaffRoleReq {
    name: string;
    permissions: string[];
}

export const staffRolesApi = {
    getRoles: async (): Promise<StaffRole[]> => {
        const response = await apiClient.get<StaffRole[]>('/staff/roles');
        return response.data;
    },

    createRole: async (data: CreateStaffRoleReq): Promise<StaffRole> => {
        const response = await apiClient.post<StaffRole>('/staff/roles', data);
        return response.data;
    },

    updateRole: async (id: string, data: UpdateStaffRoleReq): Promise<StaffRole> => {
        const response = await apiClient.put<StaffRole>(`/staff/roles/${id}`, data);
        return response.data;
    },

    deleteRole: async (id: string): Promise<void> => {
        await apiClient.delete(`/staff/roles/${id}`);
    },
};
