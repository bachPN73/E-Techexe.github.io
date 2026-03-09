import { Link, useLocation, useNavigate } from "react-router";
import {
    LayoutDashboard,
    Library as LibraryIcon,
    Sparkles,
    FolderOpen,
    LogOut
} from "lucide-react";

interface SidebarProps {
    userRole: "teacher" | "student";
    collapsed?: boolean;
}

export default function Sidebar({ userRole, collapsed = false }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Mock logout logic
        navigate("/");
    };

    const teacherMenuItems = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/dashboard/teacher",
            tooltip: "Trang chủ"
        },
        {
            icon: LibraryIcon,
            label: "Library",
            path: "/library",
            tooltip: "Thư viện học liệu"
        },
        {
            icon: Sparkles,
            label: "Create with AI",
            path: "/create-ai",
            tooltip: "Tạo nội dung bằng AI"
        },
        {
            icon: FolderOpen,
            label: "My Materials",
            path: "/my-materials",
            tooltip: "Học liệu của tôi"
        },
    ];

    const studentMenuItems = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            path: "/dashboard/student",
            tooltip: "Trang chủ"
        },
        {
            icon: LibraryIcon,
            label: "Library",
            path: "/library",
            tooltip: "Thư viện học liệu"
        },
    ];

    const menuItems = userRole === "teacher" ? teacherMenuItems : studentMenuItems;

    return (
        <aside
            className={`h-screen bg-gradient-to-b from-blue-600 to-teal-600 text-white flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Logo */}
            <div className="p-6 border-b border-white/20">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    {!collapsed && (
                        <div>
                            <h1 className="font-bold text-xl">Edu Tech</h1>
                            <p className="text-xs text-white/70">
                                {userRole === "teacher" ? "Giáo viên" : "Học sinh"}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10 ${isActive ? "bg-white/20 shadow-lg" : ""
                                        }`}
                                    title={collapsed ? item.tooltip : ""}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!collapsed && <span className="font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-3 border-t border-white/20">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/10 w-full"
                    title={collapsed ? "Đăng xuất" : ""}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && <span className="font-medium">Logout</span>}
                </button>
            </div>
        </aside>
    );
}
