import { z } from 'zod';

export const createRoleSchema = z.object({
    name: z.string().min(2, 'Role name must be at least 2 characters'),
    permissions: z.array(z.string()),
});
export type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export const updateRoleSchema = createRoleSchema;
export type UpdateRoleFormValues = z.infer<typeof updateRoleSchema>;
