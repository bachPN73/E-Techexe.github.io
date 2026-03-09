import { Layout } from "../components/Layout";
import { useState, useEffect } from "react";
import { User, Mail, Shield, Key, CreditCard, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import Button from "../components/Button";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        email: "",
        role: "",
        plan: "Free",
    });

    useEffect(() => {
        const stored = localStorage.getItem('edu_tech_user');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setUser({
                    name: parsed.name || 'Người dùng',
                    email: parsed.email || '',
                    role: parsed.role === 'teacher' ? 'Giáo viên' : parsed.role === 'admin' ? 'Admin' : 'Học sinh',
                    plan: parsed.plan || 'Free',
                });
            } catch { /* ignore parse errors */ }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const [passwordData, setPasswordData] = useState({
        current: "",
        new: "",
        confirm: "",
    });

    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handlePasswordChange = (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        // Simulate API call
        setTimeout(() => {
            setIsUpdating(false);
            setShowPasswordForm(false);
            alert("Đổi mật khẩu thành công!");
            setPasswordData({ current: "", new: "", confirm: "" });
        }, 1000);
    };

    return (
        <Layout>
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-foreground">Hồ sơ cá nhân</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Info Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm text-foreground">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
                                {user.name.charAt(0)}
                            </div>
                            <h2 className="text-xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground mb-4">{user.role}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                                <CreditCard className="w-4 h-4" />
                                Gói {user.plan}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Forms */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-foreground">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Thông tin cơ bản
                            </h3>
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-muted-foreground">Họ và tên</label>
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-foreground">{user.name}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-muted-foreground">Email</label>
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-foreground">{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Subscription Info */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-foreground">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-secondary" />
                                Gói dịch vụ
                            </h3>
                            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border">
                                <div>
                                    <p className="font-bold text-foreground">Bạn đang dùng gói {user.plan}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Hết hạn: Không giới hạn
                                    </p>
                                </div>
                                <Link to="/pricing">
                                    <Button variant="outline" size="sm">
                                        Nâng cấp
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Password Security */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm text-foreground">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Key className="w-5 h-5 text-orange-500" />
                                Bảo mật
                            </h3>

                            {!showPasswordForm ? (
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between"
                                    onClick={() => setShowPasswordForm(true)}
                                >
                                    <span className="font-medium text-foreground">Đổi mật khẩu</span>
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            ) : (
                                <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-muted-foreground">Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            required
                                            className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none text-foreground"
                                            value={passwordData.current}
                                            onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-muted-foreground">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            required
                                            className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none text-foreground"
                                            value={passwordData.new}
                                            onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-muted-foreground">Xác nhận mật khẩu mới</label>
                                        <input
                                            type="password"
                                            required
                                            className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none text-foreground"
                                            value={passwordData.confirm}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setShowPasswordForm(false)}
                                            disabled={isUpdating}
                                        >
                                            Hủy
                                        </Button>
                                        <Button type="submit" disabled={isUpdating}>
                                            {isUpdating ? "Đang lưu..." : "Cập nhật mật khẩu"}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
