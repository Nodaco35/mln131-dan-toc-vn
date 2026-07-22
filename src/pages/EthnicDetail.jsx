import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shirt, Utensils, Users, BookOpen, 
  Sparkles, Compass, ZoomIn, X, ChevronLeft, ChevronRight, HelpCircle
} from 'lucide-react';
import data from '../data/data2.json';

// Bản đồ vùng miền cố định của 54 dân tộc
const REGION_MAPPING = {
  "thai": "Tây Bắc", "muong": "Tây Bắc", "mong": "Tây Bắc", "kho-mu": "Tây Bắc", 
  "ha-nhi": "Tây Bắc", "lao": "Tây Bắc", "khang": "Tây Bắc", "xinh-mun": "Tây Bắc", 
  "la-ha": "Tây Bắc", "lu": "Tây Bắc", "giay": "Tây Bắc", "phu-la": "Tây Bắc", 
  "la-hu": "Tây Bắc", "mang": "Tây Bắc", "cong": "Tây Bắc", "si-la": "Tây Bắc", "o-du": "Tây Bắc",
  
  "dao": "Đông Bắc", "tay": "Đông Bắc", "nung": "Đông Bắc", "san-chay": "Đông Bắc", 
  "san-diu": "Đông Bắc", "lo-lo": "Đông Bắc", "bo-y": "Đông Bắc", "co-lao": "Đông Bắc", 
  "la-chi": "Đông Bắc", "pu-peo": "Đông Bắc", "ngai": "Đông Bắc", "pa-then": "Đông Bắc",
  
  "tho": "Trường Sơn - Tây Nguyên", "chut": "Trường Sơn - Tây Nguyên", 
  "bru-van-kieu": "Trường Sơn - Tây Nguyên", "ta-oi": "Trường Sơn - Tây Nguyên", 
  "co-tu": "Trường Sơn - Tây Nguyên", "hre": "Trường Sơn - Tây Nguyên", "co": "Trường Sơn - Tây Nguyên", 
  "raglai": "Trường Sơn - Tây Nguyên", "gie-trieng": "Trường Sơn - Tây Nguyên", 
  "gia-rai": "Trường Sơn - Tây Nguyên", "e-de": "Trường Sơn - Tây Nguyên", 
  "ba-na": "Trường Sơn - Tây Nguyên", "xo-dang": "Trường Sơn - Tây Nguyên", 
  "mnong": "Trường Sơn - Tây Nguyên", "co-ho": "Trường Sơn - Tây Nguyên", 
  "ma": "Trường Sơn - Tây Nguyên", "chu-ru": "Trường Sơn - Tây Nguyên", 
  "ro-mam": "Trường Sơn - Tây Nguyên", "brau": "Trường Sơn - Tây Nguyên",
  
  "kinh": "Đồng bằng & Nam Bộ", "cham": "Đồng bằng & Nam Bộ", "khmer": "Đồng bằng & Nam Bộ", 
  "hoa": "Đồng bằng & Nam Bộ", "cho-ro": "Đồng bằng & Nam Bộ", "xtieng": "Đồng bằng & Nam Bộ"
};

// Component thẻ ảnh có thể ẩn nếu bị lỗi
const OptionalImageCard = ({ src, alt, onZoom }) => {
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div 
      onClick={() => onZoom(src, alt)}
      className="group cursor-pointer flex flex-col relative overflow-hidden rounded-2xl border border-primary/10 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-card-bg"
    >
      <div className="w-full aspect-[4/3] bg-linear-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden flex items-center justify-center">
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setError(true)}
        />
      </div>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/80 backdrop-blur-xs flex items-center gap-1 shadow-md">
          <ZoomIn className="w-4 h-4" /> Phóng to
        </span>
      </div>
    </div>
  );
};

// Component hiệu ứng Typewriter cho Mascot
const MascotIntro = ({ text, ethnicName }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Reset khi text thay đổi
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 20); // Tốc độ gõ chữ (20ms/ký tự)
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div className="bg-linear-to-br from-primary/5 to-secondary/10 dark:from-amber-950/20 dark:to-orange-950/10 border border-primary/15 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
      
      {/* Avatar Mascot */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-primary to-orange-500 flex items-center justify-center text-white text-4xl shadow-lg border-2 border-white dark:border-slate-800 shrink-0 animate-float">
        👩‍🌾
      </div>

      {/* Lời thoại */}
      <div className="flex-grow text-left">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-display font-bold text-lg text-primary dark:text-amber-400">
            Sứ giả Văn hóa {ethnicName}
          </h4>
          <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-500"></span>
        </div>
        <p className="text-base md:text-lg leading-relaxed text-text-main font-semibold italic typewriter-cursor pr-1 min-h-[60px]">
          "{displayedText}"
        </p>
      </div>
    </div>
  );
};

const EthnicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Tìm dữ liệu dân tộc dựa trên id từ URL
  const ethnicData = data.find(item => item.id === id);

  // Khai báo state cho Lightbox
  const [activeImage, setActiveImage] = useState(null);
  
  // Đồng bộ Dark Mode từ localStorage khi load trang
  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Cuộn lên đầu trang khi vào chi tiết
    window.scrollTo(0, 0);
  }, [id]);

  if (!ethnicData) {
    return (
      <div className="min-h-screen bg-bg-site flex flex-col items-center justify-center p-8 text-center">
        <HelpCircle className="w-16 h-16 text-primary mb-4" />
        <h2 className="text-2xl font-bold text-primary dark:text-amber-500">Không tìm thấy thông tin dân tộc!</h2>
        <p className="text-text-muted mt-2">Dữ liệu có thể đã bị thay đổi hoặc đường dẫn không chính xác.</p>
        <Link 
          to="/" 
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/95 text-white text-sm font-semibold rounded-xl transition-all shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại trang chủ
        </Link>
      </div>
    );
  }

  // Khai báo các chuyên mục nội dung kèm Icon và Màu sắc tương ứng
  const sections = [
    { 
      key: 'trang_phuc', 
      title: 'Trang Phục', 
      icon: Shirt,
      color: "border-sky-500 dark:border-sky-400 bg-sky-500/5 text-sky-600 dark:text-sky-400"
    },
    { 
      key: 'am_thuc', 
      title: 'Ẩm Thực', 
      icon: Utensils,
      color: "border-emerald-500 dark:border-emerald-400 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
    },
    { 
      key: 'phong_tuc', 
      title: 'Phong Tục', 
      icon: Users,
      color: "border-amber-500 dark:border-amber-400 bg-amber-500/5 text-amber-600 dark:text-amber-400"
    },
    { 
      key: 'chuyen_ke', 
      title: 'Chuyện Kể', 
      icon: BookOpen,
      color: "border-rose-500 dark:border-rose-400 bg-rose-500/5 text-rose-600 dark:text-rose-400"
    },
  ];

  const region = REGION_MAPPING[ethnicData.id] || 'Chưa xác định';

  // Lời thoại của Mascot (nếu không có thì tự tạo lời thoại chào mừng động)
  const defaultMascotIntro = `Xin chào! Ta rất vui được chào đón bạn ghé thăm góc văn hóa truyền thống của đồng bào dân tộc ${ethnicData.name.replace("Dân tộc ", "")}. Hãy cùng ta khám phá những nét tinh hoa trong đời sống của dân tộc nhé!`;
  const mascotText = ethnicData.mascot_intro || defaultMascotIntro;

  // Xử lý zoom ảnh
  const handleZoomImage = (src, alt) => {
    setActiveImage({ src, alt });
  };

  return (
    <div className="min-h-screen bg-bg-site font-sans text-text-main transition-colors duration-300 relative pb-20">
      
      {/* Nền hoa văn mờ */}
      <div className="absolute inset-0 bg-ethnic-pattern pointer-events-none opacity-5"></div>

      {/* Header Banner */}
      <header className="relative w-full overflow-hidden bg-linear-to-r from-primary to-orange-700 dark:from-slate-900 dark:to-orange-950/80 py-16 md:py-24 px-6 text-center text-white border-b-4 border-secondary shadow-md">
        
        {/* Nút Quay Lại (Back Button) - Cải tiến theo yêu cầu người dùng */}
        <div className="absolute top-6 left-6 z-30">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/35 hover:bg-black/55 backdrop-blur-md text-white font-bold text-base transition-all hover:-translate-x-0.5 active:scale-95 border border-white/10 shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Trang trí hoa văn */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none flex items-center justify-center">
          <div className="w-[450px] h-[450px] rounded-full border border-white/5 flex items-center justify-center">
            <div className="w-[300px] h-[300px] rounded-full border border-white/5"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-sm font-extrabold tracking-widest uppercase mb-4 border border-white/10">
            📍 Vùng địa lý: {region}
          </span>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-wide uppercase mb-4 drop-shadow-md">
            {ethnicData.name}
          </h1>
          <div className="w-24 h-1.5 bg-secondary mx-auto rounded-full mt-2"></div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-16 relative z-10">
        
        <div className="space-y-12">
          
          {/* Mascot Intro */}
          <MascotIntro text={mascotText} ethnicName={ethnicData.name.replace("Dân tộc ", "")} />

          {/* Các chuyên mục văn hóa */}
          <div className="space-y-10">
            {sections.map(section => {
              const SectionIcon = section.icon;
              const contentText = ethnicData.content[section.key];

              // Bỏ qua nếu chuyên mục trống thông tin
              if (!contentText || contentText.trim() === "" || contentText.includes("Không tìm thấy thông tin")) return null;

              return (
                <section 
                  key={section.key} 
                  className={`bg-card-bg border border-primary/5 rounded-3xl shadow-md p-6 md:p-8 border-l-4 transition-all duration-300 hover:shadow-lg ${section.color.split(" ")[0]}`}
                >
                  {/* Tiêu đề Section */}
                  <h2 className="text-3xl font-bold text-text-main mb-6 flex items-center gap-3.5 border-b border-primary/5 pb-3">
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${section.color.split(" ").slice(1).join(" ")}`}>
                      <SectionIcon className="w-6 h-6" />
                    </span>
                    <span className="font-display tracking-wide text-2xl md:text-3xl uppercase">
                      {section.title}
                    </span>
                  </h2>
                  
                  {/* Nội dung chữ */}
                  <p className="text-lg md:text-xl leading-relaxed text-text-main/95 font-medium mb-8 whitespace-pre-wrap pl-1 md:pl-2">
                    {contentText}
                  </p>

                  {/* Grid hình ảnh minh họa */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                    {[1, 2, 3].map(imgIndex => {
                      const imageName = ethnicData.images?.[section.key]?.[imgIndex - 1] || `${section.key}_${imgIndex}.jpg`;
                      return (
                        <OptionalImageCard 
                          key={imgIndex}
                          src={`/images/${id}/${imageName}`}
                          alt={`${section.title} ${imgIndex}`}
                          onZoom={handleZoomImage}
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
          
        </div>
      </main>

      {/* Lightbox Modal phóng to ảnh */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          
          {/* Nút Đóng Lightbox */}
          <button 
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close image zoom"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Khung ảnh */}
          <div className="relative max-w-[90vw] max-h-[80vh] flex items-center justify-center">
            <img 
              src={activeImage.src} 
              alt={activeImage.alt} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
            />
          </div>

          {/* Chú thích ảnh */}
          <div className="text-center text-white/90 text-sm md:text-base font-serif italic mt-6 max-w-xl">
            {activeImage.alt}
          </div>
        </div>
      )}
    </div>
  );
};

export default EthnicDetail;
