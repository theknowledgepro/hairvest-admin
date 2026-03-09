import { z } from 'zod';

export const productCategorySchema = z.object({
	title: z.string().min(1, 'Category title is required'),
	summary: z.string().optional(),
	isAvailable: z.boolean().default(true),
	image: z.any().optional(), // image will be handled via FormData
});

export type ProductCategoryFormValues = z.infer<typeof productCategorySchema>;
