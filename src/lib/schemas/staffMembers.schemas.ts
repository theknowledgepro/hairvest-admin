import { z } from 'zod';

// E.164 phone format: starts with + followed by country code and number (7-15 digits total)
const phoneSchema = z
	.string()
	.min(1, 'Phone number is required')
	.regex(/^\+[1-9]\d{6,14}$/, 'Phone must include a country code (e.g. +2348012345678)');

export const createMemberSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.email('Please enter a valid email address'),
	phone: phoneSchema,
	password: z.string().min(8, 'Default account password must be at least 8 characters'),
	roles: z.array(z.string()).min(1, 'Please select at least one role'),
});

export type CreateMemberFormValues = z.infer<typeof createMemberSchema>;

export const updateMemberSchema = z.object({
	firstName: z.string().min(1, 'First name is required').optional(),
	lastName: z.string().min(1, 'Last name is required').optional(),
	email: z.email('Please enter a valid email address').optional(),
	phone: phoneSchema.optional(),
	roles: z.array(z.string()).min(1, 'Please select at least one role'),
});

export type UpdateMemberFormValues = z.infer<typeof updateMemberSchema>;
