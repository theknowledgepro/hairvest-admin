import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productCategorySchema, type ProductCategoryFormValues } from '../../lib/schemas/productCategories.schemas';
import {
	useProductCategoriesQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useToggleCategoryAvailabilityMutation,
} from '../../hooks/useProductCategories';
import { useAuthStore } from '../../store/useAuthStore';
import type { ProductCategory } from '../../api/productCategories';
import { Card, CardContent } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Button } from '../../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import { Plus, Layers, Loader2, MoreHorizontal, Trash2, Edit, Image as ImageIcon } from 'lucide-react';
import { getCloudFileURL } from '../../lib/utils';
import { MAX_IMAGE_MB } from '@/config';
import { toast } from 'sonner';

type DialogMode = 'create' | 'edit' | null;

export const ProductCategories: React.FC = () => {
	const [dialogMode, setDialogMode] = useState<DialogMode>(null);
	const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const { user } = useAuthStore();
	const businessId = user?.businessId;

	const { data: categoriesResponse, isLoading } = useProductCategoriesQuery(businessId);
	const categories = categoriesResponse?.data?.categories ?? [];

	const closeDialog = () => {
		setDialogMode(null);
		setSelectedCategory(null);
		setImagePreview(null);
		reset();
	};

	const { mutate: createCategory, isPending: isCreating } = useCreateCategoryMutation(closeDialog);
	const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategoryMutation(closeDialog);
	const { mutate: deleteCategory } = useDeleteCategoryMutation();
	const { mutate: toggleAvailability, isPending: isToggling } = useToggleCategoryAvailabilityMutation();

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<ProductCategoryFormValues>({
		resolver: zodResolver(productCategorySchema) as any,
		defaultValues: { title: '', summary: '', isAvailable: true },
	});

	const watchedIsAvailable = watch('isAvailable');

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
				return toast.error(`"${file.name}" exceeds the ${MAX_IMAGE_MB}MB image size limit.`);
			}

			setValue('image', file);
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const openCreate = () => {
		reset({ title: '', summary: '', isAvailable: true });
		setImagePreview(null);
		setDialogMode('create');
	};

	const openEdit = (category: ProductCategory) => {
		setSelectedCategory(category);
		reset({
			title: category.title,
			summary: category.summary || '',
			isAvailable: category.isAvailable,
		});
		setImagePreview(category.image?.preview ? (getCloudFileURL(category.image.preview) ?? null) : null);
		setDialogMode('edit');
	};

	const onSubmit = (data: ProductCategoryFormValues) => {
		const formData = new FormData();
		formData.append('title', data.title);
		if (data.summary) formData.append('summary', data.summary);
		formData.append('isAvailable', String(data.isAvailable));
		if (data.image instanceof File) {
			formData.append('thumbnail', data.image);
		}

		if (dialogMode === 'create') {
			createCategory(formData);
		} else if (dialogMode === 'edit' && selectedCategory) {
			updateCategory({ id: selectedCategory.key, data: formData });
		}
	};

	const isSubmitting = isCreating || isUpdating;

	return (
		<div className='animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white flex items-center gap-2'>
						<Layers className='h-8 w-8 text-purple-400' /> Product Categories
					</h2>
					<p className='text-neutral-400 mt-1'>Organize your products into meaningful categories.</p>
				</div>

				<Button onClick={openCreate} className='bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/20'>
					<Plus className='h-4 w-4' /> Add Category
				</Button>
			</div>

			<Dialog open={dialogMode !== null} onOpenChange={(open) => !open && closeDialog()}>
				<DialogContent className='sm:max-w-[480px] bg-neutral-900 border-neutral-800 text-white'>
					<DialogHeader>
						<DialogTitle>{dialogMode === 'edit' ? 'Edit Category' : 'Add New Category'}</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4 mt-4'>
						<div className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='title' className='text-neutral-300'>
									Category Title
								</Label>
								<Input
									id='title'
									placeholder='e.g. Human Hair Wigs'
									{...register('title')}
									className='bg-neutral-800 border-neutral-700 text-white'
								/>
								{errors.title && <p className='text-xs text-red-400'>{errors.title.message}</p>}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='summary' className='text-neutral-300'>
									Summary (Optional)
								</Label>
								<Textarea
									id='summary'
									placeholder='Brief description of the category...'
									{...register('summary')}
									className='bg-neutral-800 border-neutral-700 text-white min-h-[100px]'
								/>
							</div>

							<div className='flex flex-col items-center justify-center'>
								<Label className='text-neutral-300 self-start mb-2'>Category Image</Label>
								<div
									onClick={() => fileInputRef.current?.click()}
									className='w-full min-h-40 h-full max-h-[200px] rounded-xl border-2 border-dashed border-neutral-700 hover:border-purple-500 bg-neutral-800/50 flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden relative group'>
									{imagePreview ?
										<>
											<img src={imagePreview} alt='Preview' className='w-full h-full object-contain' />
											<div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
												<Edit className='h-6 w-6 text-white' />
											</div>
										</>
									:	<div className='flex flex-col items-center text-neutral-400'>
											<ImageIcon className='h-10 w-10 mb-2' />
											<p className='text-[14px]'>Click to upload image</p>
										</div>
									}
								</div>
								<input type='file' ref={fileInputRef} className='hidden' accept='image/*' onChange={handleImageChange} />
							</div>

							<div className='flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700'>
								<div className='space-y-0.5'>
									<Label className='text-sm text-white'>Available</Label>
									<p className='text-[14px] text-neutral-400'>Show this category in the storefront</p>
								</div>
								<Switch
									className='data-[state=checked]:bg-emerald-500!'
									checked={watchedIsAvailable}
									onCheckedChange={(checked: boolean) => setValue('isAvailable', checked)}
								/>
							</div>
						</div>

						<Button type='submit' disabled={isSubmitting} className='w-full bg-purple-600 hover:bg-purple-500 text-white'>
							{isSubmitting ?
								<Loader2 className='mr-2 h-4 w-4 animate-spin text-white' />
							: dialogMode === 'edit' ?
								'Update Category'
							:	'Create Category'}
						</Button>
					</form>
				</DialogContent>
			</Dialog>

			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur p-0'>
				<CardContent className='p-0'>
					<Table>
						<TableHeader className='bg-neutral-900/80 border-b border-neutral-800'>
							<TableRow className='hover:bg-transparent border-neutral-800'>
								<TableHead className='text-neutral-400 w-[100px]'>Image</TableHead>
								<TableHead className='text-neutral-400'>Category</TableHead>
								<TableHead className='text-neutral-400'>Status</TableHead>
								<TableHead className='text-neutral-400 text-right'>Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ?
								<TableRow>
									<TableCell colSpan={4} className='text-center py-10 text-neutral-500'>
										<Loader2 className='h-6 w-6 animate-spin mx-auto mb-2 text-purple-400' />
										Loading categories...
									</TableCell>
								</TableRow>
							: categories.length === 0 ?
								<TableRow>
									<TableCell colSpan={4} className='text-center py-10 text-neutral-500'>
										No categories found. Add one to get started.
									</TableCell>
								</TableRow>
							:	categories.map((category) => (
									<TableRow key={category.id} className='border-neutral-800 hover:bg-neutral-800/30 transition-colors'>
										<TableCell>
											<div className='h-12 w-12 rounded-[5px] bg-neutral-800 border-neutral-700 overflow-hidden'>
												{category.image ?
													<img
														src={getCloudFileURL(category.image.thumbnail)}
														alt={category.title}
														className='h-full w-full object-cover'
													/>
												:	<div className='h-full w-full flex items-center justify-center'>
														<ImageIcon className='h-5 w-5 text-neutral-600' />
													</div>
												}
											</div>
										</TableCell>
										<TableCell className='font-medium text-white'>
											<div>
												<p className='text-sm'>{category.title}</p>
												{category.summary && (
													<p className='text-[14px] text-neutral-400 font-normal line-clamp-1'>{category.summary}</p>
												)}
											</div>
										</TableCell>
										<TableCell>
											<div className='flex items-center gap-3'>
												<Switch
													className='data-[state=checked]:bg-emerald-500!'
													disabled={isToggling}
													checked={category.isAvailable}
													onCheckedChange={() => toggleAvailability(category.key)}
												/>
												<span
													className={`text-[14px] font-medium transition-colors ${
														category.isAvailable ? 'text-emerald-400' : 'text-neutral-500'
													}`}>
													{category.isAvailable ? 'Active' : 'Hidden'}
												</span>
											</div>
										</TableCell>
										<TableCell className='text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button variant='ghost' className='h-8 w-8 p-0 text-neutral-400 hover:text-white hover:bg-neutral-800'>
														<span className='sr-only'>Open menu</span>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='bg-neutral-900 border-neutral-800 text-white'>
													<DropdownMenuLabel>Actions</DropdownMenuLabel>
													<DropdownMenuItem
														onClick={() => openEdit(category)}
														className='hover:bg-neutral-800 focus:bg-neutral-800 focus:text-white cursor-pointer'>
														<Edit className='mr-2 h-4 w-4 text-purple-400' /> Edit Category
													</DropdownMenuItem>
													<DropdownMenuSeparator className='bg-neutral-800' />
													<DropdownMenuItem
														onClick={() => {
															if (confirm('Are you sure you want to delete this category?')) {
																deleteCategory(category.key);
															}
														}}
														className='hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400 text-red-400 cursor-pointer'>
														<Trash2 className='mr-2 h-4 w-4' /> Delete
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
};
