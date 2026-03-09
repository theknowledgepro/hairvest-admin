import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse } from '@/types';

export interface StaffPermission {
	id: string;
	title: string;
	summary?: string;
	category: string;
}

export interface StaffRole {
	id: string;
	title: string;
	summary?: string;
	permissions: string[];
	updatedAt: string;
	createdAt: string;
}

export interface CreateStaffRoleReq {
	title: string;
	summary?: string;
	permissions: string[];
}

export interface UpdateStaffRoleReq {
	title: string;
	summary?: string;
	permissions: string[];
}

export const staffRolesApi = {
	getPermissions: async (): Promise<BaseAPIResponse & { data: { permissions: StaffPermission[] } }> => {
		const response = await apiClient.get(API_ROUTES.STAFF_PERMISSIONS);
		return response.data;
	},

	getRoles: async (): Promise<BaseAPIResponse & { data: { roles: StaffRole[] } }> => {
		const response = await apiClient.get(API_ROUTES.STAFF_ROLES);
		return response.data;
	},

	createRole: async (data: CreateStaffRoleReq): Promise<BaseAPIResponse & { data: { role: StaffRole } }> => {
		const response = await apiClient.post(`${API_ROUTES.STAFF_ROLES}/new`, data);
		return response.data;
	},

	updateRole: async (id: string, data: UpdateStaffRoleReq): Promise<BaseAPIResponse & { data: { role: StaffRole } }> => {
		const response = await apiClient.patch(`${API_ROUTES.STAFF_ROLES}/${id}`, data);
		return response.data;
	},

	deleteRole: async (id: string): Promise<void> => {
		await apiClient.delete(`${API_ROUTES.STAFF_ROLES}/${id}`);
	},
};
