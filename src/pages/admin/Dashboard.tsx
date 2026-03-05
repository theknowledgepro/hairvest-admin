import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Users, Shield, TrendingUp, Activity } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const stats = [
        { title: 'Total Staff', value: '24', icon: Users, trend: '+12%', color: 'text-blue-400' },
        { title: 'Roles Defined', value: '6', icon: Shield, trend: 'Stable', color: 'text-purple-400' },
        { title: 'Active Sessions', value: '143', icon: Activity, trend: '+5%', color: 'text-emerald-400' },
        { title: 'New Customers', value: '1,204', icon: TrendingUp, trend: '+18%', color: 'text-orange-400' },
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
                <p className="text-neutral-400 mt-1">Metrics and quick insights for your business.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-neutral-900/50 border-neutral-800 backdrop-blur transition-all duration-300 hover:border-neutral-700 hover:shadow-lg hover:shadow-black/20 group">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-neutral-400">{stat.title}</CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-transform`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                            <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                                <span className={stat.trend.startsWith('+') ? 'text-emerald-400' : 'text-neutral-400'}>{stat.trend}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Placeholder for charts or recent activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-2 bg-neutral-900/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-neutral-200">Activity Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center text-neutral-500 border border-neutral-800 border-dashed rounded-lg mx-6 mb-6">
                        Chart Visualization (Coming Soon)
                    </CardContent>
                </Card>
                <Card className="bg-neutral-900/50 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-neutral-200">Recent Login History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-neutral-800 flex items-center justify-center border border-neutral-700">
                                            <Users className="h-4 w-4 text-neutral-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-neutral-200">Admin User {i}</p>
                                            <p className="text-xs text-neutral-500">2 mins ago • USA</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
