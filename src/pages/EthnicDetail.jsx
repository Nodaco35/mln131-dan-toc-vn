import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import data from '../data/data.json';

// Component hiển thị ảnh, nếu ảnh bị lỗi (chưa có) sẽ hiển thị khung báo lỗi thay thế
const ImageWithFallback = ({ src, alt, fallbackText, className }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`bg-gray-100 flex flex-col items-center justify-center text-gray-400 italic text-sm border-2 border-dashed border-gray-300 ${className}`}>
        <svg className="w-8 h-8 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <span className="px-2 text-center">{fallbackText}</span>
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`object-cover ${className}`}
      onError={() => setError(true)}
    />
  );
};

const EthnicDetail = () => {
  const { id } = useParams();
  
  // Tìm dữ liệu dân tộc dựa trên id từ URL
  const ethnicData = data.find(item => item.id === id);

  if (!ethnicData) {
    return <div className="p-8 text-center text-xl text-red-600 font-bold">Không tìm thấy thông tin dân tộc!</div>;
  }

  // Khai báo các chuyên mục nội dung
  const sections = [
    { key: 'trang_phuc', title: 'Trang Phục' },
    { key: 'am_thuc', title: 'Ẩm Thực' },
    { key: 'phong_tuc', title: 'Phong Tục' },
    { key: 'chuyen_ke', title: 'Chuyện Kể' },
  ];

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
      {/* Header */}
      <header className="bg-primary text-white py-6 shadow-md mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center tracking-wide uppercase">
          {ethnicData.name}
        </h1>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Cột trái: Mascot & Intro */}
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 w-full sticky top-8">
              <div className="w-full aspect-square bg-white rounded-xl mb-6 flex items-center justify-center border-4 border-secondary border-dashed overflow-hidden">
                {/* Gọi ảnh Mascot từ thư mục public/images/{id}/mascot.png */}
                <ImageWithFallback 
                  src={`/images/${id}/mascot.png`}
                  alt={`Mascot ${ethnicData.name}`}
                  fallbackText="Thiếu ảnh Mascot"
                  className="w-full h-full"
                />
              </div>
              <div className="bg-orange-100 p-4 rounded-lg relative">
                {/* Speech bubble arrow */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-orange-100"></div>
                <p className="text-lg leading-relaxed text-gray-800 italic font-medium">
                  "{ethnicData.mascot_intro}"
                </p>
              </div>
            </div>
          </div>

          {/* Cột phải: Storytelling */}
          <div className="lg:col-span-8 space-y-12">
            {sections.map(section => (
              <section key={section.key} className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-primary">
                <h2 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center text-sm">✦</span>
                  {section.title}
                </h2>
                
                <div className="text-lg leading-relaxed text-gray-700 mb-8 whitespace-pre-wrap">
                  {ethnicData.content[section.key]}
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(imgIndex => (
                    <div key={imgIndex} className="group cursor-pointer flex flex-col">
                      <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg shadow-inner overflow-hidden flex items-center justify-center transition-transform transform group-hover:scale-105 duration-300">
                        {/* Gọi ảnh Nội dung từ thư mục public/images/{id}/{chuyên-mục}_{index}.jpg */}
                        <ImageWithFallback 
                          src={`/images/${id}/${section.key}_${imgIndex}.jpg`}
                          alt={`${section.title} ${imgIndex}`}
                          fallbackText={`Thiếu ảnh ${section.key}_${imgIndex}.jpg`}
                          className="w-full h-full"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-3 text-center italic">Trích nguồn: ...</p>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default EthnicDetail;
