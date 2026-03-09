import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { Lock, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const [formData, setFormData] = useState({
        email: emailFromUrl,
        token: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    // Auto redirect after success
    useEffect(() => {
        if (!isSuccess) return;
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/login');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSuccess, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email) {
            setError('Vui lòng nhập email');
            return;
        }
        if (!formData.token || formData.token.length !== 6) {
            setError('Mã xác nhận phải có 6 chữ số');
            return;
        }
        if (formData.newPassword.length < 6) {
            setError('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsLoading(true);
        try {
            await api.resetPassword(formData.email, formData.token, formData.newPassword);
            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Đã có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Limit token to 6 digits
        if (name === 'token' && value.length > 6) return;
        if (name === 'token' && value && !/^\d+$/.test(value)) return;

        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
                <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
                    <div className="bg-white border border-border rounded-2xl shadow-xl p-8 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full mb-6 shadow-lg animate-in zoom-in duration-500">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-3 text-green-700">Thành công!</h1>
                        <p className="text-muted-foreground mb-6">
                            Mật khẩu đã được đổi thành công.<br />
                            Bạn có thể đăng nhập bằng mật khẩu mới.
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                            <p className="text-sm text-green-600">
                                Tự động chuyển đến trang đăng nhập sau <span className="font-bold">{countdown}</span> giây...
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-primary to-blue-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                        >
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <Link
                    to="/forgot-password"
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Quay lại
                </Link>

                <div className="bg-white border border-border rounded-2xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                            <KeyRound className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">Đặt lại mật khẩu</h1>
                        <p className="text-muted-foreground">
                            Nhập mã xác nhận và mật khẩu mới
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center animate-in fade-in duration-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email (pre-filled) */}
                        <div>
                            <label htmlFor="reset-email" className="block text-sm font-medium mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                id="reset-email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Reset code (6 digits) */}
                        <div>
                            <label htmlFor="reset-token" className="block text-sm font-medium mb-2">
                                Mã xác nhận (6 chữ số)
                            </label>
                            <input
                                type="text"
                                id="reset-token"
                                name="token"
                                value={formData.token}
                                onChange={handleChange}
                                placeholder="000000"
                                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-center text-2xl font-mono tracking-[0.4em] transition-all"
                                disabled={isLoading}
                                maxLength={6}
                                autoFocus
                            />
                        </div>

                        {/* New password */}
                        <div>
                            <label htmlFor="new-password" className="block text-sm font-medium mb-2">
                                Mật khẩu mới
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="new-password"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Tối thiểu 6 ký tự"
                                    className="w-full pl-12 pr-12 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
                                Xác nhận mật khẩu mới
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirm-password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Nhập lại mật khẩu mới"
                                    className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                'Đổi mật khẩu'
                            )}
                        </button>
                    </form>

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
