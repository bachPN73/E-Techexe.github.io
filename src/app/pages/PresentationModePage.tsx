import { useParams, useNavigate } from 'react-router';
import { materials as mockMaterials, Material } from '../data/materialsData';
import { X, Maximize2, Minimize2, RotateCcw, BookOpen, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../services/api';
import ModelViewer from '../components/ModelViewer';

export default function PresentationMode() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [material, setMaterial] = useState<Material | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const fetchMaterial = async () => {
            if (!id) { setIsLoading(false); return; }

            if (id.startsWith('db-')) {
                // Fetch from database API
                const dbId = id.replace('db-', '');
                try {
                    const data = await api.getModel(dbId);
                    if (data && !data.error) {
                        setMaterial({
                            id, title: data.title, subject: data.subject,
                            type: '3d-model', description: data.description,
                            thumbnail: '3d-placeholder', tags: data.tags || [],
                            grade: data.grade || 10, file_url: data.file_url,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching model for presentation:", error);
                }
            } else {
                // Find from mock data
                const found = mockMaterials.find(m => m.id === id);
                if (found) setMaterial(found);
            }
            setIsLoading(false);
        };
        fetchMaterial();
    }, [id]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
            </div>
        );
    }

    if (!material) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Không tìm thấy học liệu</h1>
                    <button
                        onClick={() => navigate('/library')}
                        className="text-blue-400 hover:underline"
                    >
                        Quay lại thư viện
                    </button>
                </div>
            </div>
        );
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    const getFullModelUrl = (url: string | undefined) => {
        if (!url) return "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF-Binary/Duck.glb";
        if (url.startsWith('/models/')) {
            return `http://127.0.0.1:3005${url}`;
        }
        return url;
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    const handleClose = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Top control bar */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold">{material.title}</h1>
                        <p className="text-sm text-gray-400">{material.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {material.type === '3d-model' && (
                            <button
                                onClick={handleRotate}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                title="Xoay mô hình"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        )}

                        <button
                            onClick={toggleFullscreen}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                        >
                            {isFullscreen ? (
                                <Minimize2 className="w-5 h-5" />
                            ) : (
                                <Maximize2 className="w-5 h-5" />
                            )}
                        </button>

                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            title="Đóng"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main presentation area */}
            <div className={`flex-1 relative w-full ${isFullscreen ? 'bg-black' : 'p-8'}`}>
                <div className={`absolute inset-0 ${isFullscreen ? '' : 'p-8'}`}>
                    <div
                        className={`w-full h-full mx-auto relative transition-all ${isFullscreen ? 'max-w-none' : 'max-w-7xl'}`}
                        style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
                    >
                        {material.type === '3d-model' ? (
                            <div className={`absolute inset-0 overflow-hidden ${isFullscreen ? 'rounded-none border-none' : 'rounded-2xl border border-white/10 shadow-2xl'}`}>
                                <ModelViewer modelUrl={getFullModelUrl((material as any).file_url)} />
                            </div>
                        ) : (
                            <div className={`absolute inset-0 bg-gradient-to-br from-blue-900/20 to-green-900/20 flex items-center justify-center p-8 overflow-hidden ${isFullscreen ? 'rounded-none border-none' : 'rounded-2xl border border-white/10'}`}>
                                {material.file_url ? (
                                    <img
                                        src={getFullModelUrl(material.file_url)}
                                        alt={material.title}
                                        className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                                    />
                                ) : (
                                    <div className="text-center max-w-4xl">
                                        <h2 className="text-4xl font-bold mb-8">{material.title}</h2>
                                        <div className="bg-white/5 rounded-xl p-12 border border-white/10">
                                            <BookOpen className="w-48 h-48 text-white/30 mx-auto mb-6" />
                                            <p className="text-xl text-gray-300 leading-relaxed">
                                                {material.description}
                                            </p>
                                        </div>

                                        <div className="mt-8 flex flex-wrap justify-center gap-3">
                                            {material.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-4 py-2 bg-white/10 rounded-lg text-sm border border-white/20"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom info bar */}
            <div className="bg-black/80 backdrop-blur-sm border-t border-white/10 px-6 py-3">
                <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-6">
                        <span>Loại: {material.type === '3d-model' ? 'Mô hình 3D' : 'Infographic'}</span>
                        <span>Môn: {material.subject === 'physics' ? 'Vật lý' : material.subject === 'chemistry' ? 'Hóa học' : 'Sinh học'}</span>
                        <span>Lớp {material.grade}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <kbd className="px-2 py-1 bg-white/10 rounded text-xs">ESC</kbd>
                        <span>để thoát</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
