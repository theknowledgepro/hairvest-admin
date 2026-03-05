import { z } from 'zod';

export const createMemberSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email address'),
    roleId: z.string().min(1, 'Please select a role'),
});
export type CreateMemberFormValues = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = createMemberSchema.partial().extend({
    roleId: z.string().min(1, 'Please select a role'),
});
export type UpdateMemberFormValues = z.infer<typeof updateMemberSchema>;
