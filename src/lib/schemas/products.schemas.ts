import { z } from 'zod';

export const productSchema = z.object({
	title: z.string().min(1, 'Product title is required'),
	summary: z.string().min(1, 'Product summary is required'),
	amount: z.coerce.number().min(0, 'Price must be 0 or more'),
	discountPercent: z.coerce.number().min(0).max(100).default(0),
	availableStock: z.coerce.number().min(0, 'Stock must be 0 or more'),
	currency: z.string().min(1, 'Currency is required'),
	category: z.string().min(1, 'Product category is required'),
	isAvailable: z.boolean().default(true),
	isFlashSale: z.boolean().default(false),
	hairLengthInches: z.array(z.string()).optional(),
	laceSizes: z.array(z.string()).optional(),
	// Images and videos will be handled via FormData manually in the component
});

export type ProductFormValues = z.infer<typeof productSchema>;
