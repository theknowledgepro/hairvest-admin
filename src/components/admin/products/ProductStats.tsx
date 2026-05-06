import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Package, Star, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/lib/formatCurrency';

interface ProductStatsProps {
	salesCount: number;
	salesTotal: number;
	availableStock: number;
	avgRating: number;
	reviewsCount: number;
	currency: string;
}

export const ProductStats: React.FC<ProductStatsProps> = ({ salesCount, salesTotal, availableStock, avgRating, reviewsCount, currency }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
				<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
					<CardTitle className='text-sm font-medium text-neutral-400'>Total Sales</CardTitle>
					<TrendingUp className='h-4 w-4 text-emerald-400' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-white'>{salesCount}</div>
					<p className='text-xs text-neutral-500 mt-1'>Items sold to date</p>
				</CardContent>
			</Card>
			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
				<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
					<CardTitle className='text-sm font-medium text-neutral-400'>Stock Available</CardTitle>
					<Package className='h-4 w-4 text-blue-400' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-white'>{availableStock}</div>
					<p className='text-xs text-neutral-500 mt-1'>Units in inventory</p>
				</CardContent>
			</Card>
			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
				<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
					<CardTitle className='text-sm font-medium text-neutral-400'>Average Rating</CardTitle>
					<Star className='h-4 w-4 text-yellow-400' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-white'>{avgRating?.toFixed(1)}</div>
					<p className='text-xs text-neutral-500 mt-1'>Based on {reviewsCount} reviews</p>
				</CardContent>
			</Card>
			<Card className='bg-neutral-900/50 border-neutral-800 backdrop-blur'>
				<CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
					<CardTitle className='text-sm font-medium text-neutral-400'>Revenue</CardTitle>
					<ShoppingCart className='h-4 w-4 text-purple-400' />
				</CardHeader>
				<CardContent>
					<div className='text-2xl font-bold text-white'>{formatCurrency(salesTotal, currency)}</div>
					<p className='text-xs text-neutral-500 mt-1'>Total gross revenue</p>
				</CardContent>
			</Card>
		</div>
	);
};
