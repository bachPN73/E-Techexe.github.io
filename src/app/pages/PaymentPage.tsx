import { Layout } from "../components/Layout";
import { useParams, useNavigate } from "react-router";
import { ShieldCheck, CreditCard, Lock, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import Button from "../components/Button";

export default function PaymentPage() {
    const { planId } = useParams();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1);

    const plans: Record<string, any> = {
        free: { name: "Free", price: 0 },
        advanced: { name: "Advanced", price: 99000 },
        premium: { name: "Premium", price: 199000 },
    };

    const plan = plans[planId || "free"];

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setStep(2);
        }, 2000);
    };

    if (step === 2) {
        return (
            <Layout>
                <div className="p-8 min-h-[80vh] flex items-center justify-center">
                    <div className="max-w-md w-full text-center bg-card border border-border rounded-3xl p-10 shadow-xl text-foreground">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Thanh toán thành công!</h1>
                        <p className="text-muted-foreground mb-8">
                            Cảm ơn bạn đã nâng cấp lên gói <span className="font-bold text-foreground">{plan.name}</span>.
                            Giờ đây bạn có thể sử dụng toàn bộ tính năng cao cấp của chúng tôi.
                        </p>
                        <div className="space-y-4">
                            <Button className="w-full py-4 text-lg font-bold" onClick={() => navigate("/dashboard")}>
                                Đến Dashboard
                            </Button>
                            <Button variant="ghost" className="w-full" onClick={() => navigate("/library")}>
                                Khám phá thư viện ngay
                            </Button>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="p-8 max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Payment Form */}
                    <div className="space-y-8">
                        <h1 className="text-3xl font-bold text-foreground">Thanh toán</h1>

                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-foreground">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Phương thức thanh toán
                            </h3>

                            <form onSubmit={handlePayment} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">Số thẻ</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="0000 0000 0000 0000"
                                                required
                                                className="w-full p-3 pl-10 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none"
                                            />
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">Ngày hết hạn</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                required
                                                className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-sm font-medium">CVV</label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    placeholder="***"
                                                    required
                                                    className="w-full p-3 pl-10 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none"
                                                />
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm font-medium">Tên chủ thẻ</label>
                                        <input
                                            type="text"
                                            placeholder="NGUYEN VAN AN"
                                            required
                                            className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none uppercase"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full py-4 text-lg font-bold shadow-lg flex items-center justify-center gap-3"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <ShieldCheck className="w-5 h-5" />
                                                Thanh toán {plan.price.toLocaleString()}đ
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground text-sm p-4 bg-muted/20 rounded-xl">
                            <Lock className="w-8 h-8 flex-shrink-0" />
                            <p>Thanh toán của bạn được bảo mật theo tiêu chuẩn quốc tế PCI DSS. Thông tin thẻ không được lưu trữ trên máy chủ của chúng tôi.</p>
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div>
                        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm lg:sticky lg:top-8 text-foreground">
                            <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Tóm tắt đơn hàng</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center text-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold">Gói {plan.name}</p>
                                            <p className="text-sm text-muted-foreground">Thời hạn 1 tháng</p>
                                        </div>
                                    </div>
                                    <p className="font-bold">{plan.price.toLocaleString()}đ</p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-border pt-6">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Tạm tính</span>
                                    <span>{plan.price.toLocaleString()}đ</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Thuế (0%)</span>
                                    <span>0đ</span>
                                </div>
                                <div className="flex justify-between text-2xl font-black pt-2 text-foreground border-t border-dashed border-border mt-2">
                                    <span>Tổng cộng</span>
                                    <span className="text-primary">{plan.price.toLocaleString()}đ</span>
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-xs text-muted-foreground text-center italic">
                                    Bằng cách nhấn "Thanh toán", bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của Edu Tech.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
