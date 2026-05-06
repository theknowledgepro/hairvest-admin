import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { getCloudFileURL } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatCurrency';

interface ProductOverviewProps {
	summary: string;
	amount: number;
	discountPercent: number;
	currency: string;
	isFlashSale: boolean;
	productKey: string;
	images: { preview: string }[];
	title: string;
}

export const ProductOverview: React.FC<ProductOverviewProps> = ({ summary, amount, discountPercent, currency, isFlashSale, productKey, images, title }) => {
	const hasDiscount = discountPercent > 0;
	const saleAmount = hasDiscount ? amount - (amount * discountPercent) / 100 : amount;

	return (
		<Card className='bg-neutral-900/50 border-neutral-800'>
			<CardContent className=''>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					<div className='space-y-6'>
						<div>
							<h4 className='text-[12px] font-bold text-neutral-500 uppercase'>Summary</h4>
							<p className='text-neutral-200 mt-2 leading-relaxed'>{summary}</p>
						</div>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<h4 className='text-[12px] font-bold text-neutral-500 uppercase'>Price</h4>
								<div className='flex items-baseline gap-2 mt-1'>
									<p className='text-xl font-bold text-white'>{formatCurrency(saleAmount, currency)}</p>
									{hasDiscount && (
										<p className='text-xs text-neutral-500 line-through'>{formatCurrency(amount, currency)}</p>
									)}
								</div>
								{hasDiscount && (
									<div className='inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold mt-1'>
										{discountPercent}% OFF
									</div>
								)}
							</div>
							<div>
								<h4 className='text-[12px] font-bold text-neutral-500 uppercase'>Flash Sale</h4>
								<p className={`text-lg font-medium mt-1 ${isFlashSale ? 'text-yellow-400' : 'text-neutral-500'}`}>
									{isFlashSale ? 'Active' : 'No'}
								</p>
							</div>
						</div>
						<div>
							<h4 className='text-[12px] font-bold text-neutral-500 uppercase'>Product ID</h4>
							<p className='text-neutral-300 mt-1 font-mono'>{productKey}</p>
						</div>
					</div>

					<div className='space-y-4'>
						<h4 className='text-[12px] font-bold text-neutral-500 uppercase'>Images</h4>
						<div className='grid grid-cols-2 gap-4'>
							{images?.map((img, i) => (
								<div key={i} className='aspect-square rounded-xl overflow-hidden border border-neutral-800'>
									<img src={getCloudFileURL(img.preview)} alt={`${title} ${i + 1}`} className='w-full h-full object-cover' />
								</div>
							))}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
