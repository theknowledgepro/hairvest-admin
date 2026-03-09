import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductFormValues } from '../../lib/schemas/products.schemas';
import { useProductQuery, useCreateProductMutation, useUpdateProductMutation } from '../../hooks/useProducts';
import { useProductCategoriesQuery } from '../../hooks/useProductCategories';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Loader2, X, Video, ArrowLeft, Trash2, Upload, Plus } from 'lucide-react';
import { VideoPlayer } from '../../components/ui/video-player';
import { getCloudFileURL } from '../../lib/utils';
import { APP_ROUTES } from '../../config/routes.app';
import type { ImageType, VideoType } from '@/types';
import { BASE_CURRENCY, MAX_IMAGE_MB, MAX_VIDEO_MB } from '@/config';
import { formatDate } from '@/lib/formatDate';
import { toast } from 'sonner';

export const ProductForm: React.FC = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const isEdit = !!id;

	const { user } = useAuthStore();
	const businessId = user?.businessId;

	const { data: productResponse, isLoading: productLoading } = useProductQuery(id);
	const { data: categoriesResponse, isLoading: categoriesLoading } = useProductCategoriesQuery(businessId || '');
	const categories = categoriesResponse?.data?.categories ?? [];
	const existingProduct = productResponse?.data?.product;

	const [images, setImages] = useState<File[]>([]);
	const [imagePreviews, setImagePreviews] = useState<string[]>([]);
	const [existingImages, setExistingImages] = useState<ImageType[]>([]);
	const [removedImages, setRemovedImages] = useState<string[]>([]);

	const [videos, setVideos] = useState<File[]>([]);
	const [existingVideos, setExistingVideos] = useState<VideoType[]>([]);
	const [removedVideos, setRemovedVideos] = useState<string[]>([]);

	const imageInputRef = useRef<HTMLInputElement>(null);
	const videoInputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		control,
		formState: { errors },
	} = useForm<ProductFormValues>({
		resolver: zodResolver(productSchema) as any,
		defaultValues: {
			title: '',
			summary: '',
			amount: 0,
			discountPercent: 0,
			availableStock: 0,
			currency: BASE_CURRENCY,
			category: '',
			isAvailable: true,
			isFlashSale: false,
			hairLengthInches: [],
			laceSizes: [],
		},
	});

	const {
		fields: hairLengthFields,
		append: appendHairLength,
		remove: removeHairLength,
	} = useFieldArray({
		control,
		name: 'hairLengthInches' as never,
	});

	const {
		fields: laceSizeFields,
		append: appendLaceSize,
		remove: removeLaceSize,
	} = useFieldArray({
		control,
		name: 'laceSizes' as never,
	});

	useEffect(() => {
		if (isEdit && existingProduct && categories.length > 0 && !categoriesLoading) {
			// Find the category in the loaded list by key or id to get the correct key for the Select
			const matchedCategory = categories.find(
				(c) =>
					c.key === existingProduct.category?.key ||
					c.key === existingProduct.category?.id ||
					c.id === existingProduct.category?.id ||
					c.id === existingProduct.category?.key,
			);

			reset({
				title: existingProduct.title,
				summary: existingProduct.summary,
				amount: existingProduct.amount,
				discountPercent: existingProduct.discountPercent,
				availableStock: existingProduct.availableStock,
				currency: existingProduct.currency,
				category: matchedCategory?.key,
				isAvailable: existingProduct.isAvailable,
				isFlashSale: existingProduct.isFlashSale ?? false,
				hairLengthInches: existingProduct.hairLengthInches || [],
				laceSizes: existingProduct.laceSizes || [],
			});
			setExistingImages(existingProduct.images || []);
			setExistingVideos(existingProduct.videos || []);
		}
	}, [isEdit, existingProduct, categories, categoriesLoading, reset]);

	const watchedIsAvailable = watch('isAvailable');
	const watchedIsFlashSale = watch('isFlashSale');
	const watchedAmount = watch('amount');
	const watchedDiscount = watch('discountPercent');
	const watchedCurrency = watch('currency');

	const sellingPrice = (watchedAmount || 0) * (1 - (watchedDiscount || 0) / 100);

	const { mutate: createProduct, isPending: isCreating } = useCreateProductMutation(() => navigate(APP_ROUTES.PRODUCTS));
	const { mutate: updateProduct, isPending: isUpdating } = useUpdateProductMutation(() => navigate(APP_ROUTES.PRODUCTS));

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const allFiles = Array.from(e.target.files || []);
		e.target.value = '';
		const validFiles: File[] = [];
		allFiles.forEach((file) => {
			if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
				toast.error(`"${file.name}" exceeds the ${MAX_IMAGE_MB}MB image size limit.`);
			} else {
				validFiles.push(file);
			}
		});
		if (validFiles.length === 0) return;
		setImages((prev) => [...prev, ...validFiles]);
		validFiles.forEach((file) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				setImagePreviews((prev) => [...prev, reader.result as string]);
			};
			reader.readAsDataURL(file);
		});
	};

	const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const allFiles = Array.from(e.target.files || []);
		e.target.value = '';
		const validFiles: File[] = [];
		allFiles.forEach((file) => {
			if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
				toast.error(`"${file.name}" exceeds the ${MAX_VIDEO_MB}MB video size limit.`);
			} else {
				validFiles.push(file);
			}
		});
		if (validFiles.length === 0) return;
		setVideos((prev) => [...prev, ...validFiles]);
	};

	const removeNewImage = (index: number) => {
		if (!confirm('Are you sure you want to delete this image?')) return;

		setImages((prev) => prev.filter((_, i) => i !== index));
		setImagePreviews((prev) => prev.filter((_, i) => i !== index));
	};

	const removeExistingImage = (key: string) => {
		if (!confirm('Are you sure you want to delete this image?')) return;

		setExistingImages((prev) => prev.filter((img) => img.key !== key));
		setRemovedImages((prev) => [...prev, key]);
	};

	const removeNewVideo = (index: number) => {
		if (!confirm('Are you sure you want to delete this video?')) return;

		setVideos((prev) => prev.filter((_, i) => i !== index));
	};

	const removeExistingVideo = (key: string) => {
		if (!confirm('Are you sure you want to delete this video?')) return;

		setExistingVideos((prev) => prev.filter((vid) => vid.key !== key));
		setRemovedVideos((prev) => [...prev, key]);
	};

	const onSubmit = (data: ProductFormValues) => {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) => {
			if (key === 'hairLengthInches' || key === 'laceSizes') {
				const arr = value as string[];
				arr.forEach((item) => {
					if (item && item.trim()) {
						formData.append(key, item.trim());
					}
				});
			} else {
				formData.append(key, String(value));
			}
		});

		images.forEach((file) => formData.append('images', file));
		videos.forEach((file) => formData.append('videos', file));

		if (isEdit) {
			removedImages.forEach((key) => formData.append('removedImages[]', key));
			removedVideos.forEach((key) => formData.append('removedVideos[]', key));
			updateProduct({ id: id as string, data: formData });
		} else {
			createProduct(formData);
		}
	};

	const isSubmitting = isCreating || isUpdating;

	if (isEdit && (productLoading || categoriesLoading)) {
		return (
			<div className='h-[60vh] flex flex-col items-center justify-center text-neutral-500'>
				<Loader2 className='h-8 w-8 animate-spin mb-4 text-blue-400' />
				<p>Loading product details...</p>
			</div>
		);
	}

	return (
		<div className='max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500'>
			<div className='flex items-center gap-4 mb-8'>
				<Button variant='ghost' size='icon' onClick={() => navigate(APP_ROUTES.PRODUCTS)} className='text-neutral-400 hover:text-white'>
					<ArrowLeft className='h-5 w-5' />
				</Button>
				<div>
					<h2 className='text-3xl font-bold tracking-tight text-white'>{isEdit ? 'Edit Product' : 'Add New Product'}</h2>
					<p className='text-neutral-400 mt-1'>Fill in the details for your product listing.</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				<div className='lg:col-span-2 space-y-8'>
					{/* Basic Information */}
					<Card className='bg-neutral-900/50 border-neutral-800'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold text-white'>Basic Information</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='title' className='text-neutral-300'>
									Product Title
								</Label>
								<Input
									id='title'
									placeholder='e.g. Bone Straight Human Hair'
									{...register('title')}
									className='bg-neutral-800 border-neutral-700 text-white'
								/>
								{errors.title && <p className='text-xs text-red-400'>{errors.title.message}</p>}
							</div>

							<div className='space-y-2'>
								<Label htmlFor='summary' className='text-neutral-300'>
									Summary
								</Label>
								<Textarea
									id='summary'
									placeholder='Detailed description of the product...'
									{...register('summary')}
									className='bg-neutral-800 border-neutral-700 text-white min-h-[150px]'
								/>
								{errors.summary && <p className='text-xs text-red-400'>{errors.summary.message}</p>}
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<Label className='text-neutral-300'>Hair Lengths (Inches)</Label>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => appendHairLength('')}
											className='h-6 text-[12px] text-blue-400 hover:text-blue-300 px-2'>
											<Plus className='h-3 w-3 mr-1' /> Add
										</Button>
									</div>
									<div className='space-y-2'>
										{hairLengthFields.map((field, index) => (
											<div key={field.id} className='flex gap-2 items-center'>
												<Input
													placeholder='e.g. 12'
													{...register(`hairLengthInches.${index}` as const)}
													className='bg-neutral-800 border-neutral-700 text-white'
												/>
												<Button
													type='button'
													variant='ghost'
													size='icon'
													onClick={() => removeHairLength(index)}
													className='h-9 w-9 text-neutral-500 hover:text-red-400'>
													<X className='h-4 w-4' />
												</Button>
											</div>
										))}
										{hairLengthFields.length === 0 && <p className='text-[13px] text-neutral-500 italic'>No hair lengths added.</p>}
									</div>
								</div>

								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<Label className='text-neutral-300'>Lace Sizes</Label>
										<Button
											type='button'
											variant='ghost'
											size='sm'
											onClick={() => appendLaceSize('')}
											className='h-6 text-[12px] text-blue-400 hover:text-blue-300 px-2'>
											<Plus className='h-3 w-3 mr-1' /> Add
										</Button>
									</div>
									<div className='space-y-2'>
										{laceSizeFields.map((field, index) => (
											<div key={field.id} className='flex gap-2 items-center'>
												<Input
													placeholder='e.g. 4x4'
													{...register(`laceSizes.${index}` as const)}
													className='bg-neutral-800 border-neutral-700 text-white'
												/>
												<Button
													type='button'
													variant='ghost'
													size='icon'
													onClick={() => removeLaceSize(index)}
													className='h-9 w-9 text-neutral-500 hover:text-red-400'>
													<X className='h-4 w-4' />
												</Button>
											</div>
										))}
										{laceSizeFields.length === 0 && <p className='text-[13px] text-neutral-500 italic'>No lace sizes added.</p>}
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Media Upload */}
					<Card className='bg-neutral-900/50 border-neutral-800'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold text-white'>Media</CardTitle>
						</CardHeader>
						<CardContent className='space-y-6'>
							{/* Images */}
							<div className='space-y-4'>
								<Label className='text-neutral-300'>Product Images</Label>
								<div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
									{/* Existing Images */}
									{existingImages.map((img) => (
										<div
											key={img.key}
											className='aspect-square rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden relative group'>
											<img src={getCloudFileURL(img.preview)} alt='Product' className='h-full w-full object-cover' />
											<button
												type='button'
												onClick={() => removeExistingImage(img.key)}
												className='absolute cursor-pointer top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
												<X className='h-3 w-3' />
											</button>
										</div>
									))}
									{/* New Previews */}
									{imagePreviews.map((src, idx) => (
										<div
											key={idx}
											className='aspect-square rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden relative group'>
											<img src={src} alt='Preview' className='h-full w-full object-cover' />
											<button
												type='button'
												onClick={() => removeNewImage(idx)}
												className='absolute cursor-pointer top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'>
												<X className='h-3 w-3' />
											</button>
										</div>
									))}
									{/* Upload Button */}
									<button
										type='button'
										onClick={() => imageInputRef.current?.click()}
										className='cursor-pointer aspect-square rounded-xl border-2 border-dashed border-neutral-700 hover:border-blue-500 bg-neutral-800/50 flex flex-col items-center justify-center transition-all'>
										<Upload className='h-6 w-6 text-neutral-500 mb-2' />
										<span className='text-[14px] text-neutral-400'>Add Image</span>
									</button>
								</div>
								<input type='file' multiple ref={imageInputRef} className='hidden' accept='image/*' onChange={handleImageChange} />
							</div>

							{/* Videos */}
							<div className='space-y-4'>
								<Label className='text-neutral-300'>Product Videos</Label>
								<div className='grid grid-cols-1 gap-4'>
									{existingVideos.map((vid, index) => (
										<div
											key={vid.key}
											className='relative rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden group aspect-video'>
											<VideoPlayer video={vid} className='w-full h-full' />
											<div className='absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-2'>
												<Video className='h-3 w-3 text-blue-400' />
												<span className='text-[11px] font-medium text-white'>Video {index + 1}</span>
											</div>
											<button
												type='button'
												onClick={() => removeExistingVideo(vid.key)}
												className='absolute cursor-pointer top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg'>
												<Trash2 className='h-4 w-4' />
											</button>
										</div>
									))}
									{/* New Videos */}
									{videos.map((vid, idx) => (
										<div
											key={idx}
											className='flex items-center justify-between p-3 rounded-xl bg-blue-500/10 border border-blue-500/20'>
											<div className='flex items-center gap-3'>
												<Video className='h-5 w-5 text-blue-400' />
												<span className='text-[14px] text-blue-400'>{vid.name}</span>
											</div>
											<button
												type='button'
												onClick={() => removeNewVideo(idx)}
												className='cursor-pointer text-red-500 hover:text-red-400'>
												<Trash2 className='h-4 w-4' />
											</button>
										</div>
									))}
									{/* Upload Button */}
									<button
										type='button'
										onClick={() => videoInputRef.current?.click()}
										className='w-full cursor-pointer py-4 rounded-xl border-2 border-dashed border-neutral-700 hover:border-blue-500 bg-neutral-800/50 flex flex-col items-center justify-center transition-all'>
										<Video className='h-6 w-6 text-neutral-500 mb-2' />
										<span className='text-[14px] text-neutral-400'>Click to upload videos</span>
									</button>
								</div>
								<input type='file' multiple ref={videoInputRef} className='hidden' accept='video/*' onChange={handleVideoChange} />
							</div>
						</CardContent>
					</Card>
				</div>

				<div className='space-y-8'>
					{/* Pricing & Stock */}
					<Card className='bg-neutral-900/50 border-neutral-800'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold text-white'>Pricing & Inventory</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<Label htmlFor='amount' className='text-neutral-300'>
										Actual Price
									</Label>
									<Input id='amount' type='number' {...register('amount')} className='bg-neutral-800 border-neutral-700 text-white' />
									{errors.amount && <p className='text-xs text-red-400'>{errors.amount.message}</p>}
								</div>
								<div className='space-y-2'>
									<Label htmlFor='currency' className='text-neutral-300'>
										Currency
									</Label>
									<Select value={watch('currency')} onValueChange={(val) => setValue('currency', val)}>
										<SelectTrigger className='bg-neutral-800 border-neutral-700 text-white'>
											<SelectValue placeholder='Select' />
										</SelectTrigger>
										<SelectContent className='bg-neutral-900 border-neutral-800 text-white'>
											<SelectItem value={BASE_CURRENCY}>NGN</SelectItem>
											<SelectItem disabled value='USD'>
												USD
											</SelectItem>
											<SelectItem disabled value='GBP'>
												GBP
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='discountPercent' className='text-neutral-300'>
									Discount Percentage (%)
								</Label>
								<Input
									id='discountPercent'
									type='number'
									{...register('discountPercent')}
									className='bg-neutral-800 border-neutral-700 text-emerald-400'
								/>
								<p className='text-[13px] text-neutral-400 mt-1.5'>
									Selling price becomes{' '}
									<span className='text-emerald-400 font-semibold'>
										{watchedCurrency} {sellingPrice.toLocaleString()}
									</span>{' '}
									calculated from actual price and discount percent.
								</p>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='availableStock' className='text-neutral-300'>
									Available Stock
								</Label>
								<Input
									id='availableStock'
									type='number'
									{...register('availableStock')}
									className='bg-neutral-800 border-neutral-700 text-white'
								/>
								{errors.availableStock && <p className='text-xs text-red-400'>{errors.availableStock.message}</p>}
							</div>
						</CardContent>
					</Card>

					{/* Organization */}
					<Card className='bg-neutral-900/50 border-neutral-800'>
						<CardHeader>
							<CardTitle className='text-lg font-semibold text-white'>Organization</CardTitle>
						</CardHeader>
						<CardContent className='space-y-4'>
							<div className='w-full space-y-2'>
								<Label className='text-neutral-300'>Category</Label>
								<Controller
									name='category'
									control={control}
									render={({ field }) => (
										<Select key={field.value} value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className='w-full bg-neutral-800 border-neutral-700 text-white'>
												<SelectValue placeholder='Select Category' />
											</SelectTrigger>
											<SelectContent className='bg-neutral-900 border-neutral-800 text-white'>
												{categories.map((cat) => (
													<SelectItem key={cat.key} value={cat.key}>
														{cat.title}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.category && <p className='text-[14px] text-red-400'>{errors.category.message}</p>}
							</div>

							<div className='flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700'>
								<div className='space-y-0.5'>
									<Label className='text-sm text-white'>Available</Label>
									<p className='text-[14px] text-neutral-400'>Show in storefront</p>
								</div>
								<Switch
									className='data-[state=checked]:bg-emerald-500!'
									checked={watchedIsAvailable}
									onCheckedChange={(checked) => setValue('isAvailable', checked)}
								/>
							</div>

							<div className='flex items-center justify-between p-3 rounded-lg bg-neutral-800/50 border border-neutral-700'>
								<div className='space-y-0.5'>
									<Label className='text-sm text-white'>Flash Sale</Label>
									<p className='text-[14px] text-neutral-400'>Make part of a flash sale event</p>
								</div>
								<Switch
									className='data-[state=checked]:bg-emerald-500!'
									checked={watchedIsFlashSale}
									onCheckedChange={(checked) => setValue('isFlashSale', checked)}
								/>
							</div>
						</CardContent>
					</Card>

					{isEdit && existingProduct && (existingProduct.createdAt || existingProduct.updatedAt) && (
						<Card className='bg-neutral-900/50 border-neutral-800'>
							<CardHeader className='pb-2'>
								<CardTitle className='text-sm font-medium text-neutral-400'>Timestamps</CardTitle>
							</CardHeader>
							<CardContent className='space-y-2'>
								{existingProduct.createdAt && (
									<div className='flex justify-between items-center flex-wrap'>
										<span className='text-[14px] text-neutral-500'>Created</span>
										<span className='text-[14px] text-neutral-300'>{formatDate(existingProduct.createdAt)}</span>
									</div>
								)}
								{existingProduct.updatedAt && (
									<div className='flex justify-between items-center flex-wrap'>
										<span className='text-[14px] text-neutral-500'>Last Edited</span>
										<span className='text-[14px] text-neutral-300'>{formatDate(existingProduct.updatedAt)}</span>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					<Button type='submit' disabled={isSubmitting} className='w-full bg-blue-600 hover:bg-blue-500 text-white h-12 text-[15px]'>
						{isSubmitting ?
							<Loader2 className='mr-2 h-5 w-5 animate-spin' />
						: isEdit ?
							'Update Product'
						:	'Publish Product'}
					</Button>
				</div>
			</form>
		</div>
	);
};
