import { useState } from 'react';
import { Link } from 'react-router';
import { BookOpen, Mail, ArrowRight, ArrowLeft, CheckCircle, Copy, Check } from 'lucide-react';
import { api } from '../services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetCode, setResetCode] = useState('');
    const [userName, setUserName] = useState('');
    const [isSent, setIsSent] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            setError('Vui lòng nhập email');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Email không hợp lệ');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const result = await api.forgotPassword(email);
            setResetCode(result.reset_code);
            setUserName(result.user_name);
            setIsSent(true);
        } catch (err: any) {
            setError(err.message || 'Đã có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(resetCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại đăng nhập
                </Link>

                <div className="bg-white border border-border rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mb-4 shadow-lg">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Quên mật khẩu</h1>
                        <p className="text-muted-foreground">
                            {isSent
                                ? 'Mã xác nhận đã được tạo'
                                : 'Nhập email để nhận mã đặt lại mật khẩu'}
                        </p>
                    </div>

                    {!isSent ? (
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center animate-in fade-in duration-300">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="forgot-email" className="block text-sm font-medium mb-2">
                                        Email đăng ký
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <input
                                            type="email"
                                            id="forgot-email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                            placeholder="example@email.com"
                                            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                            disabled={isLoading}
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : (
                                        <>
                                            Gửi mã xác nhận
                                            <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Success message */}
                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-green-700">
                                        Xin chào {userName}!
                                    </p>
                                    <p className="text-green-600 mt-1">
                                        Mã xác nhận đã được tạo. Sử dụng mã bên dưới để đặt lại mật khẩu.
                                    </p>
                                </div>
                            </div>

                            {/* Demo mode: show reset code */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                                <p className="text-xs text-blue-500 font-medium uppercase tracking-wider mb-2">
                                    🔑 Mã xác nhận (Demo Mode)
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-mono font-bold tracking-[0.3em] text-blue-700">
                                        {resetCode}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                                        title="Sao chép mã"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-blue-500" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-blue-400 mt-2">
                                    Mã có hiệu lực trong 15 phút
                                </p>
                            </div>

                            {/* Go to reset page */}
                            <Link
                                to={`/reset-password?email=${encodeURIComponent(email)}`}
                                className="w-full py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                Đặt lại mật khẩu
                                <ArrowRight className="w-5 h-5" />
                            </Link>

                            <button
                                onClick={() => { setIsSent(false); setResetCode(''); }}
                                className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors text-center"
                            >
                                Gửi lại mã xác nhận
                            </button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground text-sm">
                            Nhớ mật khẩu?{' '}
                            <Link to="/login" className="text-primary hover:text-primary/80 font-medium">
                                Đăng nhập
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
