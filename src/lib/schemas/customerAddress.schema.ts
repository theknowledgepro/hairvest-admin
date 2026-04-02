import { z } from 'zod';

export const customerAddressSchema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	phone: z.string().min(1, 'Phone number is required'),
	addressLine1: z.string().min(1, 'Address line 1 is required'),
	addressLine2: z.string().default(''),
	apartment: z.string().default(''),
	city: z.string().min(1, 'City is required'),
	state: z.string().min(1, 'State is required'),
	country: z.string().min(1, 'Country is required'),
	zipCode: z.string().min(1, 'Zip code is required'),
	isDefault: z.boolean().default(false),
});

export type CustomerAddressFormValues = z.infer<typeof customerAddressSchema>;
