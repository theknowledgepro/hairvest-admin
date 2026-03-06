import { z } from 'zod';

export const createRoleSchema = z.object({
	title: z.string().min(2, 'Role title must be at least 2 characters'),
	summary: z.string().optional(),
	permissions: z.array(z.string()).min(1, 'At least one permission is required'),
});
export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
