import { Link } from 'react-router';
import { BookOpen, ArrowLeft } from 'lucide-react';
import PricingContent from '../components/PricingContent';

export default function PricingPublicPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-slate-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent leading-none">Edu Tech</h1>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Khoa học Tự nhiên</p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link
                            to="/login"
                            className="hidden xs:block px-4 py-2 text-slate-600 hover:text-primary transition-colors font-bold"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                        >
                            Đăng ký
                        </Link>
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Quay lại trang chủ
                    </Link>
                </div>
                <PricingContent />
            </main>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <BookOpen className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-black text-primary">Edu Tech</span>
                        </div>
                        <p className="text-sm text-slate-400 font-bold">
                            © 2026 Edu Tech Vietnam. Build for high performance.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
