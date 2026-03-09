import { ReactNode, useState, useEffect } from 'react';
import { AppSidebar } from './AppSidebar';
import { useLocation } from 'react-router';
import { Menu } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Tự động đóng sidebar khi chuyển trang trên mobile
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen bg-background relative">
            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-sidebar flex items-center justify-between px-4 z-40 border-b border-sidebar-border">
                <div className="font-bold text-white text-lg">Edu Tech</div>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="text-white p-2 hover:bg-white/10 rounded-md transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </header>

            {/* Sidebar (hoạt động như Drawer trên mobile) */}
            <AppSidebar
                currentPath={location.pathname}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Overlay nền đen mờ khi mở Drawer trên mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-14 md:pt-0 w-full overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
