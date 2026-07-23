import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sun,
  Moon,
  Search,
  Gamepad2,
  X,
  Award,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  MountainSnow,
} from "lucide-react";
import data from "../data/data2.json";
import RegionFilter from "../components/RegionFilter";

// Bản đồ vùng miền cố định của 54 dân tộc
const REGION_MAPPING = {
  // Tây Bắc Bộ (11)
  "thai": "Tây Bắc Bộ", "muong": "Tây Bắc Bộ", "mong": "Tây Bắc Bộ", "dao": "Tây Bắc Bộ", "kho-mu": "Tây Bắc Bộ", 
  "ha-nhi": "Tây Bắc Bộ", "lao": "Tây Bắc Bộ", "khang": "Tây Bắc Bộ", "xinh-mun": "Tây Bắc Bộ", "la-ha": "Tây Bắc Bộ", 
  "lu": "Tây Bắc Bộ",
  
  // Đông Bắc Bộ & ĐB Sông Hồng (11)
  "kinh": "Đông Bắc Bộ & ĐB Sông Hồng", "tay": "Đông Bắc Bộ & ĐB Sông Hồng", "nung": "Đông Bắc Bộ & ĐB Sông Hồng", 
  "san-chay": "Đông Bắc Bộ & ĐB Sông Hồng", "san-diu": "Đông Bắc Bộ & ĐB Sông Hồng", "giay": "Đông Bắc Bộ & ĐB Sông Hồng", 
  "lo-lo": "Đông Bắc Bộ & ĐB Sông Hồng", "bo-y": "Đông Bắc Bộ & ĐB Sông Hồng", "co-lao": "Đông Bắc Bộ & ĐB Sông Hồng", 
  "la-chi": "Đông Bắc Bộ & ĐB Sông Hồng", "pu-peo": "Đông Bắc Bộ & ĐB Sông Hồng",
  
  // Bắc Trung Bộ & Duyên hải miền Trung (11)
  "cham": "Bắc Trung Bộ & Duyên hải miền Trung", "tho": "Bắc Trung Bộ & Duyên hải miền Trung", "chut": "Bắc Trung Bộ & Duyên hải miền Trung", 
  "o-du": "Bắc Trung Bộ & Duyên hải miền Trung", "bru-van-kieu": "Bắc Trung Bộ & Duyên hải miền Trung", "ta-oi": "Bắc Trung Bộ & Duyên hải miền Trung", 
  "co-tu": "Bắc Trung Bộ & Duyên hải miền Trung", "hre": "Bắc Trung Bộ & Duyên hải miền Trung", "co": "Bắc Trung Bộ & Duyên hải miền Trung", 
  "raglai": "Bắc Trung Bộ & Duyên hải miền Trung", "gie-trieng": "Bắc Trung Bộ & Duyên hải miền Trung",
  
  // Tây Nguyên (11)
  "gia-rai": "Tây Nguyên", "e-de": "Tây Nguyên", "ba-na": "Tây Nguyên", "xo-dang": "Tây Nguyên", 
  "mnong": "Tây Nguyên", "co-ho": "Tây Nguyên", "ma": "Tây Nguyên", "chu-ru": "Tây Nguyên", 
  "ro-mam": "Tây Nguyên", "brau": "Tây Nguyên", "xtieng": "Tây Nguyên",
  
  // Tây Nam Bộ & Các dân tộc có dân số cực ít (10)
  "khmer": "Tây Nam Bộ & Các dân tộc có dân số cực ít", "hoa": "Tây Nam Bộ & Các dân tộc có dân số cực ít", 
  "cho-ro": "Tây Nam Bộ & Các dân tộc có dân số cực ít", "ngai": "Tây Nam Bộ & Các dân tộc có dân số cực ít", 
  "pa-then": "Tây Nam Bộ & Các dân tộc có dân số cực ít", "phu-la": "Tây Nam Bộ & Các dân tộc có dân số cực ít", 
  "la-hu": "Tây Nam Bộ & Các dân tộc có dân số cực ít", "mang": "Tây Nam Bộ & Các dân tộc có dân số cực ít", 
  "cong": "Tây Nam Bộ & Các dân tộc có dân số cực ít", "si-la": "Tây Nam Bộ & Các dân tộc có dân số cực ít"
};

// Component hiển thị ảnh thumbnail với fallback
const ThumbnailWithFallback = ({ src, alt, fallbackText }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-linear-to-br from-amber-50 to-orange-100 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center text-primary dark:text-amber-500 text-xs p-4 text-center border-b border-primary/10">
        <Sun className="w-8 h-8 mb-2 opacity-50 animate-pulse" />
        <span className="font-medium font-serif italic text-sm">
          {fallbackText}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      onError={() => setError(true)}
    />
  );
};

const EthnicList = () => {
  // State tìm kiếm & Lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Tất cả");

  // Ref để cuộn xuống
  const listRef = useRef(null);

  const scrollToList = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // State cho Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Sync Dark Mode to HTML element and localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
    
    // Đặt lại tiêu đề trang chủ
    document.title = "Di Sản 54 Dân Tộc Việt Nam - Sắc Màu Văn Hóa";
  }, [darkMode]);

  // State Trắc nghiệm
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState(null);
  const [quizSelectedAnswer, setQuizSelectedAnswer] = useState(null);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizQuestionsAnswered, setQuizQuestionsAnswered] = useState(0);

  // Tạo câu hỏi trắc nghiệm mới
  const generateNewQuizQuestion = () => {
    // Chỉ chọn các dân tộc có nội dung tương đối phong phú
    const validEthnics = data.filter(
      (e) =>
        e.content &&
        (e.content.trang_phuc ||
          e.content.am_thuc ||
          e.content.phong_tuc ||
          e.content.chuyen_ke),
    );
    if (validEthnics.length === 0) return;

    const randomEthnic =
      validEthnics[Math.floor(Math.random() * validEthnics.length)];

    // Chọn ngẫu nhiên một khía cạnh văn hóa
    const categories = ["trang_phuc", "am_thuc", "phong_tuc", "chuyen_ke"];
    const catLabels = {
      trang_phuc: "Trang phục truyền thống",
      am_thuc: "Nét ẩm thực đặc sắc",
      phong_tuc: "Phong tục, lễ hội đặc trưng",
      chuyen_ke: "Câu chuyện truyền thuyết",
    };

    let selectedCat = null;
    let text = "";

    // Đảm bảo lấy được khía cạnh có văn bản
    while (!text && categories.length > 0) {
      const idx = Math.floor(Math.random() * categories.length);
      const cat = categories.splice(idx, 1)[0];
      if (randomEthnic.content[cat] && randomEthnic.content[cat].length > 50) {
        selectedCat = cat;
        text = randomEthnic.content[cat];
      }
    }

    if (!selectedCat) {
      // Fallback nếu không có nội dung thích hợp
      generateNewQuizQuestion();
      return;
    }

    // Cắt bớt văn bản nếu quá dài
    let hintText = text;
    if (hintText.length > 250) {
      hintText = hintText.substring(0, 240) + "...";
    }

    // Ẩn tên dân tộc đó trong câu hỏi
    const regexName = new RegExp(
      randomEthnic.name.replace("Dân tộc ", ""),
      "gi",
    );
    hintText = hintText.replace(regexName, "___");
    hintText = hintText.replace(/dân tộc này/gi, "___");

    // Tạo 4 đáp án gồm đáp án đúng và 3 đáp án sai ngẫu nhiên
    const correctName = randomEthnic.name;
    const incorrectChoices = data
      .filter((e) => e.name !== correctName)
      .map((e) => e.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const choices = [correctName, ...incorrectChoices].sort(
      () => 0.5 - Math.random(),
    );

    setQuizQuestion({
      ethnicId: randomEthnic.id,
      categoryLabel: catLabels[selectedCat],
      hint: hintText,
      correctAnswer: correctName,
      choices: choices,
    });
    setQuizSelectedAnswer(null);
    setQuizAnswered(false);
  };

  const startQuiz = () => {
    generateNewQuizQuestion();
    setQuizOpen(true);
  };

  const handleSelectAnswer = (choice) => {
    if (quizAnswered) return;
    setQuizSelectedAnswer(choice);
    setQuizAnswered(true);
    setQuizQuestionsAnswered((prev) => prev + 1);
    if (choice === quizQuestion.correctAnswer) {
      setQuizScore((prev) => prev + 1);
    }
  };

  // Lọc danh sách dân tộc
  const filteredEthnics = data.filter((ethnic) => {
    const region = REGION_MAPPING[ethnic.id] || "Chưa xác định";
    const matchesRegion =
      selectedRegion === "Tất cả" || region === selectedRegion;
    const matchesSearch = ethnic.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-bg-site font-sans text-text-main transition-colors duration-300 relative overflow-x-clip pb-20">
      {/* Nền hoa văn truyền thống */}
      <div className="absolute inset-0 bg-ethnic-pattern pointer-events-none"></div>

      {/* Trang trí vòng tròn sáng (Glow Orbs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary/10 blur-3xl pointer-events-none animate-pulse-slow"></div>
      <div
        className="absolute bottom-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-secondary/15 blur-3xl pointer-events-none animate-pulse-slow"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Header / Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-bg-site/85 backdrop-blur-md border-b border-primary/10 py-4 px-6 md:px-12 flex justify-between items-center transition-all shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white shadow-md">
            <span className="font-display font-bold text-xl">★</span>
          </div>
          <div>
            <h2 className="font-display font-bold text-lg md:text-xl tracking-wider text-primary dark:text-amber-500 uppercase">
              Di Sản 54 Dân Tộc
            </h2>
            <p className="text-sm font-semibold font-cursive text-primary dark:text-amber-400">
              Bản sắc Việt Nam
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Nút Trắc nghiệm */}
          <button
            onClick={startQuiz}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-linear-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>Thử Thách</span>
          </button>

          {/* Nút chuyển chế độ Sáng/Tối */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full border border-primary/20 bg-card-bg text-primary dark:text-amber-400 hover:bg-primary/10 transition-colors shadow-xs cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="w-full min-h-[calc(100vh-80px)] flex flex-col items-center justify-center relative z-10 bg-cover bg-center bg-no-repeat pt-12 pb-16"
        style={{ backgroundImage: "url(/images/hero-bg.jpg)" }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-[2px]"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 text-center w-full">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/30 bg-black/30 backdrop-blur-md text-amber-300 mb-6 animate-float shadow-lg">
            <MountainSnow className="w-5 h-5 text-amber-400" />
            <span className="font-cursive text-2xl lowercase first-letter:uppercase font-bold text-white">
              Khám phá 54 Dân tộc anh em
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl text-white tracking-wide leading-tight mb-4 drop-shadow-lg">
            <span className="font-rigid font-extrabold uppercase">
              Sắc Màu Văn Hóa
            </span>{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-200 to-orange-400 font-cursive text-6xl md:text-[5.5rem] font-bold mt-2 inline-block leading-normal py-2 drop-shadow-xl">
              Dân Tộc Việt Nam
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/90 text-lg md:text-xl leading-relaxed mb-10 font-medium drop-shadow-md">
            Khám phá chiều sâu lịch sử, nét độc đáo trong trang phục, ẩm thực,
            phong tục và những câu chuyện truyền thuyết thiêng liêng của các dân
            tộc anh em trên mảnh đất hình chữ S.
          </p>

          {/* Nút Call-to-action cuộn xuống */}
          <button
            onClick={scrollToList}
            className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-orange-700 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer animate-float"
          >
            Bắt đầu khám phá <ChevronDown className="w-5 h-5 animate-bounce" />
          </button>
        </div>
      </section>

      {/* Main Grid */}
      <main
        className="max-w-7xl mx-auto px-6 md:px-12 pb-24 relative z-10 pt-20 md:pt-32"
        ref={listRef}
      >
        {/* Thanh tìm kiếm & bộ lọc (Di chuyển xuống đây) */}
        <div className="max-w-4xl mx-auto bg-card-bg border border-primary/10 p-5 rounded-3xl shadow-xl mb-16 relative z-20">
          {/* Input tìm kiếm */}
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm tên dân tộc (ví dụ: Thái, Kinh, Ê Đê...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-primary/15 bg-bg-site focus:outline-hidden focus:ring-2 focus:ring-primary/50 text-text-main placeholder-text-muted/60 transition-all text-base font-semibold shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Selector Vùng Miền */}
          <RegionFilter
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
          />
        </div>

        {filteredEthnics.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredEthnics.map((ethnic) => {
              const region = REGION_MAPPING[ethnic.id] || "Chưa xác định";
              // Class badge vùng miền để phân biệt màu sắc
              let badgeColor =
                "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300";
              if (region === "Tây Bắc")
                badgeColor =
                  "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-300";
              else if (region === "Đông Bắc")
                badgeColor =
                  "bg-teal-100 text-teal-800 dark:bg-teal-950/50 dark:text-teal-300";
              else if (region === "Trường Sơn - Tây Nguyên")
                badgeColor =
                  "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300";
              else if (region === "Đồng bằng & Nam Bộ")
                badgeColor =
                  "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300";

              return (
                <Link
                  key={ethnic.id}
                  to={`/dan-toc/${ethnic.id}`}
                  className="group bg-card-bg border border-primary/10 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 flex flex-col h-full relative"
                >
                  {/* Badge vùng miền trên ảnh */}
                  <span
                    className={`absolute top-3 left-3 z-20 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-xs ${badgeColor}`}
                  >
                    {region}
                  </span>

                  {/* Thumbnail */}
                  <div className="w-full aspect-[4/3] bg-linear-to-b from-transparent to-black/20 overflow-hidden relative">
                    <ThumbnailWithFallback
                      src={`/images/${ethnic.id}/trang_phuc_1.jpg`}
                      alt={`Ảnh đại diện ${ethnic.name}`}
                      fallbackText={ethnic.name}
                    />
                    {/* Lớp phủ gradient nhẹ khi hover */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                      <span className="text-white text-xs font-semibold flex items-center gap-1">
                        Khám phá chi tiết{" "}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                  {/* Thông tin */}
                  <div className="p-5 flex-grow flex flex-col justify-between border-t border-primary/5">
                    <div>
                      <h3 className="font-sans text-xl md:text-2xl font-bold text-text-main group-hover:text-primary dark:group-hover:text-amber-400 transition-colors tracking-wide line-clamp-1">
                        {ethnic.name.replace("Dân tộc ", "")}
                      </h3>
                      {ethnic.content.trang_phuc && (
                        <p className="text-sm text-text-muted line-clamp-2 mt-2 leading-relaxed font-medium">
                          {ethnic.content.trang_phuc}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-primary/5 flex items-center justify-between text-sm text-text-muted">
                      <span className="italic font-serif font-semibold">
                        Di sản Việt Nam
                      </span>
                      <span className="font-bold text-primary dark:text-amber-400 group-hover:underline flex items-center gap-0.5">
                        Chi tiết
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-card-bg rounded-2xl border border-primary/10 max-w-lg mx-auto shadow-md">
            <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4 opacity-75" />
            <h3 className="text-lg font-bold">
              Không tìm thấy dân tộc phù hợp
            </h3>
            <p className="text-sm text-text-muted mt-2">
              Vui lòng thử từ khóa khác hoặc chuyển bộ lọc vùng miền về "Tất
              cả".
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedRegion("Tất cả");
              }}
              className="mt-6 px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Reset bộ lọc
            </button>
          </div>
        )}
      </main>

      {/* Modal Game Trắc nghiệm văn hóa */}
      {quizOpen && quizQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-bg-site max-w-lg w-full rounded-3xl border border-primary/20 shadow-2xl overflow-hidden relative animate-float">
            {/* Header Modal */}
            <div className="bg-linear-to-r from-primary to-orange-600 dark:from-amber-500 dark:to-orange-700 p-5 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 animate-bounce" />
                <div>
                  <h3 className="font-display font-bold text-lg leading-tight">
                    Thử Thách Di Sản
                  </h3>
                  <p className="text-[10px] opacity-90 uppercase tracking-wider font-semibold">
                    Đúng: {quizScore} / {quizQuestionsAnswered} câu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuizOpen(false)}
                className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="p-6 md:p-8">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-amber-400/10 dark:text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                💡 Khởi nguồn từ: {quizQuestion.categoryLabel}
              </div>

              <blockquote className="bg-card-bg border-l-4 border-primary p-4 rounded-r-xl italic text-sm md:text-base leading-relaxed text-text-main mb-6 font-light shadow-inner max-h-[140px] overflow-y-auto">
                "{quizQuestion.hint}"
              </blockquote>

              <p className="text-xs font-bold text-text-muted mb-3 uppercase tracking-wider">
                Đoạn văn trên đang nói về dân tộc nào?
              </p>

              {/* Choices */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {quizQuestion.choices.map((choice, i) => {
                  let buttonStyle =
                    "border-primary/20 hover:bg-primary/5 text-text-main";
                  let Icon = null;

                  if (quizAnswered) {
                    if (choice === quizQuestion.correctAnswer) {
                      buttonStyle =
                        "bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-bold scale-[1.02]";
                      Icon = CheckCircle2;
                    } else if (choice === quizSelectedAnswer) {
                      buttonStyle =
                        "bg-rose-100 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-300 font-bold";
                      Icon = X;
                    } else {
                      buttonStyle = "opacity-40 border-primary/10";
                    }
                  } else {
                    buttonStyle =
                      "hover:border-primary/50 hover:bg-primary/5 active:scale-98";
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelectAnswer(choice)}
                      disabled={quizAnswered}
                      className={`p-3.5 rounded-xl border text-left text-xs md:text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                    >
                      <span>{choice}</span>
                      {Icon && <Icon className="w-4.5 h-4.5 shrink-0 ml-1.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Kết quả & Actions */}
              {quizAnswered && (
                <div className="mt-4 pt-4 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-xs text-text-muted">
                    {quizSelectedAnswer === quizQuestion.correctAnswer ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        🎉 Chính xác! Bạn rất am hiểu văn hóa!
                      </span>
                    ) : (
                      <span>
                        Đáp án đúng là:{" "}
                        <strong className="text-primary dark:text-amber-400">
                          {quizQuestion.correctAnswer}
                        </strong>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link
                      to={`/dan-toc/${quizQuestion.ethnicId}`}
                      onClick={() => setQuizOpen(false)}
                      className="px-4 py-2 border border-primary/20 hover:bg-primary/5 text-xs font-semibold rounded-xl text-center flex-grow sm:flex-grow-0 cursor-pointer"
                    >
                      Xem chi tiết
                    </Link>
                    <button
                      onClick={generateNewQuizQuestion}
                      className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-xl flex-grow sm:flex-grow-0 cursor-pointer"
                    >
                      Tiếp tục
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EthnicList;
