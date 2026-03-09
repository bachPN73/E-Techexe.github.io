import { Link } from 'react-router';
import { Home, Library, Sparkles, BookOpen, LogOut, User, CreditCard, X, Globe2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AppSidebarProps {
    currentPath?: string;
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

export function AppSidebar({ currentPath = '/', isOpen = false, setIsOpen }: AppSidebarProps) {
    const [userName, setUserName] = useState('Người dùng');
    const [userRole, setUserRole] = useState('student');

    useEffect(() => {
        const stored = localStorage.getItem('edu_tech_user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUserName(parsed.name || 'Người dùng');
                setUserRole(parsed.role || 'student');
            } catch { /* ignore */ }
        }
    }, []);

    const getRoleLabel = (role: string) => {
        if (role === 'admin') return 'Admin';
        if (role === 'teacher') return 'Giáo viên';
        return 'Học sinh';
    };

    const menuItems = [
        { path: '/', label: 'Giới thiệu', icon: Globe2 },
        { path: '/dashboard', label: 'Trang chủ', icon: Home },
        { path: '/library', label: 'Thư viện', icon: Library },
        { path: '/find-ai', label: 'Find with AI', icon: Sparkles },
        { path: '/profile', label: 'Tài khoản', icon: User },
        { path: '/pricing-app', label: 'Gói dịch vụ', icon: CreditCard },

        { path: '/guide-app', label: 'Hướng dẫn', icon: BookOpen },
    ];

    const handleLogout = () => {
        localStorage.removeItem('edu_tech_user');
        window.location.href = '/';
    };

    return (
        <aside className={`fixed left-0 top-0 h-full w-64 bg-sidebar text-sidebar-foreground flex flex-col shadow-lg z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {/* Logo */}
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Edu Tech</h1>
                    <p className="text-sm text-sidebar-foreground/80 mt-1">Khoa học Tự nhiên</p>
                </div>
                {/* Nút đóng Sidebar trên Mobile */}
                <button
                    className="md:hidden text-sidebar-foreground/70 hover:text-white p-1"
                    onClick={() => setIsOpen?.(false)}
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                                }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User section */}
            <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent/30">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-white truncate">{userName}</p>
                        <p className="text-sm text-sidebar-foreground/60">{getRoleLabel(userRole)}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent/50 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm">Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}
