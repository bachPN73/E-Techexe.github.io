import { Layout } from '../components/Layout';
import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Trash2, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router';
import { materials as mockMaterials, getSubjectName, getTypeName, Material } from '../data/materialsData';
import { api, BASE_URL } from '../services/api';

export default function Library() {
    const [searchParams] = useSearchParams();
    const initialSubject = searchParams.get('subject') as Material['subject'] | null;

    const [allMaterials, setAllMaterials] = useState<Material[]>(mockMaterials);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState<Material['subject'] | 'all'>(initialSubject || 'all');
    const [selectedType, setSelectedType] = useState<Material['type'] | 'all'>('all');
    const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');

    // Admin delete state
    const [isAdmin, setIsAdmin] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Material | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Check admin role from localStorage
    useEffect(() => {
        try {
            const userData = localStorage.getItem('edu_tech_user');
            if (userData) {
                const user = JSON.parse(userData);
                setIsAdmin(user.role === 'admin');
            }
        } catch {
            setIsAdmin(false);
        }
    }, []);

    const fetchModels = async () => {
        try {
            const dbModels = await api.getModels();

            const formattedModels: Material[] = dbModels.map((m: any) => ({
                id: `db-${m.id}`,
                title: m.title,
                subject: m.subject,
                type: '3d-model',
                description: m.description,
                thumbnail: m.thumbnail ? `${BASE_URL}${m.thumbnail}` : '3d-placeholder',
                tags: m.tags || [],
                grade: m.grade || 10,
                file_url: m.file_url
            }));

            setAllMaterials([...mockMaterials, ...formattedModels]);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách mô hình:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchModels();
    }, []);

    // Handle delete
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setIsDeleting(true);
        try {
            const dbId = deleteTarget.id.replace('db-', '');
            await api.deleteModel(dbId);
            // Remove from local state
            setAllMaterials(prev => prev.filter(m => m.id !== deleteTarget.id));
            setDeleteTarget(null);
        } catch (error) {
            console.error("Lỗi khi xóa học liệu:", error);
            alert("Không thể xóa học liệu. Vui lòng thử lại.");
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter materials
    const filteredMaterials = allMaterials.filter((material) => {
        const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            material.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (Array.isArray(material.tags) && material.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

        const matchesSubject = selectedSubject === 'all' || material.subject === selectedSubject;
        const matchesType = selectedType === 'all' || material.type === selectedType;

        // Fix string/number mismatch for grade
        const matchesGrade = selectedGrade === 'all' || String(material.grade) === String(selectedGrade);

        return matchesSearch && matchesSubject && matchesType && matchesGrade;
    });

    return (
        <Layout>
            <div className="p-4 sm:p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Thư viện học liệu</h1>
                    <p className="text-lg text-muted-foreground">
                        Khám phá {allMaterials.length} mô hình 3D và infographic về Khoa học Tự nhiên
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="bg-card border border-border rounded-xl p-6 mb-8 shadow-sm">
                    {/* Search bar */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm học liệu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-2 mb-3">
                        <Filter className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">Lọc:</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Subject filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Môn học</label>
                            <select
                                value={selectedSubject}
                                onChange={(e) => setSelectedSubject(e.target.value as Material['subject'] | 'all')}
                                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">Tất cả môn học</option>
                                <option value="physics">Vật lý</option>
                                <option value="chemistry">Hóa học</option>
                                <option value="biology">Sinh học</option>
                            </select>
                        </div>

                        {/* Type filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Loại</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as Material['type'] | 'all')}
                                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">Tất cả loại</option>
                                <option value="3d-model">Mô hình 3D</option>
                                <option value="infographic">Infographic</option>
                            </select>
                        </div>

                        {/* Grade filter */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Lớp</label>
                            <select
                                value={selectedGrade}
                                onChange={(e) => setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                                className="w-full px-4 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="all">Tất cả lớp</option>
                                <option value="10">Lớp 10</option>
                                <option value="11">Lớp 11</option>
                                <option value="12">Lớp 12</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results count */}
                <div className="mb-6">
                    <p className="text-muted-foreground">
                        Tìm thấy <span className="font-semibold text-foreground">{filteredMaterials.length}</span> kết quả
                    </p>
                </div>

                {/* Materials grid */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-muted-foreground animate-pulse">Đang tải danh sách học liệu...</p>
                    </div>
                ) : filteredMaterials.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
                        {filteredMaterials.map((material) => (
                            <div
                                key={material.id}
                                className="bg-card border border-border rounded-xl flex flex-col overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 relative group"
                            >
                                {/* Delete button for admin - only for DB models */}
                                {isAdmin && material.id.startsWith('db-') && (
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setDeleteTarget(material);
                                        }}
                                        className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 bg-red-500/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                        title="Xóa học liệu"
                                    >
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                )}

                                <Link
                                    to={`/material/${material.id}`}
                                    className="block flex-1 flex flex-col"
                                >
                                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden shrink-0">
                                        {material.thumbnail && material.thumbnail !== '3d-placeholder' ? (
                                            <img src={material.thumbnail.startsWith('http') ? material.thumbnail : (material.thumbnail.startsWith('/') ? `${BASE_URL}${material.thumbnail}` : material.thumbnail)} alt={material.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <BookOpen className="w-8 h-8 sm:w-16 sm:h-16 text-primary/30" />
                                        )}
                                    </div>
                                    <div className="p-3 sm:p-5 flex-1 flex flex-col">
                                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/10 text-primary font-medium whitespace-nowrap">
                                                {getSubjectName(material.subject)}
                                            </span>
                                            <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-secondary/10 text-secondary font-medium whitespace-nowrap">
                                                {getTypeName(material.type)}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold sm:font-bold mb-1 sm:mb-2 text-sm sm:text-lg line-clamp-2 leading-snug">{material.title}</h3>
                                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3 flex-1">
                                            {material.description}
                                        </p>
                                        <div className="flex flex-wrap gap-1 mt-auto">
                                            {(Array.isArray(material.tags) ? material.tags : []).slice(0, 2).map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-muted text-muted-foreground truncate max-w-[80px] sm:max-w-[120px]"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Không tìm thấy kết quả</h3>
                        <p className="text-muted-foreground">
                            Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                        </p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-red-500">Xác nhận xóa</h3>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="p-1 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <p className="text-muted-foreground mb-2">
                            Bạn có chắc chắn muốn xóa học liệu này không?
                        </p>
                        <p className="font-semibold mb-6">"{deleteTarget.title}"</p>

                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                            <p className="text-sm text-red-400">
                                ⚠️ Hành động này không thể hoàn tác. File mô hình 3D sẽ bị xóa vĩnh viễn.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 px-4 py-2.5 border border-border rounded-lg hover:bg-muted transition-colors font-medium"
                                disabled={isDeleting}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Đang xóa...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4" />
                                        Xóa
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
