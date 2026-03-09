import { AdminLayout } from '../../components/admin/AdminLayout';
import { Users, Box, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        usersCount: 0,
        materialsCount: 0,
        adminsCount: 0,
    });
    const [isLoading, setIsLoading] = useState(true);

    // Mock data for Growth Chart (Last 6 Months)
    const growthData = [
        { name: 'Tháng 10', users: 120, materials: 45 },
        { name: 'Tháng 11', users: 180, materials: 80 },
        { name: 'Tháng 12', users: 250, materials: 110 },
        { name: 'Tháng 1', users: 310, materials: 156 },
        { name: 'Tháng 2', users: 480, materials: 210 },
        { name: 'Tháng 3', users: 650, materials: 280 },
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [users, models] = await Promise.all([
                    api.getUsers(),
                    api.getModels()
                ]);

                setStats({
                    usersCount: users.length,
                    materialsCount: models.length,
                    adminsCount: users.filter((u: any) => u.role === 'admin').length,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { title: 'Tổng số Người Dùng', value: stats.usersCount, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Tài Khoản Admin', value: stats.adminsCount, icon: Activity, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { title: 'Tổng số Học Liệu', value: stats.materialsCount, icon: Box, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Tăng Trưởng (30 ngày)', value: '+14%', icon: TrendingUp, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    ];

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center flex-col items-center h-[60vh] gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm">Đang tải dữ liệu tổng quan...</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Tổng Quan Hệ Thống</h1>
                <p className="text-slate-500 text-sm mt-1">Cập nhật nhanh các chỉ số hoạt động của Edu Tech.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover-lift flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-2 md:mb-4">
                                <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-3xl font-bold text-slate-800 mb-0.5 md:mb-1">{stat.value}</h3>
                                <p className="text-[10px] md:text-sm text-slate-500 font-medium line-clamp-1">{stat.title}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 h-96 hover-lift">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Biểu Đồ Tăng Trưởng</h3>
                        <p className="text-sm text-slate-500">Người dùng mới & Học liệu (6 tháng qua)</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-indigo-500"></span>
                            <span className="text-slate-600 font-medium">Người dùng</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                            <span className="text-slate-600 font-medium">Học liệu</span>
                        </div>
                    </div>
                </div>

                <div className="h-[calc(100%-4rem)] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={growthData}
                            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorMaterials" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 13 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 13 }}
                                dx={-10}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 600 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="users"
                                name="Người dùng"
                                stroke="#6366f1"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorUsers)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="materials"
                                name="Học liệu"
                                stroke="#10b981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorMaterials)"
                                activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    );
}
