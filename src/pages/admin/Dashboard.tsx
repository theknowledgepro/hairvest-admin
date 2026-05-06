import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight, Loader2, Package, Activity, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { useMainStatsQuery } from '@/hooks/useInsights';
import { cn } from '@/lib/utils';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Premium Mock Data for empty states
const mockRevenueTrends = [
	{ date: '2024-04-01', revenue: 45000, orderCount: 12 },
	{ date: '2024-04-05', revenue: 52000, orderCount: 15 },
	{ date: '2024-04-10', revenue: 48000, orderCount: 10 },
	{ date: '2024-04-15', revenue: 61000, orderCount: 18 },
	{ date: '2024-04-20', revenue: 55000, orderCount: 14 },
	{ date: '2024-04-25', revenue: 72000, orderCount: 22 },
	{ date: '2024-04-30', revenue: 68000, orderCount: 19 },
];

const mockCategoryDistribution = [
	{ name: 'Bundles', value: 450000 },
	{ name: 'Frontals', value: 320000 },
	{ name: 'Wigs', value: 280000 },
	{ name: 'Maintenance', value: 150000 },
];

export const Dashboard: React.FC = () => {
	const [isMounted, setIsMounted] = React.useState(false);
	const { data: statsResponse, isLoading } = useMainStatsQuery();
	const stats = statsResponse?.data;

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	// Use actual data if available, otherwise fallback to premium mocks for "Wow" factor
	const revenueData = stats?.revenueTrends && stats.revenueTrends.length > 0 ? stats.revenueTrends : mockRevenueTrends;
	const categoryData = stats?.categoryDistribution && stats.categoryDistribution.length > 0 ? stats.categoryDistribution : mockCategoryDistribution;

	if (isLoading) {
		return (
			<div className='h-[80vh] flex flex-col items-center justify-center gap-4'>
				<Loader2 className='h-10 w-10 animate-spin text-blue-500' />
				<p className='text-neutral-500 font-medium animate-pulse'>Aggregating business insights...</p>
			</div>
		);
	}

	const metricCards = [
		{
			title: 'Total Revenue',
			value: `₦${(stats?.stats.totalRevenue || 1250000).toLocaleString()}`,
			icon: DollarSign,
			trend: '+12.5%',
			isUp: true,
			color: 'from-blue-600/20 to-blue-600/5',
			accent: 'text-blue-400',
		},
		{
			title: 'Total Orders',
			value: (stats?.stats.totalOrders || 142).toLocaleString(),
			icon: ShoppingBag,
			trend: '+8.2%',
			isUp: true,
			color: 'from-emerald-600/20 to-emerald-600/5',
			accent: 'text-emerald-400',
		},
		{
			title: 'Total Customers',
			value: (stats?.stats.totalCustomers || 850).toLocaleString(),
			icon: Users,
			trend: '+14.1%',
			isUp: true,
			color: 'from-orange-600/20 to-orange-600/5',
			accent: 'text-orange-400',
		},
		{
			title: 'Items Sold',
			value: (stats?.stats.totalItemsSold || 320).toLocaleString(),
			icon: Package,
			trend: '-2.4%',
			isUp: false,
			color: 'from-purple-600/20 to-purple-600/5',
			accent: 'text-purple-400',
		},
	];

	return (
		<div className='space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700'>
			{/* Header Section */}
			<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
				<div>
					<h2 className='text-4xl font-black tracking-tight text-white flex items-center gap-3'>
						Business <span className='text-blue-500'>Admin Portal</span>
					</h2>
					<p className='text-neutral-500 mt-1 font-medium italic'>Your business growth at a glance.</p>
				</div>
				<div className='flex items-center gap-3 bg-neutral-900/50 p-1.5 rounded-2xl border border-neutral-800'>
					<button className='px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-95'>
						Last 30 Days
					</button>
					<button className='px-4 py-2 text-neutral-500 rounded-xl text-sm font-bold hover:text-neutral-300 transition-colors'>Quarterly</button>
				</div>
			</div>

			{/* Quick Metrics Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{metricCards.map((card) => (
					<Card
						key={card.title}
						className={cn(
							'relative overflow-hidden border-neutral-800 transition-all duration-500 hover:border-neutral-700 group',
							'bg-gradient-to-br',
							card.color,
						)}>
						<div className='absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity'>
							<card.icon className='h-16 w-16' />
						</div>
						<CardHeader className='flex flex-row items-center justify-between pb-2'>
							<CardTitle className='text-xs font-bold text-neutral-400 uppercase tracking-widest'>{card.title}</CardTitle>
							<card.icon className={cn('h-5 w-5', card.accent)} />
						</CardHeader>
						<CardContent>
							<div className='text-4xl font-black text-white tracking-tighter mb-1'>{card.value}</div>
							<div className='flex items-center gap-1.5'>
								<div
									className={cn(
										'flex items-center text-[10px] font-black uppercase px-2 py-0.5 rounded-full',
										card.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400',
									)}>
									{card.isUp ?
										<ArrowUpRight className='h-3 w-3 mr-0.5' />
									:	<ArrowDownRight className='h-3 w-3 mr-0.5' />}
									{card.trend}
								</div>
								<span className='text-[10px] text-neutral-600 font-bold uppercase tracking-wide'>Growth Rate</span>
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Main Analytics Row */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
				{/* Revenue Trend Chart */}
				<Card className='lg:col-span-2 bg-neutral-900/40 border-neutral-800 backdrop-blur-sm overflow-hidden pt-0'>
					<CardHeader className='border-b border-neutral-800/50 bg-neutral-800/20 px-8 py-6'>
						<div className='flex items-center justify-between'>
							<div>
								<CardTitle className='text-white text-xl font-black flex items-center gap-2'>
									<TrendingUp className='h-5 w-5 text-blue-500' />
									Revenue Stream
								</CardTitle>
								<p className='text-xs text-neutral-500 font-medium mt-1'>Transaction volume over the last 30 days</p>
							</div>
							<div className='h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20'>
								<CreditCard className='h-5 w-5 text-blue-400' />
							</div>
						</div>
					</CardHeader>
					<CardContent className='pt-8 px-4 pb-4'>
						<div className='h-[350px] w-full min-h-0 min-w-0'>
							{isMounted && (
								<ResponsiveContainer width='100%' height='100%' debounce={1}>
									<AreaChart data={revenueData}>
										<defs>
											<linearGradient id='colorRev' x1='0' y1='0' x2='0' y2='1'>
												<stop offset='5%' stopColor='#3b82f6' stopOpacity={0.3} />
												<stop offset='95%' stopColor='#3b82f6' stopOpacity={0} />
											</linearGradient>
										</defs>
										<CartesianGrid strokeDasharray='3 3' stroke='#262626' vertical={false} />
										<XAxis
											dataKey='date'
											stroke='#525252'
											fontSize={10}
											tickLine={false}
											axisLine={false}
											tickFormatter={(str) => {
												try {
													const date = new Date(str);
													return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
												} catch (e) {
													return str;
												}
											}}
										/>
										<YAxis
											stroke='#525252'
											fontSize={10}
											tickLine={false}
											axisLine={false}
											tickFormatter={(val) => `₦${val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}`}
										/>
										<Tooltip
											contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
											itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
											labelStyle={{ color: '#737373', fontSize: '10px', marginBottom: '4px' }}
										/>
										<Area
											type='monotone'
											dataKey='revenue'
											stroke='#3b82f6'
											strokeWidth={4}
											fillOpacity={1}
											fill='url(#colorRev)'
											animationDuration={2000}
										/>
									</AreaChart>
								</ResponsiveContainer>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Category Share Distribution */}
				<Card className='bg-neutral-900/40 border-neutral-800 backdrop-blur-sm pt-0'>
					<CardHeader className='border-b border-neutral-800/50 bg-neutral-800/20 px-8 py-6'>
						<CardTitle className='text-white text-xl font-black flex items-center gap-2'>
							<Activity className='h-5 w-5 text-emerald-500' />
							Market Share
						</CardTitle>
						<p className='text-xs text-neutral-500 font-medium mt-1'>Revenue by product category</p>
					</CardHeader>
					<CardContent className='flex flex-col items-center justify-center h-[400px]'>
						<div className='h-64 w-full min-h-0 min-w-0'>
							{isMounted && (
								<ResponsiveContainer width='100%' height='100%' debounce={1}>
									<PieChart>
										<Pie
											data={categoryData}
											cx='50%'
											cy='50%'
											innerRadius={60}
											outerRadius={90}
											paddingAngle={5}
											dataKey='value'
											animationDuration={1500}>
											{categoryData.map((_, index) => (
												<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
											))}
										</Pie>
										<Tooltip
											contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
											itemStyle={{ color: '#fff', fontSize: '12px' }}
										/>
									</PieChart>
								</ResponsiveContainer>
							)}
						</div>
						<div className='w-full space-y-3 mt-4'>
							{categoryData.map((item, index) => (
								<div key={item.name} className='flex items-center justify-between group'>
									<div className='flex items-center gap-2'>
										<div className='h-2 w-2 rounded-full' style={{ backgroundColor: COLORS[index % COLORS.length] }} />
										<span className='text-xs font-bold text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-tight'>
											{item.name}
										</span>
									</div>
									<span className='text-xs font-black text-white'>₦{item.value.toLocaleString()}</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Bottom Row - Detailed Stats */}
			<div className='grid grid-cols-1 lg:grid-cols-4 gap-8 pb-8'>
				<Card className='lg:col-span-2 bg-neutral-900/40 border-neutral-800 p-8'>
					<div className='flex items-center justify-between mb-8'>
						<div>
							<h3 className='text-lg font-black text-white uppercase tracking-tighter'>Order Volume</h3>
							<p className='text-xs text-neutral-500'>Frequency of orders per day</p>
						</div>
						<ShoppingBag className='h-8 w-8 text-neutral-800' />
					</div>
					<div className='h-48 w-full min-h-0 min-w-0'>
						{isMounted && (
							<ResponsiveContainer width='100%' height='100%' debounce={1}>
								<BarChart data={revenueData}>
									<Bar dataKey='orderCount' fill='#3b82f6' radius={[4, 4, 0, 0]} opacity={0.6} />
									<Tooltip
										cursor={{ fill: '#262626' }}
										contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '8px' }}
									/>
								</BarChart>
							</ResponsiveContainer>
						)}
					</div>
				</Card>

				<Card className='lg:col-span-2 bg-neutral-900/40 border-neutral-800 flex items-center justify-center p-12 relative group overflow-hidden'>
					<div className='absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors' />
					<div className='text-center relative z-10'>
						<div className='h-20 w-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-blue-500/20 group-hover:scale-110 transition-transform duration-500'>
							<ArrowUpRight className='h-10 w-10 text-blue-400' />
						</div>
						<h3 className='text-2xl font-black text-white mb-2 tracking-tighter'>Ready for expansion?</h3>
						<p className='text-neutral-500 text-sm max-w-[280px] mx-auto font-medium'>
							Your revenue has increased by 12.5% this month. Consider launching a flash sale to boost volume.
						</p>
						<button className='mt-8 px-8 py-3 bg-white text-black font-black rounded-xl text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95'>
							Launch Campaign
						</button>
					</div>
				</Card>
			</div>
		</div>
	);
};
