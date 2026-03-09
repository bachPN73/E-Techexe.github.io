import { AdminLayout } from '../../components/admin/AdminLayout';
import { Box, Plus, Search, Filter, Upload, X, Loader2, CheckCircle2, AlertCircle, ImagePlus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api, BASE_URL } from '../../services/api';
import Button from '../../components/Button';

export default function AdminMaterialsPage() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showUploadForm, setShowUploadForm] = useState(false);

    // Upload Form State
    const [file, setFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: "" });
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        subject: "physics",
        grade: 10,
        tags: "",
    });

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        try {
            const data = await api.getModels();
            setMaterials(data);
        } catch (error) {
            console.error("Failed to load materials", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number, title: string) => {
        if (window.confirm(`Bạn có chắc chắn muốn xóa học liệu "${title}" không?\nHành động này không thể hoàn tác.`)) {
            try {
                await api.deleteModel(id);
                // Update state immediately for responsive UI
                setMaterials(prev => prev.filter(m => m.id !== id));
                setStatus({ type: 'success', message: 'Đã xóa học liệu thành công.' });
                setTimeout(() => setStatus({ type: null, message: "" }), 3000);
            } catch (error: any) {
                console.error("Failed to delete material", error);
                setStatus({ type: 'error', message: 'Xóa thất bại: ' + error.message });
            }
        }
    };

    const filteredMaterials = materials.filter(model =>
        model.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Upload Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const ext = selectedFile.name.split('.').pop()?.toLowerCase();
            if (ext !== 'glb' && ext !== 'gltf') {
                setStatus({ type: 'error', message: "Vui lòng chọn tệp định dạng .glb hoặc .gltf" });
                return;
            }
            setFile(selectedFile);
            setStatus({ type: null, message: "" });
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setStatus({ type: 'error', message: "Ảnh đại diện chỉ hỗ trợ .jpg, .png, .webp" });
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                setStatus({ type: 'error', message: "Ảnh đại diện không được vượt quá 5MB" });
                return;
            }

            if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
            setThumbnailFile(selectedFile);
            setThumbnailPreview(URL.createObjectURL(selectedFile));
            setStatus({ type: null, message: "" });
        }
    };

    const removeThumbnail = () => {
        setThumbnailFile(null);
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
            setThumbnailPreview(null);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setStatus({ type: 'error', message: "Vui lòng chọn tệp mô hình 3D" });
            return;
        }

        setIsUploading(true);
        setStatus({ type: null, message: "" });

        try {
            const uploadRes = await api.uploadModelFile(file);
            let thumbnailUrl = null;
            if (thumbnailFile) {
                const thumbRes = await api.uploadThumbnail(thumbnailFile);
                thumbnailUrl = thumbRes.thumbnail_url;
            }

            const modelData = {
                ...formData,
                file_url: uploadRes.file_url,
                thumbnail: thumbnailUrl,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ""),
            };

            await api.saveModel(modelData);

            setStatus({ type: 'success', message: "Tải lên thành công!" });

            // Reload list and close form after short delay
            setTimeout(() => {
                setShowUploadForm(false);
                setStatus({ type: null, message: "" });
                setFile(null);
                removeThumbnail();
                setFormData({ title: "", description: "", subject: "physics", grade: 10, tags: "" });
                loadMaterials();
            }, 1500);
        } catch (err: any) {
            setStatus({ type: 'error', message: "Có lỗi xảy ra: " + err.message });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
                        <Box className="w-5 h-5 md:w-6 md:h-6 text-indigo-500" /> Quản Lý Học Liệu 3D
                    </h1>
                    <p className="text-slate-500 text-xs md:text-sm mt-1">Danh sách mô hình 3D và tài nguyên hệ thống ({materials.length} mục)</p>
                </div>

                <div className="flex flex-wrap gap-2 md:gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                        <Filter className="w-4 h-4" /> <span className="hidden sm:inline">Lọc</span>
                    </button>
                    <button
                        onClick={() => setShowUploadForm(!showUploadForm)}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-500/30 ml-auto md:ml-0"
                    >
                        {showUploadForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{showUploadForm ? "Đóng" : "Thêm Mới"}</span>
                    </button>
                </div>
            </div>

            {/* Global Status Message (for delete actions) */}
            {status.type && !showUploadForm && (
                <div className={`mb-6 flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    <p className="font-medium text-sm">{status.message}</p>
                </div>
            )}

            {/* Upload Form Section */}
            {showUploadForm && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8 animate-in slide-in-from-top-4 fade-in duration-300">
                    <h2 className="text-xl font-bold mb-6 text-slate-800">Tải lên mô hình 3D mới</h2>
                    <form onSubmit={handleUploadSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* File Upload Area */}
                                <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-indigo-400 transition-colors relative group">
                                    <input
                                        type="file"
                                        accept=".glb,.gltf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center">
                                        <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-7 h-7" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-1 text-slate-700">
                                            {file ? file.name : "Chọn tệp mô hình 3D"}
                                        </h3>
                                        <p className="text-slate-500 text-sm">Hỗ trợ .glb, .gltf (Max 50MB)</p>
                                    </div>
                                </div>

                                {/* Thumbnail Upload Area */}
                                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                                    <label className="text-sm font-medium mb-3 block text-slate-700">Ảnh đại diện (Thumbnail)</label>
                                    <div className="flex items-start gap-4">
                                        {thumbnailPreview ? (
                                            <div className="relative group">
                                                <img src={thumbnailPreview} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm" />
                                                <button type="button" onClick={removeThumbnail} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="relative w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50">
                                                <input type="file" accept=".jpg,.png,.webp" onChange={handleThumbnailChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                <ImagePlus className="w-6 h-6 text-slate-400 mb-1" />
                                            </div>
                                        )}
                                        <div className="flex-1 text-sm text-slate-500 pt-1">
                                            <p>Hiển thị trong thư viện.</p>
                                            <p>Hỗ trợ: .jpg, .png, .webp (Max 5MB)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Tiêu đề</label>
                                    <input type="text" required placeholder="Cấu tạo nguyên tử Hydro" className="p-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-slate-700">Môn học</label>
                                        <select className="p-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}>
                                            <option value="physics">Vật lý</option>
                                            <option value="chemistry">Hóa học</option>
                                            <option value="biology">Sinh học</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-slate-700">Lớp</label>
                                        <select className="p-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}>
                                            <option value={10}>Lớp 10</option>
                                            <option value={11}>Lớp 11</option>
                                            <option value={12}>Lớp 12</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Mô tả chi tiết</label>
                                    <textarea required rows={3} placeholder="Mô tả nội dung..." className="p-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none w-full" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-slate-700">Tags (cách nhau dấu phẩy)</label>
                                    <input type="text" placeholder="nguyên tử, vật lý..." className="p-2.5 bg-white rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none w-full" value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        {status.type && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                                {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <p className="font-medium text-sm">{status.message}</p>
                            </div>
                        )}

                        <div className="flex justify-end border-t border-slate-100 pt-6">
                            <Button type="submit" disabled={isUploading} className="px-8 bg-indigo-600 hover:bg-indigo-700 shadow-md">
                                {isUploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Đang tải lên...</> : "Lưu Học Liệu"}
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Materials List */}
            <div className="bg-transparent md:bg-white md:border md:border-slate-200 md:rounded-xl overflow-hidden md:shadow-sm">
                {/* Desktop View Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mô Hình</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Môn Học</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lớp</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ngày Tải Lên</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Hành Động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                                        <div className="flex justify-center items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                            Đang tải dữ liệu...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredMaterials.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                                        Không có học liệu nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredMaterials.map((model) => (
                                    <tr key={model.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                {model.thumbnail ? (
                                                    <img src={model.thumbnail.startsWith('http') ? model.thumbnail : `${BASE_URL}${model.thumbnail}`} alt={model.title} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <Box className="w-6 h-6" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-slate-800 line-clamp-1">{model.title}</div>
                                                    <div className="text-xs text-slate-500 line-clamp-1 w-48">{model.description}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                                                {model.subject}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            Khối {model.grade}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {model.created_at ? new Date(model.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(model.id, model.title)}
                                                className="text-slate-400 hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50"
                                                title="Xóa học liệu"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View Card Grid (2 Columns) */}
                <div className="md:hidden">
                    {isLoading ? (
                        <div className="py-8 text-center text-slate-500 text-sm flex justify-center items-center gap-2">
                            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            Đang tải...
                        </div>
                    ) : filteredMaterials.length === 0 ? (
                        <div className="py-8 text-center text-slate-500 text-sm bg-white rounded-xl border border-slate-200">
                            Không có học liệu nào.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3">
                            {filteredMaterials.map((model) => (
                                <div key={model.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col relative group">
                                    <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden mb-2 relative">
                                        {model.thumbnail ? (
                                            <img src={model.thumbnail.startsWith('http') ? model.thumbnail : `${BASE_URL}${model.thumbnail}`} alt={model.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <Box className="w-8 h-8" />
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleDelete(model.id, model.title)}
                                            className="absolute top-1.5 right-1.5 p-1.5 bg-rose-500 text-white rounded-lg shadow-md"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <div className="space-y-1 flex-1">
                                        <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">{model.subject}</div>
                                        <h3 className="font-bold text-slate-800 text-xs line-clamp-2 leading-tight">{model.title}</h3>
                                        <div className="text-[10px] text-slate-500">Lớp {model.grade}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
