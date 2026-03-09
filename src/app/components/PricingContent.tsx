import { Check, Zap, Crown, CheckCircle2 } from "lucide-react";
import { Link } from "react-router";
import Button from "./Button";

export default function PricingContent() {
    const plans = [
        {
            id: "free",
            name: "Free",
            price: "0",
            description: "Dành cho học sinh mới làm quen với 3D",
            features: [
                "Xem 5 mô hình 3D mỗi ngày",
                "Truy cập thư viện cơ bản",
                "Chế độ trình chiếu tiêu chuẩn",
                "Hỗ trợ cộng đồng",
            ],
            icon: CheckCircle2,
            color: "text-gray-500",
            bg: "bg-gray-50",
            border: "border-gray-200",
            buttonVariant: "outline" as const,
        },
        {
            id: "advanced",
            name: "Advanced",
            price: "99.000",
            description: "Phù hợp cho học sinh ôn thi chuyên sâu",
            features: [
                "Xem không giới hạn mô hình 3D",
                "Truy cập toàn bộ thư viện chuyên sâu",
                "Tải xuống infographic chất lượng cao",
                "Ưu tiên hỗ trợ kỹ thuật",
                "Không có quảng cáo",
            ],
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
            featured: true,
            buttonVariant: "primary" as const,
        },
        {
            id: "premium",
            name: "Premium",
            price: "199.000",
            description: "Giải pháp toàn diện cho giáo viên và trường học",
            features: [
                "Toàn bộ tính năng của gói Advanced",
                "Công cụ Find with AI không giới hạn",
                "Tạo học liệu tùy chỉnh với AI",
                "Chế độ trình chiếu nâng cao cho 4K",
                "Quản lý lớp học và tài khoản nhóm",
            ],
            icon: Crown,
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-200",
            buttonVariant: "secondary" as const,
        },
    ];

    return (
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 tracking-tight">Chọn gói dịch vụ phù hợp</h1>
                <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                    Nâng tầm trải nghiệm học tập của bạn với các tính năng nâng cao và nội dung độc quyền từ Edu Tech.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {plans.map((plan) => {
                    const Icon = plan.icon;
                    return (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col p-6 sm:p-8 rounded-[2rem] border-2 transition-all hover:shadow-2xl hover:-translate-y-2 ${plan.featured
                                ? `${plan.border} shadow-xl bg-white scale-105 z-10`
                                : "border-slate-100 bg-white"
                                }`}
                        >
                            {plan.featured && (
                                <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                    PHỔ BIẾN NHẤT
                                </div>
                            )}

                            <div className={`w-14 h-14 ${plan.bg} ${plan.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                                <Icon className="w-8 h-8" />
                            </div>

                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h2>
                            <div className="flex items-baseline gap-1 mb-4 text-slate-900">
                                <span className="text-4xl font-black">{plan.price}</span>
                                <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest ml-1">đ/tháng</span>
                            </div>
                            <p className="text-slate-500 mb-8 text-sm font-medium leading-relaxed">
                                {plan.description}
                            </p>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-start gap-3">
                                        <Check className={`w-5 h-5 ${plan.color} flex-shrink-0 mt-0.5`} />
                                        <span className="text-sm text-slate-700 font-medium leading-tight">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to={`/payment/${plan.id}`} className="mt-auto">
                                <Button
                                    variant={plan.buttonVariant}
                                    className="w-full py-4 rounded-xl text-lg font-bold shadow-md hover:shadow-lg transition-all"
                                >
                                    Chọn gói này
                                </Button>
                            </Link>
                        </div>
                    );
                })}
            </div>

            <div className="mt-20 bg-slate-50 rounded-[2.5rem] p-8 sm:p-12 text-center border border-slate-100 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Bạn cần gói tùy chỉnh cho nhà trường?</h3>
                <p className="text-slate-600 mb-8 max-w-xl mx-auto font-medium">
                    Chúng tôi cung cấp giải pháp tích hợp cho hệ thống giáo dục với mức giá ưu đãi và các tính năng quản lý tập trung.
                </p>
                <Button variant="outline" className="px-8 py-4 rounded-xl font-bold border-slate-200 hover:border-slate-300">
                    Liên hệ bộ phận doanh nghiệp
                </Button>
            </div>
        </div>
    );
}
