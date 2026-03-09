import { Layout } from '../components/Layout';
import { BookOpen, Sparkles, Library, Maximize2, Search, MousePointer } from 'lucide-react';

export default function Guide() {
    const sections = [
        {
            icon: Library,
            title: 'Thư viện học liệu',
            description: 'Khám phá hàng trăm mô hình 3D và infographic',
            steps: [
                'Truy cập trang Thư viện từ menu bên trái',
                'Sử dụng bộ lọc để tìm theo môn học, loại nội dung, và lớp học',
                'Tìm kiếm nhanh bằng thanh tìm kiếm',
                'Nhấp vào học liệu để xem chi tiết',
            ],
        },
        {
            icon: Sparkles,
            title: 'Find with AI',
            description: 'Tìm học liệu phù hợp bằng AI',
            steps: [
                'Mô tả nội dung bạn muốn tìm bằng văn bản tự nhiên',
                'Nhấn "Tìm kiếm" hoặc Enter để bắt đầu',
                'AI sẽ phân tích và gợi ý các học liệu phù hợp nhất',
                'Xem và chọn học liệu từ kết quả tìm kiếm',
            ],
        },
        {
            icon: MousePointer,
            title: 'Xem mô hình 3D',
            description: 'Tương tác với mô hình 3D',
            steps: [
                'Nhấp vào mô hình 3D để kích hoạt chế độ tương tác',
                'Kéo chuột để xoay mô hình',
                'Cuộn chuột để phóng to/thu nhỏ',
                'Nhấp đúp để đặt lại góc nhìn ban đầu',
            ],
        },
        {
            icon: Maximize2,
            title: 'Chế độ trình chiếu',
            description: 'Hiển thị toàn màn hình cho lớp học',
            steps: [
                'Mở học liệu bạn muốn trình chiếu',
                'Nhấn nút "Chế độ trình chiếu" ở góc trên bên phải',
                'Sử dụng nút toàn màn hình để hiển thị tốt nhất',
                'Nhấn ESC hoặc nút X để thoát',
            ],
        },
    ];

    return (
        <Layout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Hướng dẫn sử dụng</h1>
                            <p className="text-muted-foreground">Tìm hiểu cách sử dụng Edu Tech</p>
                        </div>
                    </div>
                </div>

                {/* Introduction */}
                <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
                    <h2 className="text-2xl font-bold mb-4">Chào mừng đến với Edu Tech!</h2>
                    <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
                        Edu Tech là nền tảng học tập Khoa học Tự nhiên (Vật lý, Hóa học, Sinh học)
                        cho học sinh THPT Việt Nam. Khám phá thư viện mô hình 3D và infographic tương tác,
                        tìm kiếm nội dung bằng AI, và sử dụng chế độ trình chiếu cho dạy học trên lớp.
                    </p>
                </div>

                {/* Guide sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        return (
                            <div key={index} className="bg-white border border-border rounded-xl p-6 shadow-sm">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-1">{section.title}</h3>
                                        <p className="text-muted-foreground">{section.description}</p>
                                    </div>
                                </div>
                                <ol className="space-y-2 ml-16">
                                    {section.steps.map((step, stepIndex) => (
                                        <li key={stepIndex} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                                                {stepIndex + 1}
                                            </span>
                                            <span className="text-muted-foreground pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        );
                    })}
                </div>

                {/* Tips */}
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold mb-4">Mẹo sử dụng</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Search className="w-4 h-4 text-secondary" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Tìm kiếm hiệu quả</h4>
                                <p className="text-sm text-muted-foreground">
                                    Sử dụng từ khóa cụ thể và mô tả chi tiết khi dùng Find with AI để có kết quả tốt nhất
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Maximize2 className="w-4 h-4 text-secondary" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Trình chiếu trong lớp</h4>
                                <p className="text-sm text-muted-foreground">
                                    Sử dụng chế độ toàn màn hình để hiển thị rõ ràng trên màn hình lớn hoặc máy chiếu
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BookOpen className="w-4 h-4 text-secondary" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Học liệu liên quan</h4>
                                <p className="text-sm text-muted-foreground">
                                    Xem mục "Học liệu liên quan" để khám phá thêm nội dung cùng chủ đề
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-secondary" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Thử các ví dụ</h4>
                                <p className="text-sm text-muted-foreground">
                                    Nhấp vào các gợi ý tìm kiếm trong Find with AI để xem cách sử dụng hiệu quả
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact/Support */}
                <div className="mt-8 bg-gradient-to-br from-secondary to-green-600 rounded-xl p-6 text-white">
                    <h3 className="font-bold mb-2">Cần hỗ trợ thêm?</h3>
                    <p className="text-green-100 mb-4">
                        Nếu bạn có câu hỏi hoặc gặp vấn đề khi sử dụng, hãy liên hệ với chúng tôi
                    </p>
                    <button className="px-6 py-2 bg-white text-secondary rounded-lg font-medium hover:bg-green-50 transition-colors">
                        Liên hệ hỗ trợ
                    </button>
                </div>
            </div>
        </Layout>
    );
}
