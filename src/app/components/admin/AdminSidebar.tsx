import { Link } from 'react-router';
import { LayoutDashboard, Users, Box, LogOut, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AdminSidebarProps {
    currentPath?: string;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

export function AdminSidebar({ currentPath = '/admin/dashboard', isOpen = false, setIsOpen }: AdminSidebarProps) {
    const [userName, setUserName] = useState('Admin');

    useEffect(() => {
        const stored = localStorage.getItem('edu_tech_user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUserName(parsed.name || 'Admin');
            } catch { /* ignore */ }
        }
    }, []);

    const menuItems = [
        { path: '/admin/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
        { path: '/admin/materials', label: 'Quản lý học liệu', icon: Box },
        { path: '/admin/users', label: 'Quản lý người dùng', icon: Users },
    ];

    const handleLogout = () => {
        localStorage.removeItem('edu_tech_user');
        window.location.href = '/';
    };

    return (
        <aside className={`fixed left-0 top-0 h-full w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Logo */}
            <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <LayoutDashboard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-indigo-400">Panel</span></h1>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Edu Tech</p>
                    </div>
                </div>
                {/* Nút đóng cho Mobile */}
                <button
                    className="md:hidden text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
                    onClick={() => setIsOpen?.(false)}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-4">
                    Menu Chính
                </div>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    // Check if currentPath starts with item.path to highlight sub-routes too
                    const isActive = currentPath === item.path || (currentPath !== '/admin/dashboard' && currentPath.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                                : 'hover:bg-slate-800 hover:text-white'
                                }`}
                        >
                            <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold shadow-inner">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate text-sm">{userName}</p>
                        <p className="text-xs text-emerald-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors group"
                >
                    <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}
