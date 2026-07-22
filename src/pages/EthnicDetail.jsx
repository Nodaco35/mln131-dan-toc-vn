import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Shirt, Utensils, Users, BookOpen, 
  Compass, ZoomIn, X, HelpCircle,
  Volume2, VolumeX, Award, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '../data/data2.json';

// Variants cho framer-motion (Hiệu ứng mượt mà, chuyên nghiệp)
const elegantReveal = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'tween', ease: 'easeOut', duration: 0.8 } 
  }
};

// Bản đồ vùng miền cố định của 54 dân tộc
const REGION_MAPPING = {
  "thai": "Tây Bắc", "muong": "Tây Bắc", "mong": "Tây Bắc", "kho-mu": "Tây Bắc", 
  "ha-nhi": "Tây Bắc", "lao": "Tây Bắc", "khang": "Tây Bắc", "xinh-mun": "Tây Bắc", 
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

// Component Pháo Hoa Rơi ăn mừng trắc nghiệm (Tông màu vàng kim loại cao cấp)
const ConfettiRain = () => {
  const pieces = Array.from({ length: 45 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {pieces.map((_, i) => {
        const left = Math.random() * 100; // %
        const delay = Math.random() * 1.8; // s
        const duration = 1.8 + Math.random() * 1.6; // s
        const color = ['bg-amber-400', 'bg-yellow-300', 'bg-amber-500', 'bg-yellow-500', 'bg-orange-400'][Math.floor(Math.random() * 5)];
        const size = Math.random() * 6 + 5; // px
        
        return (
          <div
            key={i}
            className={`absolute top-[-10px] rounded-xs ${color}`}
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `fall ${duration}s linear infinite`,
              animationDelay: `${delay}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        );
      })}
    </div>
  );
};

// Component Bụi Vàng Phát Sáng Rực Rỡ Bay Bổng (Ambient Sparks) cho Banner
const AmbientSparks = () => {
  const sparks = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {sparks.map((_, i) => {
        const left = Math.random() * 100;
        const size = Math.random() * 3.5 + 2; // 2px to 5.5px (Rõ ràng hơn)
        const delay = Math.random() * 8; // s
        const duration = 7 + Math.random() * 7; // s
        return (
          <div
            key={i}
            className="absolute bottom-[-10px] rounded-full bg-linear-to-b from-yellow-300 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-[float-up_linear_infinite]"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`
            }}
          />
        );
      })}
    </div>
  );
};

// Hướng dẫn nét văn hóa / Thử thách trắc nghiệm di sản
const getQuizData = (id, name) => {
  const shortName = name ? name.replace("Dân tộc ", "") : "";
  switch (id) {
    case 'thai':
      return {
        question: `Nét lãng mạn vô giá trong tình yêu đôi lứa của đồng bào ${shortName} là tục nào sau đây?`,
        options: ["Tục cấp sắc trưởng thành", "Tục chọc sàn tìm bạn tình", "Tục kéo vợ đầu xuân", "Tục búi tóc Tằng cẩu"],
        correct: 1,
        hint: "Mách nhỏ: Các chàng trai gõ gậy vách gỗ gọi bạn gái thức giấc lúc nửa đêm trăng thanh."
      };
    case 'mong':
      return {
        question: `Chiếc khèn truyền thống của đồng bào ${shortName} gồm bao nhiêu ống trúc ghép lại?`,
        options: ["4 ống trúc", "5 ống trúc", "6 ống trúc", "7 ống trúc"],
        correct: 2,
        hint: "Mách nhỏ: Tượng trưng cho tình anh em keo sơn của 6 người con trai mồ côi trong truyền thuyết."
      };
    case 'muong':
      return {
        question: `Họa tiết nghệ thuật tinh xảo trên cạp váy của phụ nữ ${shortName} phỏng theo văn hóa thời kỳ nào?`,
        options: ["Vavan hóa Sa Huỳnh", "Văn hóa Đông Sơn", "Văn hóa Đồng Nai", "Văn hóa Hòa Bình"],
        correct: 1,
        hint: "Mách nhỏ: Mang hoa văn chim lạc, rồng đất của tổ tiên văn minh lúa nước cổ đại."
      };
    case 'dao':
      return {
        question: `Nghi lễ truyền thống quan trọng nhất đánh dấu sự trưởng thành của nam giới đồng bào ${shortName} có tên là gì?`,
        options: ["Lễ hội sắc bùa", "Lễ cấp sắc", "Lễ cầu mưa", "Lễ ăn mừng cơm mới"],
        correct: 1,
        hint: "Mách nhỏ: Nghi lễ này công nhận họ là con cháu Bàn Vương chính thức."
      };
    case 'ha-nhi':
      return {
        question: `Kiến trúc nhà ở truyền thống nổi tiếng của đồng bào ${shortName} (ấm áp mùa đông, mát mẻ mùa hè) có tên gọi là gì?`,
        options: ["Nhà sàn gỗ pơ mu", "Nhà trình tường đất nện", "Nhà rông mái cao", "Nhà trệt mái lá cọ"],
        correct: 1,
        hint: "Mách nhỏ: Đất đỏ được đưa vào khuôn rồi nện chặt bằng chày gỗ, dày tới 40-60cm."
      };
    default:
      return {
        question: `Vùng địa lý cư trú chủ yếu của đồng bào ${shortName} là vùng nào?`,
        options: ["Tây Bắc", "Đông Bắc", "Trường Sơn - Tây Nguyên", "Đồng bằng & Nam Bộ"],
        correct: -1, 
        hint: "Hãy thử nhớ lại thông tin ở phần Vùng địa lý ở đầu trang."
      };
  }
};

// Component Mini-game Trắc nghiệm văn hóa di sản (Heritage Trivia Game)
const HeritageQuiz = ({ id, ethnicData }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const quiz = getQuizData(id, ethnicData?.name);
  if (quiz.correct === -1) {
    const region = REGION_MAPPING[id] || "Chưa xác định";
    const options = ["Tây Bắc", "Đông Bắc", "Trường Sơn - Tây Nguyên", "Đồng bằng & Nam Bộ"];
    quiz.correct = options.indexOf(region);
  }

  const handleAnswer = (index) => {
    if (answered) return;
    setSelectedIdx(index);
    setAnswered(true);
    if (index === quiz.correct) {
      setShowConfetti(true);
    }
  };

  const handleReset = () => {
    setSelectedIdx(null);
    setAnswered(false);
    setShowConfetti(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-card-bg border border-amber-500/15 rounded-3xl p-6 shadow-lg overflow-hidden my-12 transition-all hover:shadow-amber-500/5 hover:border-amber-500/25">
      {showConfetti && <ConfettiRain />}

      <div className="flex justify-between items-center border-b border-primary/10 pb-3 mb-4">
        <h4 className="font-display font-bold text-lg text-primary dark:text-amber-400 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          <span>Góc Trắc Nghiệm Di Sản</span>
        </h4>
        <span className="text-xs font-bold bg-amber-500/10 text-amber-500 dark:text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
          Thử thách
        </span>
      </div>

      <p className="text-base md:text-lg font-bold text-text-main leading-relaxed mb-6">
        {quiz.question}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {quiz.options.map((option, idx) => {
          let btnStyle = "border-primary/10 hover:bg-primary/5 text-text-main hover:border-primary/45";
          
          if (answered) {
            if (idx === quiz.correct) {
              btnStyle = "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold scale-[1.02]";
            } else if (idx === selectedIdx) {
              btnStyle = "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300 font-bold";
            } else {
              btnStyle = "opacity-45 border-primary/5";
            }
          }

          return (
            <button
              key={idx}
              disabled={answered}
              onClick={() => handleAnswer(idx)}
              className={`p-3.5 rounded-xl border text-left text-sm font-semibold transition-all cursor-pointer ${btnStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="border-t border-primary/5 pt-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm font-medium italic text-text-muted">
            {selectedIdx === quiz.correct ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">🎉 Chính xác! Bạn trả lời rất tốt!</span>
            ) : (
              <span>Gợi ý: {quiz.hint}</span>
            )}
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  );
};

// Đường chia trang trí họa tiết di sản mạ vàng (Heritage divider accent)
const HeritageDivider = () => (
  <div className="flex items-center justify-center gap-4 my-10 opacity-30 select-none pointer-events-none">
    <div className="h-[1px] bg-gradient-to-r from-transparent to-amber-500 flex-grow"></div>
    <div className="flex items-center gap-1.5 text-amber-500">
      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
      <span className="text-[10px] tracking-widest uppercase font-bold">54 Dân tộc Việt Nam</span>
      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
    </div>
    <div className="h-[1px] bg-gradient-to-l from-transparent to-amber-500 flex-grow"></div>
  </div>
);

// Component Khung Tranh Chân Dung Di Sản (Tương tác nghiêng 3D thực tế theo chuột)
const ShowcaseFrame = ({ id }) => {
  const [hasImage, setHasImage] = useState(false);
  const imgUrl = `/images/${id}/trang_phuc_1.jpg`;
  const cardRef = useRef(null);

  useEffect(() => {
    setHasImage(false);
    const img = new Image();
    img.onload = () => setHasImage(true);
    img.onerror = () => setHasImage(false);
    img.src = imgUrl;
  }, [id, imgUrl]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tính toán góc nghiêng tối đa 12 độ theo tọa độ chuột
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mx-auto lg:ml-auto w-full max-w-[280px] aspect-[3/4] rounded-2xl p-3 bg-stone-900 border border-amber-500/20 shadow-2xl flex flex-col justify-between select-none cursor-pointer transition-all duration-200 ease-out [transform-style:preserve-3d] overflow-hidden"
    >
      {/* Lớp phủ vạt tối */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/85 pointer-events-none rounded-2xl" style={{ transform: 'translateZ(5px)', zIndex: 5 }}></div>

      {/* LỚP BỨC ẢNH CHÂN DUNG (Nằm ở giữa) */}
      <div 
        className="w-full h-[85%] rounded-xl overflow-hidden border border-amber-500/10 bg-stone-950 flex items-center justify-center relative"
        style={{ transform: 'translateZ(10px)', zIndex: 10 }}
      >
        {hasImage ? (
          <img src={imgUrl} alt="Chân dung di sản" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3 text-stone-500 p-4">
            <Sparkles className="w-12 h-12 text-amber-500/30 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest text-stone-400 text-center font-bold">54 di sản dân tộc</span>
          </div>
        )}
      </div>

      {/* Tấm mác đồng trưng bày */}
      <div 
        className="relative w-full text-center border-t border-amber-500/10 pt-2 flex flex-col items-center"
        style={{ transform: 'translateZ(15px)', zIndex: 12 }}
      >
        <span className="text-[9px] font-bold tracking-widest text-amber-400/90 uppercase">Bảo tàng số</span>
        <span className="text-[9px] font-semibold text-stone-400 uppercase tracking-wide">Chân dung di sản</span>
      </div>
    </div>
  );
};

// Component Thuyết Minh Tiếng Việt tự động (Audio Guide)
const AudioGuideButton = ({ textToRead, label = "Nghe thuyết minh" }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSynth(window.speechSynthesis);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const cleanText = (rawText) => {
    if (!rawText) return "";
    return rawText.replace(/[#*`_\-\[\]()]/g, '').trim();
  };

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (!synth) return;

    if (isPlaying) {
      if (isPaused) {
        synth.resume();
        setIsPaused(false);
      } else {
        synth.pause();
        setIsPaused(true);
      }
    } else {
      synth.cancel();
      const clean = cleanText(textToRead);
      const newUtterance = new SpeechSynthesisUtterance(clean);
      
      const voices = synth.getVoices();
      const viVoice = voices.find(voice => voice.lang.includes('vi') || voice.lang.includes('VI'));
      if (viVoice) {
        newUtterance.voice = viVoice;
      }
      newUtterance.rate = 0.95; 
      
      newUtterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      newUtterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      synth.speak(newUtterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };

  const handleStop = (e) => {
    e.stopPropagation();
    if (synth) {
      synth.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  if (!synth) return null;

  return (
    <div className="flex items-center gap-1.5 shrink-0 z-20">
      <button
        onClick={handlePlayPause}
        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer ${
          isPlaying 
            ? (isPaused ? 'bg-amber-500 text-white' : 'bg-emerald-600 text-white')
            : 'bg-primary/90 hover:bg-primary text-white'
        }`}
      >
        {isPlaying ? (
          isPaused ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              <span>Tiếp tục</span>
            </>
          ) : (
            <>
              <div className="flex gap-0.5 items-center h-3">
                <div className="w-0.5 h-2.5 bg-white rounded-full animate-bounce"></div>
                <div className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></div>
                <div className="w-0.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></div>
              </div>
              <span>Đang đọc...</span>
            </>
          )
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            <span>{label}</span>
          </>
        )}
      </button>

      {isPlaying && (
        <button
          onClick={handleStop}
          className="p-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-95 transition-all cursor-pointer"
          title="Dừng thuyết minh"
        >
          <VolumeX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

// Component Thư viện ảnh tương tác nâng cao (Tích hợp hiệu ứng lướt ảnh Cinematic)
const InteractiveGallery = ({ id, sectionKey, sectionTitle, imagesList, onZoom }) => {
  const [validImages, setValidImages] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setValidImages([]);
    setActiveIdx(0);

    const imageIndices = [1, 2, 3];
    const checkList = imageIndices.map(imgIndex => {
      const imageName = imagesList?.[sectionKey]?.[imgIndex - 1] || `${sectionKey}_${imgIndex}.jpg`;
      return {
        src: `/images/${id}/${imageName}`,
        alt: `${sectionTitle} - Hình minh họa ${imgIndex}`
      };
    });

    checkList.forEach(imgData => {
      const img = new Image();
      img.onload = () => {
        setValidImages(prev => {
          if (prev.some(p => p.src === imgData.src)) return prev;
          return [...prev, imgData].sort((a, b) => a.src.localeCompare(b.src));
        });
      };
      img.src = imgData.src;
    });
  }, [id, sectionKey, imagesList, sectionTitle]);

  if (validImages.length === 0) return null;

  return (
    <div className="mt-6 flex flex-col md:flex-row gap-5 items-stretch">
      {/* Khung ảnh hiển thị chính */}
      <div className="flex-grow relative overflow-hidden rounded-2xl border border-primary/10 shadow-md group min-h-[260px] max-h-[380px] bg-black/5 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.img 
            key={activeIdx}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            src={validImages[activeIdx].src} 
            alt={validImages[activeIdx].alt}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-5 z-10">
          <p className="text-white text-sm md:text-base font-serif italic drop-shadow-md">{validImages[activeIdx].alt}</p>
          <button 
            onClick={() => onZoom(validImages[activeIdx].src, validImages[activeIdx].alt)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black/40 hover:bg-primary/95 text-white backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-105 shadow-md cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Dải ảnh thu nhỏ */}
      {validImages.length > 1 && (
        <div className="flex md:flex-col gap-2.5 justify-center md:justify-start overflow-x-auto py-1 shrink-0 md:max-h-[380px]">
          {validImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIdx(index)}
              className={`w-18 h-18 md:w-22 md:h-[68px] rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                index === activeIdx 
                  ? 'border-secondary shadow-md scale-102 ring-2 ring-secondary/20' 
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img.src} alt="thumbnail" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Hàm lấy Emoji tương ứng của Mascot
const getMascotEmoji = (tabKey) => {
  switch (tabKey) {
    case 'trang_phuc': return '👗';
    case 'am_thuc': return '🍲';
    case 'phong_tuc': return '🌾';
    case 'chuyen_ke': return '📖';
    default: return '👩‍🌾';
  }
};

// Component giới thiệu chào hỏi của Sứ Giả Văn Hóa (Mascot)
const MascotIntro = ({ text, ethnicName, tabKey }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [text]);

  useEffect(() => {
    if (text && index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text.charAt(index));
        setIndex((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <div className="bg-linear-to-br from-primary/5 to-secondary/10 dark:from-amber-950/20 dark:to-orange-950/10 border border-primary/15 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-md relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
      
      {/* Mascot Avatar */}
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-linear-to-br from-primary to-orange-500 flex items-center justify-center text-white text-4xl shadow-lg border-2 border-white dark:border-slate-800 shrink-0 animate-float">
        {getMascotEmoji(tabKey)}
      </div>

      {/* Bong bóng hội thoại */}
      <div className="flex-grow text-left w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-primary/5 pb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-display font-bold text-lg text-primary dark:text-amber-400">
              Sứ giả Văn hóa {ethnicName}
            </h4>
            <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          
          <AudioGuideButton textToRead={text} label="Nghe sứ giả chào hỏi" />
        </div>
        <p className="text-base md:text-lg leading-relaxed text-text-main font-semibold italic typewriter-cursor pr-1 min-h-[60px]">
          "{displayedText}"
        </p>
      </div>
    </div>
  );
};

// Cấu trúc phân loại màu sắc và phong cách động cho từng Tab (Themed Exhibition Rooms)
// Tối ưu độ tương phản tối đa (Maximum accessibility & text contrast)
// Tích hợp bóng đổ màu sắc động theo chủ đề khi hover (Dynamic Colored Shadows)
const THEME_STYLES = {
  all: {
    bg: "bg-card-bg border-primary/10 border-l-primary hover:shadow-2xl hover:shadow-primary/5",
    titleIconBg: "bg-primary/10 text-primary dark:bg-amber-500/10 dark:text-amber-400",
    textStyle: "text-text-main font-sans",
    cardBorder: "border-primary/10"
  },
  trang_phuc: {
    bg: "bg-gradient-to-br from-sky-50/60 via-card-bg to-card-bg dark:from-sky-950/20 border-sky-500 dark:border-sky-400 border-l-sky-500 hover:shadow-2xl hover:shadow-sky-500/10",
    titleIconBg: "bg-sky-500/10 text-sky-600 dark:bg-sky-400/10 dark:text-sky-400",
    textStyle: "text-text-main font-sans",
    cardBorder: "border-sky-500/25"
  },
  am_thuc: {
    bg: "bg-gradient-to-br from-emerald-50/60 via-card-bg to-card-bg dark:from-emerald-950/20 border-emerald-500 dark:border-emerald-400 border-l-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10",
    titleIconBg: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/10 dark:text-emerald-400",
    textStyle: "text-text-main font-sans",
    cardBorder: "border-emerald-500/25"
  },
  phong_tuc: {
    bg: "bg-gradient-to-br from-amber-50/60 via-card-bg to-card-bg dark:from-amber-950/20 border-amber-500 dark:border-amber-400 border-l-amber-500 hover:shadow-2xl hover:shadow-amber-500/10",
    titleIconBg: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/10 dark:text-amber-400",
    textStyle: "text-text-main font-sans",
    cardBorder: "border-amber-500/25"
  },
  chuyen_ke: {
    bg: "bg-gradient-to-br from-rose-50/60 via-card-bg to-card-bg dark:from-rose-950/20 border-rose-500 dark:border-rose-400 border-l-rose-500 hover:shadow-2xl hover:shadow-rose-500/10 relative before:absolute before:inset-0 before:bg-[radial-gradient(#f43f5e_0.5px,transparent_0.5px)] before:bg-[size:16px_16px] before:opacity-3 before:pointer-events-none before:rounded-3xl",
    titleIconBg: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/10 dark:text-rose-400",
    textStyle: "text-text-main font-serif leading-relaxed pr-4",
    cardBorder: "border-rose-500/25"
  }
};

const EthnicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Tìm dữ liệu dân tộc
  const ethnicData = data.find(item => item.id === id);

  // Khai báo state cho Lightbox
  const [activeImage, setActiveImage] = useState(null);

  // Tab di sản di chuyển động
  const [activeTab, setActiveTab] = useState('all');
  
  // Đồng bộ Dark Mode từ localStorage khi load trang
  useEffect(() => {
    const root = window.document.documentElement;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
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

  // Các chuyên mục văn hóa kèm Icon và Màu tương ứng
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
  
  // Lời thoại chào mừng của Sứ giả
  const defaultMascotIntro = `Xin chào! Ta rất vui được chào đón bạn ghé thăm góc văn hóa truyền thống của đồng bào dân tộc ${ethnicData.name ? ethnicData.name.replace("Dân tộc ", "") : ""}. Hãy cùng ta khám phá những nét tinh hoa trong đời sống của dân tộc nhé!`;
  const mascotText = ethnicData.mascot_intro || defaultMascotIntro;

  // Lọc các chuyên mục có nội dung hợp lệ
  const activeSections = sections.filter(section => {
    const contentText = ethnicData.content?.[section.key];
    return contentText && contentText.trim() !== "" && !contentText.includes("Không tìm thấy thông tin");
  });

  // Khởi tạo danh sách Tabs
  const tabsList = activeSections.length > 0
    ? [{ key: 'all', title: 'Tất cả di sản', icon: Compass }, ...activeSections]
    : [];

  const handleZoomImage = (src, alt) => {
    setActiveImage({ src, alt });
  };

  return (
    <div className="min-h-screen bg-bg-site font-sans text-text-main transition-colors duration-300 relative pb-20 overflow-x-clip">
      
      {/* Nền hoa văn mờ */}
      <div className="absolute inset-0 bg-ethnic-pattern pointer-events-none opacity-5"></div>

      {/* Header Banner - Cổng Triển Lãm Bất Đối Xứng Tối Tân (Ultra Premium Split Screen) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full py-16 lg:py-24 px-6 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 text-white border-b border-amber-500/15 shadow-2xl overflow-hidden"
      >
        {/* Lớp phủ vầng sáng Ambient rực rỡ và rõ nét tuyệt đối */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/30 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[60%] h-[50px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent blur-md pointer-events-none z-0"></div>

        {/* Bụi vàng phát sáng rực rỡ và lung linh rõ rệt */}
        <AmbientSparks />

        {/* Hàng điều hướng trên cùng (Quay lại) */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-30">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white text-sm font-semibold transition-all border border-stone-850/60 backdrop-blur-md shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Bố cục lưới Split Screen 5 Cột */}
        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10 items-center text-left mt-8 lg:mt-4">
          
          {/* Cột trái (3/5) - Thông tin tóm tắt di sản */}
          <div className="lg:col-span-3 flex flex-col items-start gap-5">
            
            {/* Vùng địa lý badge */}
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-linear-to-r from-amber-500/25 to-orange-500/25 text-amber-300 text-xs font-extrabold uppercase tracking-widest border border-amber-500/35 shadow-[0_4px_12px_rgba(245,158,11,0.2)]">
              📍 Vùng địa lý: {region}
            </span>
            
            {/* Tên Dân Tộc với dải màu kim loại cao cấp */}
            <div>
              <h1 className="font-display text-4xl md:text-5.5xl font-extrabold tracking-wide uppercase bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-300 bg-clip-text text-transparent drop-shadow-md">
                {ethnicData.name}
              </h1>
              
              {/* Lời trích dẫn văn hóa / Sứ mệnh di sản */}
              <p className="text-stone-200/95 text-sm md:text-base font-serif italic max-w-md mt-4 leading-relaxed border-l-2 border-amber-500/40 pl-3 drop-shadow-sm">
                "{ethnicData.mascot_intro ? ethnicData.mascot_intro.split('.')[0] + '.' : 'Di sản văn hóa ngàn năm lấp lánh giữa dòng chảy lịch sử dân tộc.'}"
              </p>
            </div>
            
            <div className="w-16 h-0.5 bg-amber-500 rounded-full my-1"></div>
            
          </div>

          {/* Cột phải (2/5) - Khung ảnh nổi 3D bám đuổi chuột */}
          <div className="lg:col-span-2 w-full flex justify-center lg:justify-end">
            <ShowcaseFrame id={id} />
          </div>
          
        </div>
      </motion.header>

      {/* Layout nội dung chính */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 pt-10 pb-16 relative z-10">
        
        <div className="space-y-10">
          
          {/* Sứ giả chào mừng */}
          <motion.div 
            variants={elegantReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
          >
            <MascotIntro text={mascotText} ethnicName={ethnicData.name ? ethnicData.name.replace("Dân tộc ", "") : ""} tabKey={activeTab} />
          </motion.div>

          {/* Bộ điều hướng Tab triển lãm nghệ thuật */}
          {tabsList.length > 1 && (
            <div className="flex flex-wrap gap-2.5 justify-center border-b border-primary/10 pb-6 mb-4">
              {tabsList.map(tab => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-4.5 py-2.5 rounded-full text-sm font-extrabold transition-all relative overflow-hidden cursor-pointer shadow-xs active:scale-95 ${
                      isActive 
                        ? 'bg-primary text-white scale-102 shadow-md' 
                        : 'bg-card-bg text-text-main hover:bg-primary/5 border border-primary/10'
                    }`}
                  >
                    <TabIcon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary dark:text-amber-500'}`} />
                    <span>{tab.title}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Khu trưng bày di sản biến đổi thiết kế theo Tab chủ đề */}
          <div className="space-y-12">
            {activeSections
              .filter(sec => activeTab === 'all' || sec.key === activeTab)
              .map((section, index) => {
                const SectionIcon = section.icon;
                const contentText = ethnicData.content?.[section.key];
                const theme = THEME_STYLES[section.key] || THEME_STYLES.all;

                return (
                  <React.Fragment key={section.key}>
                    <motion.section 
                      variants={elegantReveal}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.12 }}
                      className={`border rounded-3xl shadow-md p-6 md:p-8 border-l-4 transition-all duration-300 hover:-translate-y-0.5 ${theme.bg}`}
                    >
                      {/* Tiêu đề Chuyên mục & Nút Audio thuyết minh chi tiết */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/5 pb-3 mb-6">
                        <h2 className="text-3xl font-bold text-text-main flex items-center gap-3.5">
                          <span className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs ${theme.titleIconBg}`}>
                            <SectionIcon className="w-6 h-6" />
                          </span>
                          <span className="font-display tracking-wide text-2xl md:text-3xl uppercase">
                            {section.title}
                          </span>
                        </h2>
                        
                        <AudioGuideButton textToRead={contentText} label={`Nghe thuyết minh ${section.title.toLowerCase()}`} />
                      </div>
                      
                      {/* Nội dung chi tiết */}
                      <p className={`text-base md:text-lg leading-relaxed mb-6 whitespace-pre-wrap pl-1 md:pl-2 ${theme.textStyle}`}>
                        {contentText}
                      </p>

                      {/* Bộ triển lãm ảnh tương tác đa năng */}
                      <InteractiveGallery 
                        id={id} 
                        sectionKey={section.key} 
                        sectionTitle={section.title} 
                        imagesList={ethnicData.images}
                        onZoom={handleZoomImage} 
                      />
                    </motion.section>
                    
                    {/* Thêm đường phân cách họa tiết di sản mạ vàng giữa các phần */}
                    {index < activeSections.length - 1 && <HeritageDivider />}
                  </React.Fragment>
                );
            })}
          </div>

          <HeritageDivider />

          {/* Hộp Trắc Nghiệm Di Sản Tương Tác */}
          <motion.div
            variants={elegantReveal}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            <HeritageQuiz id={id} ethnicData={ethnicData} />
          </motion.div>
          
        </div>
      </main>

      {/* Lightbox Modal để phóng to ảnh */}
      {activeImage && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4">
          {/* Nút Đóng Lightbox */}
          <button 
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Đóng ảnh"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Khung ảnh chính */}
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
