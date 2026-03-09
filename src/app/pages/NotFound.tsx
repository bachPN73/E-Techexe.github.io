import { useNavigate } from "react-router";
import { Home, ArrowLeft } from "lucide-react";
import Button from "../components/Button";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 flex items-center justify-center p-6">
            <div className="text-center max-w-md">
                <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Không tìm thấy trang
                </h1>
                <p className="text-gray-600 mb-8">
                    Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => navigate(-1)} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Quay lại
                    </Button>
                    <Button onClick={() => navigate("/")}>
                        <Home className="w-4 h-4 mr-2" />
                        Về trang chủ
                    </Button>
                </div>
            </div>
        </div>
    );
}
