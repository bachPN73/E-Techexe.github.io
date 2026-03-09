import { Layout } from '../components/Layout';
import { useState } from 'react';
import { Sparkles, Search, Loader2, BookOpen, Brain, Tag, FlaskConical } from 'lucide-react';
import { Link } from 'react-router';
import { getSubjectName, getTypeName, Material } from '../data/materialsData';
import { api, BASE_URL } from '../services/api';

export default function FindWithAI() {
    const [query, setQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<Material[]>([]);
    const [hasSearched, setHasSearched] = useState(false);

    // AI Insight state
    const [aiInsight, setAiInsight] = useState('');
    const [aiKeywords, setAiKeywords] = useState<string[]>([]);
    const [aiSubject, setAiSubject] = useState<string | null>(null);

    const exampleQueries = [
        'Cấu trúc nguyên tử và electron',
        'Chu trình hô hấp tế bào',
        'Định luật chuyển động Newton',
        'Bảng tuần hoàn hóa học',
        'Quá trình quang hợp ở thực vật',
    ];

    const handleSearch = async () => {
        if (!query.trim()) return;

        setIsSearching(true);
        setHasSearched(true);
        setAiInsight('');
        setAiKeywords([]);
        setAiSubject(null);

        try {
            const response = await api.aiSearch(query);

            // Map results to Material format
            const formattedResults: Material[] = response.results.map((m: any) => ({
                id: `db-${m.id}`,
                title: m.title,
                subject: m.subject,
                type: '3d-model' as const,
                description: m.description,
                thumbnail: m.thumbnail ? `${BASE_URL}${m.thumbnail}` : '3d-placeholder',
                tags: Array.isArray(m.tags) ? m.tags : [],
                grade: m.grade || 10,
                file_url: m.file_url,
            }));

            setResults(formattedResults);
            setAiInsight(response.ai_insight || '');
            setAiKeywords(response.keywords || []);
            setAiSubject(response.predicted_subject || null);
        } catch (error) {
            console.error('AI Search error:', error);
            setResults([]);
            setAiInsight('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleExampleClick = (example: string) => {
        setQuery(example);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    const subjectNameMap: Record<string, string> = {
        physics: 'Vật lý',
        chemistry: 'Hóa học',
        biology: 'Sinh học',
    };

    return (
        <Layout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-secondary to-green-600 rounded-2xl mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Find with AI</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Mô tả nội dung bạn muốn tìm kiếm, AI sẽ gợi ý các mô hình 3D và infographic phù hợp nhất
                    </p>
                </div>

                {/* Search input */}
                <div className="max-w-4xl mx-auto mb-12">
                    <div className="bg-card border-2 border-border rounded-2xl p-2 shadow-lg">
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <textarea
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Ví dụ: Tôi muốn tìm mô hình 3D về cấu trúc nguyên tử và các electron quay quanh hạt nhân..."
                                    className="w-full px-6 py-4 bg-transparent border-0 focus:outline-none resize-none min-h-[120px] text-lg"
                                    disabled={isSearching}
                                />
                            </div>
                        </div>
                        <div className="flex items-center justify-between px-4 pb-2">
                            <div className="text-sm text-muted-foreground">
                                {query.length} / 500 ký tự
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={!query.trim() || isSearching}
                                className="px-8 py-3 bg-gradient-to-r from-secondary to-green-600 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        AI đang phân tích...
                                    </>
                                ) : (
                                    <>
                                        <Search className="w-5 h-5" />
                                        Tìm kiếm
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Example queries */}
                    {!hasSearched && (
                        <div className="mt-6">
                            <p className="text-sm text-muted-foreground mb-3">Gợi ý tìm kiếm:</p>
                            <div className="flex flex-wrap gap-2">
                                {exampleQueries.map((example, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleExampleClick(example)}
                                        className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm transition-colors"
                                    >
                                        {example}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results */}
                {hasSearched && (
                    <div className="max-w-6xl mx-auto">
                        {isSearching ? (
                            <div className="text-center py-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary/20 to-green-500/20 rounded-full mb-6">
                                    <Brain className="w-10 h-10 text-secondary animate-pulse" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">AI đang phân tích yêu cầu của bạn...</h3>
                                <p className="text-muted-foreground mb-4">
                                    Gemini đang đọc hiểu nội dung và tìm kiếm học liệu phù hợp
                                </p>
                                <div className="flex justify-center gap-1">
                                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* AI Insight Panel */}
                                {aiInsight && (
                                    <div className="bg-gradient-to-r from-secondary/5 to-green-500/5 border border-secondary/20 rounded-2xl p-6 mb-8">
                                        <div className="flex items-start gap-3 mb-4">
                                            <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Brain className="w-5 h-5 text-secondary" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-base mb-1">AI Insight</h3>
                                                <p className="text-muted-foreground">{aiInsight}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-4">
                                            {/* Predicted Subject */}
                                            {aiSubject && (
                                                <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border">
                                                    <FlaskConical className="w-4 h-4 text-primary" />
                                                    <span className="text-sm font-medium">
                                                        Môn học: <span className="text-primary">{subjectNameMap[aiSubject] || aiSubject}</span>
                                                    </span>
                                                </div>
                                            )}

                                            {/* Keywords */}
                                            {aiKeywords.length > 0 && (
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Tag className="w-4 h-4 text-muted-foreground" />
                                                    {aiKeywords.slice(0, 6).map((kw, i) => (
                                                        <span key={i} className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary font-medium">
                                                            {kw}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Results header */}
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold mb-2">Kết quả tìm kiếm</h2>
                                    <p className="text-muted-foreground">
                                        Tìm thấy <span className="font-semibold text-foreground">{results.length}</span> kết quả phù hợp với yêu cầu của bạn
                                    </p>
                                </div>

                                {/* Results grid */}
                                {results.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-left">
                                        {results.map((material) => (
                                            <Link
                                                key={material.id}
                                                to={`/material/${material.id}`}
                                                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1"
                                            >
                                                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
                                                    {material.thumbnail && material.thumbnail !== '3d-placeholder' ? (
                                                        <img src={material.thumbnail} alt={material.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <BookOpen className="w-16 h-16 text-primary/30" />
                                                    )}
                                                    <div className="absolute top-3 right-3 bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        AI Match
                                                    </div>
                                                </div>
                                                <div className="p-3 sm:p-5 text-left">
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/10 text-primary font-medium whitespace-nowrap">
                                                            {getSubjectName(material.subject)}
                                                        </span>
                                                        <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-secondary/10 text-secondary font-medium whitespace-nowrap">
                                                            {getTypeName(material.type)}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold sm:font-bold mb-1 sm:mb-2 text-sm sm:text-lg line-clamp-2 leading-tight">{material.title}</h3>
                                                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-2 sm:mb-3">
                                                        {material.description}
                                                    </p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {(Array.isArray(material.tags) ? material.tags : []).slice(0, 2).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded bg-muted text-muted-foreground truncate max-w-[70px]"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16 bg-card border border-border rounded-xl">
                                        <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold mb-2">Không tìm thấy kết quả phù hợp</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Thử mô tả chi tiết hơn hoặc sử dụng từ khóa khác
                                        </p>
                                        <button
                                            onClick={() => {
                                                setQuery('');
                                                setHasSearched(false);
                                                setResults([]);
                                                setAiInsight('');
                                                setAiKeywords([]);
                                                setAiSubject(null);
                                            }}
                                            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                                        >
                                            Tìm kiếm lại
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
}
