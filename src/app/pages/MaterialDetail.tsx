import { Layout } from '../components/Layout';
import { useParams, Link, useNavigate } from 'react-router';
import { materials as mockMaterials, getSubjectName, getTypeName, Material } from '../data/materialsData';
import { ArrowLeft, Maximize2, BookOpen, Tag, GraduationCap, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ModelViewer from '../components/ModelViewer';
import { api, BASE_URL } from '../services/api';

export default function MaterialDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState<Material | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchMaterial = async () => {
            if (!id) return;

            if (id.startsWith('db-')) {
                const dbId = id.replace('db-', '');
                try {
                    const data = await api.getModel(dbId);
                    if (data && !data.error) {
                        setMaterial({
                            id: id,
                            title: data.title,
                            subject: data.subject,
                            type: '3d-model',
                            description: data.description,
                            thumbnail: '3d-placeholder',
                            tags: data.tags || [],
                            grade: data.grade || 10,
                            file_url: data.file_url
                        } as any);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy chi tiết học liệu:", error);
                }
            } else {
                const found = mockMaterials.find(m => m.id === id);
                if (found) setMaterial(found);
            }
            setIsLoading(false);
        };

        fetchMaterial();
    }, [id]);

    if (isLoading) {
        return (
            <Layout>
                <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-muted-foreground font-medium">Đang tải thông tin học liệu...</p>
                </div>
            </Layout>
        );
    }

    if (!material) {
        return (
            <Layout>
                <div className="p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy học liệu</h1>
                    <Link to="/library" className="text-primary hover:underline">
                        Quay lại thư viện
                    </Link>
                </div>
            </Layout>
        );
    }

    const getFullModelUrl = (url: string | undefined) => {
        if (!url) return "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";
        if (url.startsWith('/models/')) {
            return `${BASE_URL}${url}`;
        }
        return url;
    };

    const relatedMaterials = mockMaterials
        .filter(m => m.id !== material.id && m.subject === material.subject)
        .slice(0, 3);

    return (
        <Layout>
            <div className="p-8">
                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <div className="lg:col-span-2">
                        {/* Material viewer */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden mb-6 shadow-lg">
                            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative flex items-center justify-center group overflow-hidden">
                                {material.type === '3d-model' ? (
                                    <div id="3d-viewer-container" className="absolute inset-0 z-10 bg-black">
                                        <ModelViewer modelUrl={getFullModelUrl((material as any).file_url)} />
                                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-sm z-50 shadow-md pointer-events-none">
                                            <p className="text-gray-800 font-medium">Kéo chuột trái để xoay • Cuộn để zoom</p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {material.thumbnail && material.thumbnail !== '3d-placeholder' ? (
                                            <img src={material.thumbnail} alt={material.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <BookOpen className="w-32 h-32 text-primary/40" />
                                        )}
                                    </>
                                )}

                                {/* Presentation mode button */}
                                <button
                                    onClick={() => {
                                        const viewerElement = document.getElementById('3d-viewer-container');
                                        if (viewerElement) {
                                            if (viewerElement.requestFullscreen) {
                                                viewerElement.requestFullscreen();
                                            }
                                        }
                                    }}
                                    className="absolute top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors shadow-lg cursor-pointer"
                                    title="Mở toàn màn hình"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                    <span className="text-sm font-medium">Chế độ trình chiếu</span>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium">
                                        {getSubjectName(material.subject)}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-secondary/10 text-secondary font-medium">
                                        {getTypeName(material.type)}
                                    </span>
                                    <span className="px-3 py-1 rounded-lg bg-muted text-muted-foreground font-medium flex items-center gap-1">
                                        < GraduationCap className="w-4 h-4" />
                                        Lớp {material.grade}
                                    </span>
                                </div>

                                <h1 className="text-3xl font-bold mb-4">{material.title}</h1>
                                <p className="text-lg text-muted-foreground leading-relaxed">
                                    {material.description}
                                </p>
                            </div>
                        </div>

                        {/* Additional information */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Thông tin chi tiết</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        Từ khóa
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {material.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 rounded-lg bg-muted text-foreground text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {material.type === '3d-model' && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Hướng dẫn sử dụng mô hình 3D</h3>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            <li>Kéo chuột để xoay mô hình</li>
                                            <li>Cuộn chuột để phóng to/thu nhỏ</li>
                                            <li>Nhấp đúp để đặt lại góc nhìn</li>
                                            <li>Sử dụng chế độ trình chiếu để hiển thị toàn màn hình</li>
                                        </ul>
                                    </div>
                                )}

                                {material.type === 'infographic' && (
                                    <div>
                                        <h3 className="font-semibold mb-2">Hướng dẫn sử dụng Infographic</h3>
                                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                            <li>Nhấp vào các phần để xem thông tin chi tiết</li>
                                            <li>Sử dụng chế độ trình chiếu để hiển thị tốt hơn</li>
                                            <li>Phù hợp cho trình chiếu trong lớp học</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Related materials */}
                        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold mb-4">Học liệu liên quan</h2>

                            {relatedMaterials.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 lg:space-y-4">
                                    {relatedMaterials.map((relatedMaterial) => (
                                        <Link
                                            key={relatedMaterial.id}
                                            to={`/material/${relatedMaterial.id}`}
                                            className="block bg-muted/30 rounded-xl p-3 hover:bg-muted/50 transition-colors border border-transparent hover:border-border/50"
                                        >
                                            <div className="flex flex-col lg:flex-row items-center lg:items-start text-center lg:text-left gap-3">
                                                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-primary/50" />
                                                </div>
                                                <div className="flex-1 min-w-0 w-full">
                                                    <h3 className="font-bold lg:font-semibold mb-1 text-xs lg:text-base line-clamp-2 leading-tight">{relatedMaterial.title}</h3>
                                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/10 text-secondary font-medium">
                                                            {getTypeName(relatedMaterial.type)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">
                                    Không có học liệu liên quan
                                </p>
                            )}

                            <Link
                                to={`/library?subject=${material.subject}`}
                                className="block mt-4 text-center text-primary hover:text-primary/80 font-medium text-sm"
                            >
                                Xem thêm {getSubjectName(material.subject)} →
                            </Link>
                        </div>

                        {/* Quick actions */}
                        <div className="mt-6 bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold mb-3">Tìm học liệu khác?</h3>
                            <p className="text-blue-100 text-sm mb-4">
                                Sử dụng AI để tìm mô hình 3D và infographic phù hợp với nhu cầu của bạn
                            </p>
                            <Link
                                to="/find-ai"
                                className="block text-center px-4 py-2 bg-white text-primary rounded-lg font-medium hover:bg-blue-50 transition-colors"
                            >
                                Find with AI
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
