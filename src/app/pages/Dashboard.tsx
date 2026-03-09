import { Layout } from '../components/Layout';
import { BookOpen, FlaskConical, Sprout, Sparkles, ChevronRight, PlayCircle, Box, Compass, ShieldCheck, Clock, Crown } from 'lucide-react';
import { Link } from 'react-router';
import { materials as mockMaterials, getSubjectName, Material } from '../data/materialsData';
import { useState, useEffect } from 'react';
import { api, BASE_URL } from '../services/api';

export default function Dashboard() {
    const [allMaterials, setAllMaterials] = useState<Material[]>(mockMaterials);
    const [userName, setUserName] = useState('Học sinh');
    const [userPlan, setUserPlan] = useState('free');
    const [daysRemaining] = useState(30);

    useEffect(() => {
        // Try getting user name from local storage auth data
        try {
            const authData = localStorage.getItem('auth');
            if (authData) {
                const { user } = JSON.parse(authData);
                if (user && user.name) setUserName(user.name);
                if (user && user.plan) setUserPlan(user.plan.toLowerCase());
            }
        } catch (e) { }

        const fetchModels = async () => {
            try {
                const dbModels = await api.getModels();
                const formatted: Material[] = dbModels.map((m: any) => ({
                    id: `db-${m.id}`,
                    title: m.title,
                    subject: m.subject,
                    type: '3d-model' as const,
                    description: m.description,
                    thumbnail: m.thumbnail ? `${BASE_URL}${m.thumbnail}` : '3d-placeholder',
                    tags: m.tags || [],
                    grade: m.grade || 10,
                }));
                setAllMaterials([...mockMaterials, ...formatted]);
            } catch (error) {
                console.error("Error fetching models for dashboard:", error);
            }
        };
        fetchModels();
    }, []);

    const recentMaterials = allMaterials.slice(0, 4);

    const subjects = [
        { id: 'physics', name: 'Vật lý', icon: FlaskConical, color: 'from-blue-500 to-cyan-400', shadow: 'shadow-cyan-500/20', count: allMaterials.filter(m => m.subject === 'physics').length },
        { id: 'chemistry', name: 'Hóa học', icon: FlaskConical, color: 'from-emerald-500 to-green-400', shadow: 'shadow-green-500/20', count: allMaterials.filter(m => m.subject === 'chemistry').length },
        { id: 'biology', name: 'Sinh học', icon: Sprout, color: 'from-rose-500 to-orange-400', shadow: 'shadow-orange-500/20', count: allMaterials.filter(m => m.subject === 'biology').length },
    ];

    return (
        <Layout>
            <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* 1. Hero Welcome & Search Area */}
                <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] rounded-full bg-indigo-600/20 blur-3xl"></div>
                        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[120%] rounded-full bg-blue-500/10 blur-3xl"></div>
                    </div>

                    <div className="relative p-8 md:p-12 z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex-1 space-y-6 w-full">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
                                    Chào <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{userName}</span>,
                                </h1>
                                <p className="text-slate-300 text-lg md:text-xl max-w-2xl font-medium">
                                    Chúc bạn một ngày học tập hiệu quả. Cùng khám phá không gian tri thức Edu Tech nhé!
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 mt-8 max-w-2xl">
                                <Link to="/pricing" className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all cursor-pointer group">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-transform group-hover:scale-110 ${userPlan === 'premium'
                                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-orange-500/30'
                                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30'
                                        }`}>
                                        {userPlan === 'premium' ? <Crown className="w-6 h-6 text-white" /> : <ShieldCheck className="w-6 h-6 text-white" />}
                                    </div>
                                    <div>
                                        <p className="text-slate-300 text-sm font-medium mb-1 line-clamp-1">Gói dịch vụ hiện tại</p>
                                        <p className="text-white font-bold text-lg flex items-center gap-2">
                                            {userPlan === 'premium' ? 'Premium PRO' : 'Cơ bản (Free)'}
                                            {userPlan === 'premium' && <Sparkles className="w-4 h-4 text-amber-300" />}
                                        </p>
                                    </div>
                                </Link>

                                <div className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-all group">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 transition-transform group-hover:scale-110">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-slate-300 text-sm font-medium mb-1 line-clamp-1">Thời gian sử dụng</p>
                                        <p className="text-white font-bold text-lg">
                                            {userPlan === 'premium' ? `Còn ${daysRemaining} ngày` : 'Vĩnh viễn'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hidden lg:flex relative w-64 h-64 shrink-0 items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse-slow border border-white/10 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                                <Compass className="w-32 h-32 text-indigo-300/80 drop-shadow-2xl" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Feature Highlights (Super Actions) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        to="/find-ai"
                        className="group relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0 text-white group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">Tìm kiếm với AI</h2>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                    Không nhớ tên mô hình? Hãy mô tả bằng văn bản, trợ lý AI sẽ gợi ý tài liệu học tập chuẩn xác nhất.
                                </p>
                                <span className="inline-flex items-center text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg group-hover:bg-indigo-100 transition-colors">
                                    Khám phá <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/library"
                        className="group relative overflow-hidden rounded-3xl p-6 md:p-8 bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute -right-8 -top-8 w-40 h-40 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row items-start gap-6">
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 shrink-0 text-white group-hover:scale-110 transition-transform duration-300">
                                <BookOpen className="w-7 h-7 md:w-8 md:h-8" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">Thư Viện Trực Quan</h2>
                                <p className="text-slate-500 text-sm leading-relaxed mb-4">
                                    Duyệt qua không gian 3D tương tác và infographic sinh động, chia theo môn học và lớp học.
                                </p>
                                <span className="inline-flex items-center text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    Mở thư viện <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* 3. Browse by Subjects */}
                <div>
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        Khám phá bộ môn
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {subjects.map((subject) => {
                            const Icon = subject.icon;
                            return (
                                <Link
                                    key={subject.id}
                                    to={`/library?subject=${subject.id}`}
                                    className="group relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="relative z-10 flex items-center justify-between">
                                        <div className="flex-1 pr-4">
                                            <p className="text-sm font-medium text-slate-500 mb-1">{subject.count} học liệu</p>
                                            <h3 className="text-xl font-bold text-slate-800 transition-colors">{subject.name}</h3>
                                        </div>
                                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${subject.color} flex items-center justify-center text-white shadow-lg ${subject.shadow} group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    {/* Decorative background shape */}
                                    <div className={`absolute -right-6 -bottom-6 w-24 h-24 bg-gradient-to-br ${subject.color} opacity-10 rounded-full blur-xl group-hover:opacity-20 transition-opacity pointer-events-none`}></div>
                                </Link>
                            )
                        })}
                    </div>
                </div>

                {/* 4. Recent/Trending Materials */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            Tiếp tục học tập
                        </h2>
                        <Link to="/library" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline">
                            Xem tất cả &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {recentMaterials.map((material) => (
                            <Link
                                key={material.id}
                                to={`/material/${material.id}`}
                                className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                                    {material.thumbnail && material.thumbnail !== '3d-placeholder' ? (
                                        <img
                                            src={material.thumbnail.startsWith('http') ? material.thumbnail : (material.thumbnail.startsWith('/') ? `${BASE_URL}${material.thumbnail}` : material.thumbnail)}
                                            alt={material.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 group-hover:scale-105 transition-transform duration-500">
                                            <Box className="w-12 h-12 text-indigo-200" />
                                        </div>
                                    )}

                                    {/* Type badge */}
                                    <div className="absolute top-3 left-3 flex gap-2">
                                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-sm backdrop-blur-md uppercase tracking-wider ${material.subject === 'physics' ? 'bg-cyan-500/90 text-white' :
                                            material.subject === 'chemistry' ? 'bg-emerald-500/90 text-white' :
                                                'bg-orange-500/90 text-white'
                                            }`}>
                                            {getSubjectName(material.subject)}
                                        </span>
                                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-md text-[11px] font-bold text-slate-700 shadow-sm uppercase tracking-wider">
                                            {material.type === '3d-model' ? '3D' : 'Info'}
                                        </span>
                                    </div>

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                                        <PlayCircle className="w-16 h-16 text-white drop-shadow-lg" strokeWidth={1.5} />
                                    </div>
                                </div>
                                <div className="p-3 sm:p-5 flex-1 flex flex-col">
                                    <h3 className="font-semibold sm:font-bold text-slate-800 text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">{material.title}</h3>
                                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 mb-2 sm:mb-4 flex-1">
                                        {material.description}
                                    </p>
                                    <div className="mt-auto">
                                        <span className="text-xs font-medium text-slate-400">Dành cho Khối {material.grade}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </Layout>
    );
}
