import { Layout } from "../components/Layout";
import { useState, useEffect } from "react";
import { Upload, CheckCircle2, AlertCircle, ArrowLeft, Loader2, ImagePlus, X } from "lucide-react";
import { useNavigate } from "react-router";
import Button from "../components/Button";
import { api } from "../services/api";

export default function UploadModelPage() {
    const navigate = useNavigate();

    // Check admin role from localStorage
    const [isAdmin, setIsAdmin] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        try {
            const userData = localStorage.getItem('edu_tech_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    navigate('/dashboard');
                }
            } else {
                navigate('/login');
            }
        } catch {
            navigate('/login');
        } finally {
            setIsCheckingAuth(false);
        }
    }, [navigate]);

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

    if (isCheckingAuth) return null;
    if (!isAdmin) return null;

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

            // Revoke old object URL to prevent memory leak
            if (thumbnailPreview) {
                URL.revokeObjectURL(thumbnailPreview);
            }

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setStatus({ type: 'error', message: "Vui lòng chọn tệp mô hình 3D" });
            return;
        }

        setIsUploading(true);
        setStatus({ type: null, message: "" });

        try {
            // 1. Upload model file to get URL
            const uploadRes = await api.uploadModelFile(file);

            // 2. Upload thumbnail if provided
            let thumbnailUrl = null;
            if (thumbnailFile) {
                const thumbRes = await api.uploadThumbnail(thumbnailFile);
                thumbnailUrl = thumbRes.thumbnail_url;
            }

            // 3. Save metadata to database
            const modelData = {
                ...formData,
                file_url: uploadRes.file_url,
                thumbnail: thumbnailUrl,
                tags: formData.tags.split(',').map(t => t.trim()).filter(t => t !== ""),
            };

            await api.saveModel(modelData);

            setStatus({ type: 'success', message: "Tải lên và lưu thông tin thành công!" });
            setTimeout(() => navigate('/library'), 2000);
        } catch (err: any) {
            setStatus({ type: 'error', message: "Có lỗi xảy ra: " + err.message });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Layout>
            <div className="p-8 max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                </button>

                <h1 className="text-3xl font-bold mb-8 text-foreground">Tải lên mô hình 3D mới</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* File Upload Area */}
                    <div className="bg-card border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 transition-colors relative">
                        <input
                            type="file"
                            accept=".glb,.gltf"
                            onChange={handleFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
                                <Upload className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">
                                {file ? file.name : "Kéo thả hoặc nhấp để chọn tệp"}
                            </h3>
                            <p className="text-muted-foreground">Hỗ trợ định dạng .glb, .gltf (Tối đa 50MB)</p>
                        </div>
                    </div>

                    {/* Thumbnail Upload Area */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <label className="text-sm font-medium mb-3 block">Ảnh đại diện (Avatar)</label>
                        <div className="flex items-start gap-4">
                            {thumbnailPreview ? (
                                <div className="relative group">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="w-32 h-32 object-cover rounded-xl border-2 border-primary/30 shadow-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeThumbnail}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="relative w-32 h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center hover:border-primary/50 transition-colors cursor-pointer bg-muted/20">
                                    <input
                                        type="file"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        onChange={handleThumbnailChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <ImagePlus className="w-8 h-8 text-muted-foreground mb-1" />
                                    <span className="text-xs text-muted-foreground">Chọn ảnh</span>
                                </div>
                            )}
                            <div className="flex-1 text-sm text-muted-foreground pt-2">
                                <p className="mb-1">Ảnh đại diện được hiển thị trong thư viện học liệu.</p>
                                <p>Hỗ trợ: <span className="font-medium text-foreground">.jpg, .png, .webp</span> (Tối đa 5MB)</p>
                            </div>
                        </div>
                    </div>

                    {/* Metadata Fields */}
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Tiêu đề học liệu</label>
                            <input
                                type="text"
                                required
                                placeholder="Ví dụ: Cấu tạo nguyên tử Hydro"
                                className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Mô tả chi tiết</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Mô tả nội dung và các tương tác chính của mô hình..."
                                className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Môn học</label>
                                <select
                                    className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option value="physics">Vật lý</option>
                                    <option value="chemistry">Hóa học</option>
                                    <option value="biology">Sinh học</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Lớp</label>
                                <select
                                    className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none"
                                    value={formData.grade}
                                    onChange={(e) => setFormData({ ...formData, grade: parseInt(e.target.value) })}
                                >
                                    <option value={10}>Lớp 10</option>
                                    <option value={11}>Lớp 11</option>
                                    <option value={12}>Lớp 12</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Từ khóa (cách nhau bởi dấu phẩy)</label>
                            <input
                                type="text"
                                placeholder="nguyên tử, cấu tạo, vật lý lượng tử..."
                                className="p-3 bg-muted/30 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Status Messages */}
                    {status.type && (
                        <div className={`flex items-center gap-3 p-4 rounded-xl border ${status.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            <p className="font-medium">{status.message}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full py-4 text-lg font-bold shadow-lg"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                Đang xử lý tải lên...
                            </>
                        ) : (
                            "Lưu và đăng tải học liệu"
                        )}
                    </Button>
                </form>
            </div>
        </Layout>
    );
}
