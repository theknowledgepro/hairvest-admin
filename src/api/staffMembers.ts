import { API_ROUTES } from '@/config/routes.api';
import { apiClient } from './client';
import type { BaseAPIResponse, ImageType } from '@/types';
import type { StaffRole } from './staffRoles';

export interface StaffMember {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	phone?: {
		international: string;
		national: string;
		uri: string;
	};
	avatar?: ImageType;
	roles: StaffRole[];
	suspended: boolean;
	createdAt: string;
	updatedAt: string;
}

export type CreateStaffMemberPayload = FormData;

export interface UpdateStaffMemberReq {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	roles?: string[];
}

export const staffMembersApi = {
	getStaffMembers: async (): Promise<BaseAPIResponse & { data: { members: StaffMember[] } }> => {
		const response = await apiClient.get(API_ROUTES.STAFF_MEMBERS);
		return response.data;
	},

	getStaffMember: async (id: string): Promise<BaseAPIResponse & { data: { member: StaffMember } }> => {
		const response = await apiClient.get(`${API_ROUTES.STAFF_MEMBERS}/${id}`);
		return response.data;
	},

	addStaffMember: async (data: FormData): Promise<BaseAPIResponse & { data: { member: StaffMember } }> => {
		const response = await apiClient.post(`${API_ROUTES.STAFF_MEMBERS}/new`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	},

	updateStaffMember: async (id: string, data: FormData): Promise<BaseAPIResponse & { data: { member: StaffMember } }> => {
		const response = await apiClient.patch(`${API_ROUTES.STAFF_MEMBERS}/${id}`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		});
		return response.data;
	},

	toggleSuspension: async (id: string): Promise<BaseAPIResponse & { data: { staff: StaffMember } }> => {
		const response = await apiClient.patch(`${API_ROUTES.STAFF_MEMBERS}/${id}/suspend`);
		return response.data;
	},

	deleteStaffMember: async (id: string): Promise<void> => {
		await apiClient.delete(`${API_ROUTES.STAFF_MEMBERS}/${id}`);
	},
};
