import { Link } from 'react-router';
import { BookOpen, Sparkles, Maximize2, ChevronRight, FlaskConical, Sprout, Users, Globe2, Lightbulb, Menu, X, Eye } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

export default function Landing() {
    const aboutUsRef = useRef<HTMLElement>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<{ name: string; image: string; description: string } | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToAbout = () => {
        setIsMenuOpen(false);
        aboutUsRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const features = [
        {
            icon: BookOpen,
            title: 'Thư viện phong phú',
            description: 'Hàng trăm mô hình 3D và infographic về Vật lý, Hóa học, Sinh học',
            color: 'from-blue-500 to-blue-600',
        },
        {
            icon: Sparkles,
            title: 'Find with AI',
            description: 'Tìm kiếm học liệu phù hợp bằng AI từ mô tả văn bản',
            color: 'from-green-500 to-green-600',
        },
        {
            icon: Maximize2,
            title: 'Chế độ trình chiếu',
            description: 'Hiển thị toàn màn hình cho dạy học trên lớp',
            color: 'from-purple-500 to-purple-600',
        },
    ];

    const subjects = [
        {
            name: 'Vật lý',
            icon: FlaskConical,
            color: 'bg-blue-500',
            image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=1200&auto=format&fit=crop',
            description: 'Khám phá thế giới qua các định luật chuyển động, điện từ và quang học với mô hình 3D trực quan.'
        },
        {
            name: 'Hóa học',
            icon: FlaskConical,
            color: 'bg-green-500',
            image: 'https://images.unsplash.com/photo-1603126010305-2f19069c9d4b?q=80&w=1200&auto=format&fit=crop',
            description: 'Quan sát các phản ứng hóa học và cấu trúc phân tử một cách sống động, không cần vào phòng thí nghiệm.'
        },
        {
            name: 'Sinh học',
            icon: Sprout,
            color: 'bg-emerald-500',
            image: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=1200&auto=format&fit=crop',
            description: 'Đi sâu vào cấu trúc tế bào và các hệ cơ quan với kho tàng infographic chi tiết và chính xác.'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-slate-900">
            {/* Header */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b' : 'bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent leading-none">Edu Tech</h1>
                            <p className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5">Khoa học Tự nhiên</p>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link
                            to="/guide"
                            className="px-4 py-2 text-slate-600 hover:text-primary transition-colors font-semibold"
                        >
                            Hướng dẫn
                        </Link>
                        <Link
                            to="/login"
                            className="px-4 py-2 text-slate-600 hover:text-primary transition-colors font-semibold"
                        >
                            Đăng nhập
                        </Link>
                        <Link
                            to="/register"
                            className="ml-4 px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
                        >
                            Đăng ký
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl animate-in slide-in-from-top-2 duration-300">
                        <div className="p-4 flex flex-col gap-2">
                            <Link to="/guide" className="px-4 py-3 text-slate-700 font-semibold hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                Hướng dẫn
                            </Link>
                            <Link to="/login" className="px-4 py-3 text-slate-700 font-semibold hover:bg-slate-50 rounded-lg" onClick={() => setIsMenuOpen(false)}>
                                Đăng nhập
                            </Link>
                            <Link to="/register" className="px-4 py-4 bg-primary text-white rounded-xl font-bold text-center mt-2" onClick={() => setIsMenuOpen(false)}>
                                Đăng ký miễn phí
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Hero Section */}
            <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 lg:pt-52 lg:pb-32 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

                {/* Decorative blob */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-24">
                        {/* Left Column: Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100/50 text-blue-600 rounded-full mb-6 animate-in fade-in slide-in-from-left-4">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span className="text-xs sm:text-sm font-bold tracking-wide uppercase">Nền tảng học tập THPT Việt Nam</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-[900] mb-6 tracking-tight leading-[1.1] text-slate-900 max-w-3xl">
                                Khoa học Tự nhiên
                                <span className="block mt-2 bg-gradient-to-r from-primary via-indigo-500 to-blue-600 bg-clip-text text-transparent">
                                    Tương tác & Sống động
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg md:text-xl text-slate-600 mx-auto lg:mx-0 mb-8 sm:mb-10 leading-relaxed max-w-xl font-medium">
                                Biến những bài giảng nhàm chán thành trải nghiệm thị giác tuyệt vời với mô hình 3D và infographic.
                                Tiếp thu kiến thức Vật lý, Hóa học, Sinh học một cách tự nhiên nhất.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
                                <Link
                                    to="/register"
                                    className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/95 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 active:scale-95"
                                >
                                    Bắt đầu miễn phí
                                    <ChevronRight className="w-5 h-5" />
                                </Link>

                                <button
                                    onClick={scrollToAbout}
                                    className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-lg shadow-sm"
                                >
                                    Tìm hiểu thêm
                                </button>
                            </div>

                            {/* Subject badges */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mt-10 sm:mt-12">
                                <span className="text-xs sm:text-sm text-slate-500 font-bold uppercase tracking-wider w-full lg:w-auto mb-2 lg:mb-0 lg:mr-2">Khám phá:</span>
                                {subjects.map((subject) => {
                                    const Icon = subject.icon;
                                    return (
                                        <button
                                            key={subject.name}
                                            onClick={() => setSelectedSubject(subject)}
                                            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-primary/60 transition-all hover:shadow-md hover:scale-105 active:scale-95 group"
                                        >
                                            <div className={`w-5 h-5 sm:w-6 sm:h-6 ${subject.color} rounded-lg flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform`}>
                                                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                            </div>
                                            <span className="font-bold text-[12px] sm:text-sm text-slate-700">{subject.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Right Column: Demo Video/Graphics */}
                        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative animate-in zoom-in duration-700">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-indigo-500/10 rounded-3xl blur-3xl transform rotate-3"></div>

                            {/* Main Video Container */}
                            <div className="relative rounded-[2rem] bg-slate-900 p-2 sm:p-3 shadow-2xl overflow-hidden aspect-video group transform transition-transform duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent z-10 pointer-events-none rounded-[1.8rem]"></div>
                                <iframe
                                    className="w-full h-full rounded-[1.5rem] relative z-0"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?controls=1&rel=0&playsinline=1&modestbranding=1&loop=1&playlist=dQw4w9WgXcQ"
                                    title="Edu Tech Demo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>

                            {/* Floating decorative elements - Hidden on smaller mobile */}
                            <div className="hidden sm:flex absolute -left-6 top-1/4 w-14 h-14 bg-white rounded-2xl shadow-xl items-center justify-center border border-slate-100 animate-bounce transition-all hover:scale-110 z-20" style={{ animationDuration: '3s' }}>
                                <FlaskConical className="w-7 h-7 text-blue-500" />
                            </div>
                            <div className="hidden sm:flex absolute -right-4 bottom-1/4 w-16 h-16 bg-white rounded-2xl shadow-xl items-center justify-center border border-slate-100 animate-bounce transition-all hover:scale-110 z-20" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                                <BookOpen className="w-8 h-8 text-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subject Preview Modal */}
            {selectedSubject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedSubject(null)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-slate-600 hover:text-slate-900 hover:bg-white shadow-lg transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex flex-col lg:flex-row">
                            <div className="flex-1 h-64 lg:h-auto relative group">
                                <img
                                    src={selectedSubject.image}
                                    alt={selectedSubject.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent flex items-end p-8">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white border border-white/30">
                                        <Eye className="w-4 h-4" />
                                        <span className="text-sm font-bold tracking-wide">Xem trước học liệu mẫu</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-1 p-8 sm:p-12 flex flex-col justify-center">
                                <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4">{selectedSubject.name}</h3>
                                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                    {selectedSubject.description}
                                </p>
                                <div className="space-y-4">
                                    <Link
                                        to="/register"
                                        className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
                                    >
                                        Khám phá trọn bộ thư viện
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                    <p className="text-center text-sm text-slate-400 font-bold uppercase tracking-widest">Duy nhất tại Edu Tech</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* About Us Section */}
            <section ref={aboutUsRef} className="py-20 md:py-32 bg-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row gap-12 sm:gap-16 lg:gap-24 items-center">
                        <div className="flex-1 relative w-full">
                            <div className="aspect-square rounded-full bg-gradient-to-tr from-green-50 to-blue-50 absolute -inset-10 blur-3xl -z-10 opacity-70"></div>
                            <div className="grid grid-cols-2 gap-3 sm:gap-6">
                                <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=800&auto=format&fit=crop" alt="Education" className="rounded-2xl sm:rounded-[2rem] shadow-xl mt-6 sm:mt-12 transition-transform hover:scale-105 duration-500 border-4 border-white" />
                                <img src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=800&auto=format&fit=crop" alt="Technology" className="rounded-2xl sm:rounded-[2rem] shadow-xl -mt-6 sm:-mt-12 transition-transform hover:scale-105 duration-500 border-4 border-white" />
                            </div>

                            {/* Floating label */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-2xl shadow-2xl border border-white/50 text-center hidden sm:block">
                                <p className="text-primary font-black text-2xl">VN STEM</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Digital Platform</p>
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full mb-6 border border-green-100">
                                <Globe2 className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider px-1">Về Chúng Tôi</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-slate-900 leading-[1.15]">
                                Edu Tech - Sứ mệnh chuyển đổi số giáo dục
                            </h2>
                            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed font-medium">
                                Được thành lập với mong muốn mang công nghệ 3D và AI tiên tiến vào các lớp học phổ thông, Edu Tech tự hào là nền tảng đi đầu trong việc cung cấp học liệu chất trực quan tại Việt Nam.
                            </p>
                            <div className="space-y-6 mt-8">
                                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 group-hover:scale-110 transition-transform">
                                        <Lightbulb className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">Tầm nhìn</h4>
                                        <p className="text-slate-600 text-[15px] sm:text-base">Trở thành bách khoa toàn thư 3D lớn nhất cho giáo dục trung học tại Việt Nam.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start group">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100 group-hover:scale-110 transition-transform">
                                        <Users className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 mb-2">Giá trị cốt lõi</h4>
                                        <p className="text-slate-600 text-[15px] sm:text-base">Lấy học sinh làm trung tâm, giáo dục không giới hạn sự sáng tạo và tương tác.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-32">
                <div className="text-center mb-16 md:mb-20">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">Tính năng nổi bật</h2>
                    <div className="w-20 h-1.5 bg-primary mx-auto rounded-full mb-6"></div>
                    <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-medium">
                        Công cụ học tập hiện đại giúp học sinh và giáo viên dễ dàng tiếp cận kiến thức nhanh chóng
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div key={index} className="group bg-white border border-slate-100 rounded-3xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border-b-4 hover:border-b-primary">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-black mb-3 text-slate-800">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed font-medium text-[15px] sm:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="relative bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 md:p-20 text-white text-center shadow-2xl overflow-hidden group">
                    {/* Animated background circles */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl"></div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 relative z-10 leading-tight">
                        Sẵn sàng bứt phá <br className="sm:hidden" /> kiến thức?
                    </h2>
                    <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto relative z-10 font-medium">
                        Tham gia Edu Tech và khám phá cách học Khoa học Tự nhiên hiện đại,
                        tương tác và hiệu quả nhất ngay hôm nay
                    </p>
                    <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-10 py-5 bg-white text-primary rounded-2xl font-black hover:bg-slate-50 transition-all text-lg shadow-xl hover:-translate-y-1 active:scale-95"
                        >
                            Đăng ký miễn phí
                        </Link>
                    </div>
                    <p className="text-slate-400 text-xs sm:text-sm mt-8 relative z-10 font-bold uppercase tracking-widest">No Card Required • Instant Access</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 mt-20 md:mt-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-2xl font-black bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">Edu Tech</span>
                            </div>
                            <p className="text-slate-500 max-w-xs mb-6 font-medium leading-relaxed">
                                Nền tảng học liệu 3D và tương tác hàng đầu cho học sinh THPT chuyên ngành học tự nhiên tại Việt Nam.
                            </p>
                            <div className="flex gap-4">
                                {/* Social mockups */}
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <Globe2 className="w-5 h-5" />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-slate-900 font-black mb-6 uppercase tracking-widest text-sm">Hướng dẫn</h4>
                            <ul className="space-y-4">
                                <li><Link to="/guide" className="text-slate-500 hover:text-primary font-bold transition-colors">Tài liệu học tập</Link></li>
                                <li><Link to="/guide" className="text-slate-500 hover:text-primary font-bold transition-colors">Cách dùng Mô hình 3D</Link></li>
                                <li><Link to="/pricing" className="text-slate-500 hover:text-primary font-bold transition-colors">Bảng giá</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-slate-900 font-black mb-6 uppercase tracking-widest text-sm">Pháp lý</h4>
                            <ul className="space-y-4">
                                <li><button className="text-slate-500 hover:text-primary font-bold transition-colors">Điều khoản dịch vụ</button></li>
                                <li><button className="text-slate-500 hover:text-primary font-bold transition-colors">Chính sách bảo mật</button></li>
                                <li><button className="text-slate-500 hover:text-primary font-bold transition-colors">Liên hệ hỗ trợ</button></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-slate-400 font-bold">
                            © 2026 Edu Tech Vietnam. Build for high performance.
                        </p>
                        <div className="flex gap-8">
                            <span className="text-xs text-slate-400 font-black uppercase tracking-tighter">Powered by Gemini AI</span>
                            <span className="text-xs text-slate-400 font-black uppercase tracking-tighter">React 19 Framework</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
